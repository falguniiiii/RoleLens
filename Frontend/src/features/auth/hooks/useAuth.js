import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from '../services/auth.api'

// each handler returns { ok, error } so pages can show real messages
export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext)

  const run = async (fn) => {
    setLoading(true)
    try {
      const data = await fn()
      setUser(data.user)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = ({ email, password }) => run(() => login({ email, password }))
  const handleRegister = ({ username, email, password }) => run(() => register({ username, email, password }))

  const handleLogout = async () => {
    try { await logout() } catch { /* cookie is cleared locally either way */ }
    setUser(null)
  }

  return { user, loading, handleLogin, handleRegister, handleLogout }
}
