// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "std/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

interface Order {
  approved?: boolean;
  cart_price?: number | null;
  cart_products?: string[] | null;
  created_at?: string | null;
  delivery_price?: number | null;
  destination_id?: string | null;
  email?: string | null;
  id?: string;
  name?: string | null;
  paid?: boolean;
  phone?: string | null;
  total_price?: number | null;
  updated_at?: string | null;
  user_id?: string | null;
}

async function getOrder(supabaseClient: SupabaseClient, id: string) {
  const { data: order, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({ order }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function getAllOrders(supabaseClient: SupabaseClient) {
  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*");
  if (error) throw error;

  return new Response(JSON.stringify({ orders }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function deleteOrder(supabaseClient: SupabaseClient, id: string) {
  const { error } = await supabaseClient.from("orders").delete().eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({ status: "Order deleted" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateOrder(
  supabaseClient: SupabaseClient,
  id: string,
  order: Order
) {
  const { error } = await supabaseClient
    .from("orders")
    .update(order)
    .eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({ order }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function createOrder(supabaseClient: SupabaseClient, order: Order) {
  const { error } = await supabaseClient.from("orders").insert(order);
  if (error) throw error;

  return new Response(JSON.stringify({ order }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

serve(async (req) => {
  const { url, method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // For more details on URLPattern, check https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    const orderPattern = new URLPattern({ pathname: "/restful-tasks/:id" });
    const matchingPath = orderPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let order = null;
    if (method === "POST" || method === "PUT") {
      const body = await req.json();
      order = body.order;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === "GET":
        return getOrder(supabaseClient, id as string);
      case id && method === "PUT":
        return updateOrder(supabaseClient, id as string, order);
      case id && method === "DELETE":
        return deleteOrder(supabaseClient, id as string);
      case method === "POST":
        return createOrder(supabaseClient, order);
      case method === "GET":
        return getAllOrders(supabaseClient);
      default:
        return getAllOrders(supabaseClient);
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
