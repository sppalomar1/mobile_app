// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ksrjbpdtltollfeulfkf.supabase.co'; // <-- replace
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcmpicGR0bHRvbGxmZXVsZmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDIyODksImV4cCI6MjA3ODYxODI4OX0.ksJlD4djwcH7wPjJXmmFIzpwAGcnyb5P3OkWArSFR7o'; // <-- replace

// Hardcoded admin email (Option 1)
export const ADMIN_EMAIL = 'admin@gmail.com'; // <-- set the admin email you want

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
