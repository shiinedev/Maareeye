import { createClient } from "@supabase/supabase-js";



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;



// Optional safety check
if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing. Please set it in your environment variables.");
  }
  if (!supabaseKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is missing. Please set it in your environment variables.");
  }
  
const supabase = createClient(supabaseUrl, supabaseKey,{
    auth:{
        persistSession:true,
        autoRefreshToken:true
    },
    realtime:{
        params:{
            eventsPerSecond:10,
        }
    }
});

export default supabase
        