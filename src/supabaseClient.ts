import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryxsadnykjzbawhzgukk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ'; // sua chave completa

// A PALAVRA 'export' É OBRIGATÓRIA AQUI:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

