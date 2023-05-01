import { serve } from "std/server";
import handler from "./handler.tsx";

console.log("Waddup Og Images edge Functions!");

serve(handler);
