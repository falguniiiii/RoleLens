import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'

const Navbar = () => {
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await handleLogout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand"><span className="brand__mark">R</span>RoleLens</Link>
      <div className="navbar__right">
        {user && <span className="navbar__user" title={user.email}>{user.username}</span>}
        <button className="button ghost-button" onClick={onLogout} type="button">Log out</button>
      </div>
    </header>
  )
}

export default Navbar
