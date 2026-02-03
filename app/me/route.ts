import { supabase } from "../supabase";


export async function GET() {
const session = await supabase.auth.getSession();
const accessToken = session.data.session?.access_token;
const backendUrl = process.env.BACKEND_URL;

const res = await fetch(`${backendUrl}/me`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
console.log(data)
}
