import { useState } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'

function Employees() {
  const { employees } = useEmployees()
  const { isHR, removeEmployee } = useAuth()
  const [search, setSearch] = useState('')
  const [, forceRender] = useState(0)

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'On Leave') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const handleDelete = (email, name) => {
    if (confirm(`Remove ${name} from your company? They will not be able to rejoin with this email.`)) {
      removeEmployee(email)
      forceRender(n => n + 1) // re-render to reflect the deletion immediately
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Employees</h1>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or department..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              {isHR && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isHR ? 5 : 4} className="px-6 py-8 text-center text-gray-400">
                  No employees yet. Share your company code with employees so they can register.
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{emp.name}</div>
                        <div className="text-sm text-gray-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{emp.role}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  {isHR && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(emp.email, emp.name)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Employees