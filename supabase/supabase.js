import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujlynmacqpufokpqdcfl.supabase.co'
const supabaseAnonKey = 'TU-CLAVE-ANONIMA-DE-SUPABASEeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbHlubWFjcXB1Zm9rcHFkY2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTkzMTYsImV4cCI6MjA2NjU5NTMxNn0.Moy7OWSwJKO9CIw3KjHFKRDIkST8taS_E9r7PZZu8Dw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
