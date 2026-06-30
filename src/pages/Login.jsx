import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
  const result = login(email, password)
  if (result.success) {
    navigate('/dashboard')
  } else {
    setError(result.error)
  }
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">HRMS</h1>
        <p className="text-center text-gray-500 mb-6">Human Resource Management</p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="admin@hrms.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
  <label className="block text-gray-700 mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  </div>
</div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

<p className="text-center text-gray-500 text-sm mt-2">
  Don't have an account?{' '}
  <Link to="/register" className="text-blue-600 hover:underline font-medium">
    Register
  </Link>
</p>
      </div>
    </div>
  )
}

export default Login