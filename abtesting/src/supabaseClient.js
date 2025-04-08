import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://kfcobtxhdzhmmnjegbmp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmY29idHhoZHpobW1uamVnYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzA1MTIsImV4cCI6MjA1OTcwNjUxMn0.T26IEAusGPkJbtS8osNfraaUF6d8PK9ulMrNl0yfXto';

// Make sure to replace the placeholders above with your actual values
// The URL should start with 'https://' and end with '.supabase.co'
// The anon key should be a long string starting with 'eyJ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 