import { createClient } from "@supabase/supabase-js/dist/index.cjs";

const supabaseUrl = 'https://nvypbkqjpjcmchnihcon.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52eXBia3FqcGpjbWNobmloY29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjUzNjMsImV4cCI6MjA5MzY0MTM2M30.U64qfyBNZJ-lJTye9UmVh9tVIQ_zJE4EUlMcoNpndmQ'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)