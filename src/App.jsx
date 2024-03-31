import { useEffect, useState } from 'react'
import supabase from './supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import './App.css'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { id, email } = session.user

        const { error } = await supabase.from('users').upsert({ id, email, username: 'Dragos' })

        if (error) {
          console.log('Error updating user:', error.message)
        }

        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log('Error logging out:', error.message)
    } else {
      setSession(null)
    }
  }

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} theme="dark" />)
  }
  else {
    return <>
      <p>Logged in as {session?.user?.email}</p>
      <button onClick={signOut}>Sign out</button>
    </>
  }
}

export default App
