import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../environment";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabaseClient;
