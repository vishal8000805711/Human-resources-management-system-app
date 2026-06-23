import { useState } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'

const empty = { name: '', email: '', role: '', department: '', status: 'Active' }

function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.role || !form.department) return
    if (editId) {
      updateEmployee({ ...form, id: editId })
    } else {
      addEmployee(form)
    }
    setForm(empty)
    setEditId(null)
    setShowModal(false)
  }

  const handleEdit = (emp) => {
    setForm(emp)
    setEditId(emp.id)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this employee?')) deleteEmployee(id)
  }

  const statusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'On Leave') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-700">Employees</h1>
        <button
          onClick={() => { setForm(empty); setEditId(null); setShowModal(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(emp => (
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
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:underline text-sm"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-500 hover:underline text-sm"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              {editId ? 'Edit Employee' : 'Add Employee'}
            </h2>
            {['name', 'email', 'role', 'department'].map(field => (
              <div key={field} className="mb-4">
                <label className="block text-gray-600 mb-1 capitalize">{field}</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="mb-6">
              <label className="block text-gray-600 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Employees