//  Order types
export interface Order {
  order_id: string;
  store_id: string;
  order_time: string;
  estimated_pickup_time: string;
  utc_offset_minutes: string;
  payment_method: string;
  currency: string;
  order_code: string;
  allergy_info: string;
  special_requirements: string;
  estimated_total_price: number;
  delivery_fee: any;
  minimum_basket_surcharge: any;
  customer_cash_payment_amount: number;
  courier: Courier;
  customer: Customer;
  products: Product[];
  delivery_address: DeliveryAddress;
  bundled_orders: string[];
  pick_up_code: string;
  is_picked_up_by_customer: boolean;
  cutlery_requested: boolean;
  partner_discounts_products: number;
  partner_discounted_products_total: number;
  total_customer_to_pay: any;
  loyalty_card: string;
}

export interface Courier {
  name: string;
  phone_number: string;
}

export interface Customer {
  name: string;
  phone_number: string;
  hash: string;
  invoicing_details: InvoicingDetails;
}

export interface InvoicingDetails {
  company_name: string;
  company_address: string;
  tax_id: string;
}

export interface Product {
  id: string;
  purchased_product_id: string;
  name: string;
  price: number;
  quantity: number;
  attributes: Attribute[];
}

export interface Attribute {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryAddress {
  label: string;
  latitude: number;
  longitude: number;
}
//  Menu types
export interface Menu {
  attributes: Attribute[];
  attribute_groups: AttributeGroup[];
  products: Product[];
  collections: Collection[];
  supercollections: Supercollection[];
}

export interface Attribute {
  id: string;
  name: string;
  selected_by_default: boolean;
  price_impact: number;
  available?: boolean;
}

export interface AttributeGroup {
  id: string;
  name: string;
  min: number;
  max: number;
  collapse: boolean;
  multiple_selection: boolean;
  attributes: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  extra_image_urls?: string[];
  description: string;
  attributes_groups?: string[];
  available?: boolean;
  restrictions?: Restrictions;
}

export interface Restrictions {
  is_tobacco?: boolean;
  is_alcoholic?: boolean;
}

export interface Collection {
  name: string;
  position: number;
  image_url: string;
  sections: Section[];
}

export interface Section {
  name: string;
  position: number;
  products: string[];
}

export interface Supercollection {
  name: string;
  position: number;
  image_url: string;
  collections: string[];
}
