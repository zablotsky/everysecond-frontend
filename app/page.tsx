"use client";
import UserInfo from './UserInfo'
import { supabase } from "./supabase";

export default function Home() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000"
      }
    });
  };

  return (
    <>
      <button onClick={login}>Login with Google</button>;
    </>
  )
}
