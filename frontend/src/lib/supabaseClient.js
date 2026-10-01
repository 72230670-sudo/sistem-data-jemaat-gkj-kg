import { createClient } from '@supabase/supabase-js'

// Mengambil variabel dari file .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
