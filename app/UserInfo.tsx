"use client"

import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function UserInfo() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!email) return <p>Not logged in</p>

  return <p>Logged in as: <strong>{email}</strong></p>
}
