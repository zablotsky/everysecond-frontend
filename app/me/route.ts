import { supabase } from "../supabase";


export async function GET() {
const session = await supabase.auth.getSession();
const accessToken = session.data.session?.access_token;
const link = process.env.BACKEND_URL + "/me";

const res = await fetch(link, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
console.log(data)
}
