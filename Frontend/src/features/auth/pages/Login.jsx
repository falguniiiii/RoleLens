import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import AuthShell from '../components/AuthShell'

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await handleLogin({ email, password })
    if (result.ok) navigate('/', { replace: true })
    else setError(result.error)
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your interview prep." error={error}
      footer={<>Don't have an account? <Link to="/register">Create one</Link></>}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" name="email"
            placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" name="password"
            placeholder="Enter your password" autoComplete="current-password" required />
        </div>
        <button className="button primary-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </AuthShell>
  )
}

export default Login
