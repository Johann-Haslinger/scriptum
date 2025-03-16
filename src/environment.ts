let retrievalFunction: Record<string, string | undefined>;
retrievalFunction = process.env as Record<string, string | undefined>;

export const SUPABASE_URL = retrievalFunction.SUPABASE_URL ?? "";
export const SUPABASE_KEY = retrievalFunction.SUPABASE_KEY ?? "";
