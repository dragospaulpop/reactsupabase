import { useEffect, useState } from 'react'
import supabase from './supabase'

import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSignedIn(session?.user?.email)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.log(error)
      setError(error.message)
    }

    if (data) {
      const { id, email } = data.user

      const { error } = await supabase
        .from('users')
        .insert({ id, email, username: 'Dragos' })

      setEmail('')
      setPassword('')
      setError('')

      if (error) {
        console.log(error)
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    setSignedIn(false)

    if (error) {
      console.log(error)
      setError(error.message)
    }
  }

  const signIn = async (e) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setEmail('')
    setPassword('')
    setError('')

    if (error) {
      console.log(error)
      setError(error.message)
    }
  }

  if (signedIn) {
    return <>
      <p>Already signed in: {signedIn}</p>
      <button onClick={signOut}>Sign out</button>
    </>
  } else {
    return (
      <>
        <p>{error}</p>
        <form>
          <div>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={signUp}>sign up</button>
            <button onClick={signIn}>sign in</button>
          </div>
        </form>
      </>
    )
  }
}

export default App
