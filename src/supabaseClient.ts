import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryxsadnykjzbawhzgukk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua chave completa

// A PALAVRA 'export' É OBRIGATÓRIA AQUI:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
