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
  const [showPassword, setShowPassword] = useState(false)
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
          <div className="password-input-wrapper">

            <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
           />

           <button
           type="button"
           className="password-toggle"
           onClick={() => setShowPassword((visible) => !visible)}
           aria-label={showPassword ? 'Hide password' : 'Show password'}
           >

            {showPassword ? (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              >

               <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
               <circle cx="12" cy="12" r="3" />
               </svg>
               ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c7 0 10 8 10 8a17.8 17.8 0 0 1-3.1 4.4" />
                  <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8c1.5 0 2.8-.3 4-.8" />
                  </svg>
               )}
              </button>
             </div>
          </div>

        <button className="button primary-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </AuthShell>
  )
}

export default Login
