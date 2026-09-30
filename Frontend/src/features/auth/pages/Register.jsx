import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import AuthShell from '../components/AuthShell'

const Register = () => {
  const navigate = useNavigate()
  const { loading, handleRegister } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    const result = await handleRegister({ username, email, password })
    if (result.ok) navigate('/', { replace: true })
    else setError(result.error)
  }

  return (
    <AuthShell title="Create your account" subtitle="Start turning job descriptions into winning strategies." error={error}
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" id="username" name="username"
            placeholder="Choose a username" autoComplete="username" minLength={3} maxLength={30} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" name="email"
            placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" name="password"
            placeholder="At least 8 characters" autoComplete="new-password" minLength={8} maxLength={72} required />
        </div>
        <button className="button primary-button" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  )
}

export default Register
