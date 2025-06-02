import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// REEMPLAZAR CON TUS CREDENCIALES REALES DE SUPABASE
const supabaseUrl = "https://ukydamvjknebkkufqtub.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreWRhbXZqa25lYmtrdWZxdHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDUyODEsImV4cCI6MjA2MjA4MTI4MX0.g6OZQy5Lo4j9YSjTKqkBdx4bUvlCDuGA5SxSnuoV4Sk"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// REEMPLAZAR CON EL ID REAL DEL POSTOR
export const CURRENT_POSTOR_ID = "32704200-3697-4269-972f-1a3c97c97f50"
