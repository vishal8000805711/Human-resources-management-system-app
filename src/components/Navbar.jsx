import { useAuth } from '../context/AuthContext'

function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <div className="bg-white shadow px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 text-2xl"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
          A
        </div>
        <span className="text-gray-600 hidden sm:block">{user?.name || 'Admin'}</span>
      </div>
    </div>
  )
}

export default Navbar