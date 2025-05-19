import { createClient } from '@supabase/supabase-js';

// اطلاعات پروژه شما
const SUPABASE_URL = 'https://olcosdkqtwvxaaxhujim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sY29zZGtxdHd2eGFheGh1amltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDQ0MjcsImV4cCI6MjA1MTIyMDQyN30.nVhilr4aLM5wa4U28ci2HM9bsKvl4x4xwephpi6M6ig';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;
