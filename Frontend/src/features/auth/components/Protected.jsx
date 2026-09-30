import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user } = useAuth()

  if (loading) return (<main className="loading-screen"><div className="spinner" aria-label="Loading" /></main>)
  if (!user) return <Navigate to="/register" replace />

  return children
}

export default Protected
