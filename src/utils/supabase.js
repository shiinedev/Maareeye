import { createClient } from "@supabase/supabase-js";



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
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
        