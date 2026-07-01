import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('Employee')
const [companyCodeInput, setCompanyCodeInput] = useState('')
const [department, setDepartment] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = () => {
    setError('')
    setSuccess('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (role === 'Employee' && !companyCodeInput.trim()) {
  setError('Please enter your company code from your HR')
  return
}
if (role === 'Employee' && !department) {
  setError('Please select your department')
  return
}

    const result = register(name, email, password, role, companyCodeInput.trim().toUpperCase(), department)

    if (result.success) {
      if (role === 'HR') {
        setGeneratedCode(result.companyCode)
        setSuccess('Account created! Save your company code below.')
      } else {
        setSuccess('Account created! Redirecting to login...')
        setTimeout(() => navigate('/'), 2000)
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">HRMS</h1>
        <p className="text-center text-gray-500 mb-6">Create a new account</p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center mb-4 bg-green-50 py-2 rounded-lg">{success}</p>
        )}

        {generatedCode ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2">Your Company Code:</p>
            <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg py-4 px-6 mb-4">
              <span className="text-2xl font-bold text-blue-700 tracking-wider">{generatedCode}</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Share this code with your employees so they can register under your company. You'll also need it later if you forget it.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Vishal Sevada"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">I am registering as</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={role}
                onChange={(e) => { setRole(e.target.value); setCompanyCodeInput('') }}
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR / Admin</option>
              </select>
            </div>

            {/* Company Code - only for Employee */}
            {role === 'Employee' && (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1">Company Code</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
        placeholder="e.g. CMP-AB12CD"
        value={companyCodeInput}
        onChange={(e) => setCompanyCodeInput(e.target.value)}
      />
      <p className="text-gray-400 text-xs mt-1">Ask your HR for this code</p>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 mb-1">Department</label>
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Select Department</option>
        <option>Engineering</option>
        <option>Design</option>
        <option>HR</option>
        <option>Sales</option>
        <option>Finance</option>
        <option>Marketing</option>
        <option>Operations</option>
        <option>Legal</option>
      </select>
    </div>
  </>
)}

            {role === 'HR' && (
              <p className="text-gray-400 text-xs mb-6">A unique company code will be generated for you after registration — you'll share it with your employees.</p>
            )}

            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Account
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Register