// Diecast Muscat — Database type definitions
// Replace with `supabase gen types typescript` output once project is provisioned.

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: Partial<Product>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: Partial<OrderInsert>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at">;
        Update: Partial<Omit<OrderItem, "id" | "created_at">>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: {
          product_id: string;
          customer_id: string;
          rating: number;
          title?: string | null;
          comment: string | null;
          is_verified_purchase: boolean;
        };
        Update: {
          product_id?: string;
          customer_id?: string;
          rating?: number;
          title?: string | null;
          comment?: string | null;
          is_verified_purchase?: boolean;
        };
        Relationships: [];
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CartItem, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      wishlists: {
        Row: Wishlist;
        Insert: Omit<Wishlist, "id" | "created_at">;
        Update: Partial<Omit<Wishlist, "id" | "created_at">>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "id" | "created_at" | "last_login">;
        Update: Partial<Omit<AdminUser, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProductCategory = "cars" | "planes" | "trucks" | "bikes";
export type ProductScale = "1:64" | "1:43" | "1:24" | "1:18" | "1:12";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  scale: ProductScale | null;
  brand: string | null;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  features: Record<string, unknown>;
  is_limited_edition: boolean;
  is_featured: boolean;
  condition: "mint" | "new" | "sealed";
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at" | "rating" | "review_count"> & {
  rating?: number;
  review_count?: number;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_id: string | null;
  payment_method: string | null;
  invoice_number: string | null;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export type OrderInsert = Omit<Order, "id" | "created_at" | "updated_at" | "shipped_at" | "delivered_at">;

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

export type ReviewInsert = Omit<Review, "id" | "created_at">;

export interface CartItem {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  customer_id: string;
  product_id: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string | null;
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
  last_login: string | null;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
}
