
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ApiKey = {
  id: string;
  merchant_id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
};

export type Transaction = {
  id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
};

export type PaymentSettings = {
  id: string;
  merchant_id: string;
  accepted_currencies: string[];
  settlement_currency: string;
  auto_convert: boolean;
};

export type Webhook = {
  id: string;
  merchant_id: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret: string;
};

const getUserId = async () =>{
  const user = await supabase.auth.getUser()

  const id = user.data.user.id
return id
}
// API Keys queries
export const apiKeyQueries = {
  // Get all API keys for the current user
  getApiKeys: async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
  // Create a new API key
  createApiKey: async (keyValue: string) => {
    const { data, error } = await supabase
      .from('api_keys')
      .insert({ key_value: keyValue })
      .select()
      .single()

    if (error) throw error
    return data
  },
  // Delete an API key
  deleteApiKey: async (id: string) => {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
// Webhook queries
export const webhookQueries = {
  // Get all webhooks for the current user
  getWebhooks: async () => {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
  // Create a new webhook
  createWebhook: async (url:string) => {
    
    const { data, error } = await supabase
      .from('webhooks')
      .insert({ url, user_id: await getUserId(), is_active:true })
      .select()
      .single()

    if (error) throw error
    return data
  },
  // Update webhook status
  updateWebhookStatus: async (id: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('webhooks')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
  // Delete a webhook
  deleteWebhook: async (id: string) => {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true;
  }
}
// Payment preferences queries
export const paymentPreferencesQueries = {
  // Get payment preferences for the current user
  getPaymentPreferences: async () => {
    const { data, error } = await supabase
      .from('payment_preferences')
      .select('*')
      .single()

    if (error) throw error
    return data
  },
  // Update payment preferences
  updatePaymentMethod: async (method: 'instant' | 'qr') => {
    const { data, error } = await supabase
      .from('payment_preferences')
      .upsert({ payment_method: method })
      .select()
      .single()

    if (error) throw error
    return data
  }
}