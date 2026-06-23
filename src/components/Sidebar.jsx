import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/employees', label: 'Employees', icon: '👥' },
  { path: '/attendance', label: 'Attendance', icon: '📅' },
  { path: '/leave', label: 'Leave', icon: '🏖️' },
  { path: '/payroll', label: 'Payroll', icon: '💰' },
]

function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 min-h-screen bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">⚡ HRMS</h1>
            <p className="text-gray-400 text-xs mt-1">Human Resource System</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-lg">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
            <p className="text-gray-400 text-xs">{user?.email || 'admin@hrms.com'}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white transition text-sm font-medium"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>

      </div>
    </>
  )
}

export default Sidebar