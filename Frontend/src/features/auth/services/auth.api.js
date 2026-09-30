import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true
})

// turn any axios failure into an Error carrying the server's message
const fail = (err, fallback) => {
  throw new Error(err.response?.data?.error || err.response?.data?.message || fallback)
}

export async function register({ username, email, password }) {
  try {
    return (await api.post('/api/auth/register', { username, email, password })).data
  } catch (err) { fail(err, 'Registration failed. Please try again.') }
}

export async function login({ email, password }) {
  try {
    return (await api.post('/api/auth/login', { email, password })).data
  } catch (err) { fail(err, 'Login failed. Please try again.') }
}

export async function logout() {
  try {
    return (await api.post('/api/auth/logout')).data
  } catch (err) { fail(err, 'Logout failed.') }
}

export async function getMe() {
  try {
    return (await api.get('/api/auth/get-me')).data
  } catch (err) { fail(err, 'Not authenticated') }
}
