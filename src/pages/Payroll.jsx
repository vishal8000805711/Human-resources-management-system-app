import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'
import { usePayroll } from '../context/PayrollContext'
import { useAuth } from '../context/AuthContext'

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const currentYear = new Date().getFullYear()
const years = [currentYear - 1, currentYear, currentYear + 1]

function Payroll() {
  const { employees } = useEmployees()
  const { getSalary, setSalary } = usePayroll()
  const { isHR } = useAuth()

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(currentYear)
  const [salaries, setSalaries] = useState({})
  const [showSlip, setShowSlip] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ basic: 0, hra: 0, allowance: 0, deduction: 0 })
  const [loading, setLoading] = useState(false)

  // Load all salaries when employees/month/year changes
  useEffect(() => {
    if (employees.length === 0) return
    const loadSalaries = async () => {
      setLoading(true)
      const results = {}
      await Promise.all(employees.map(async (emp) => {
        results[emp.id] = await getSalary(emp.id, year, month)
      }))
      setSalaries(results)
      setLoading(false)
    }
    loadSalaries()
  }, [employees, year, month])

  const getNet = (empId) => {
    const s = salaries[empId] || { basic: 0, hra: 0, allowance: 0, deduction: 0 }
    return s.basic + s.hra + s.allowance - s.deduction
  }

  const totalPayroll = employees.reduce((sum, e) => sum + getNet(e.id), 0)

  const openEdit = (emp) => {
    setEditId(emp.id)
    setEditForm(salaries[emp.id] || { basic: 0, hra: 0, allowance: 0, deduction: 0 })
  }

  const saveEdit = async () => {
    const updated = {
      basic: Number(editForm.basic) || 0,
      hra: Number(editForm.hra) || 0,
      allowance: Number(editForm.allowance) || 0,
      deduction: Number(editForm.deduction) || 0
    }
    await setSalary(editId, year, month, updated)
    setSalaries(prev => ({ ...prev, [editId]: updated }))
    setEditId(null)
  }

  const selectedEmp = employees.find(e => e.id === showSlip)
  const selectedSalary = showSlip ? salaries[showSlip] : null

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Payroll</h1>
        <div className="flex gap-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Employees</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">{employees.length}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Payroll</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">₹{totalPayroll.toLocaleString()}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Period</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">{months[month]} {year}</h2>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading payroll data...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Basic</th>
                <th className="px-6 py-3">HRA</th>
                <th className="px-6 py-3">Allowance</th>
                <th className="px-6 py-3">Deduction</th>
                <th className="px-6 py-3">Net Pay</th>
                <th className="px-6 py-3">Payslip</th>
                {isHR && <th className="px-6 py-3">Update</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={isHR ? 9 : 8} className="px-6 py-8 text-center text-gray-400">
                    No employees yet.
                  </td>
                </tr>
              ) : (
                employees.map(emp => {
                  const s = salaries[emp.id] || { basic: 0, hra: 0, allowance: 0, deduction: 0 }
                  const net = s.basic + s.hra + s.allowance - s.deduction
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{emp.name}</div>
                        <div className="text-sm text-gray-400">{emp.role}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                      <td className="px-6 py-4 text-gray-600">₹{s.basic.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">₹{s.hra.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">₹{s.allowance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-red-500">-₹{s.deduction.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-green-600">₹{net.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => setShowSlip(emp.id)} className="text-blue-600 hover:underline text-sm">View</button>
                      </td>
                      {isHR && (
                        <td className="px-6 py-4">
                          <button onClick={() => openEdit(emp)} className="text-purple-600 hover:underline text-sm">✏️ Edit</button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Update Salary</h2>
            <p className="text-gray-400 text-sm mb-6">{months[month]} {year}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['basic', 'hra', 'allowance', 'deduction'].map(field => (
                <div key={field}>
                  <label className="block text-gray-600 mb-1 capitalize">{field}</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editForm[field]}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Save</button>
              <button onClick={() => setEditId(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showSlip && selectedEmp && selectedSalary && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">HRMS</h2>
              <p className="text-gray-500">Payslip — {months[month]} {year}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-800">{selectedEmp.name}</p>
              <p className="text-sm text-gray-500">{selectedEmp.role} • {selectedEmp.department}</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Basic Salary</span><span className="font-medium">₹{selectedSalary.basic.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">HRA</span><span className="font-medium">₹{selectedSalary.hra.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Allowance</span><span className="font-medium">₹{selectedSalary.allowance.toLocaleString()}</span></div>
              <div className="flex justify-between text-red-500"><span>Deduction</span><span className="font-medium">-₹{selectedSalary.deduction.toLocaleString()}</span></div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Net Pay</span>
                <span className="text-green-600">₹{(selectedSalary.basic + selectedSalary.hra + selectedSalary.allowance - selectedSalary.deduction).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => setShowSlip(null)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Close</button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Payroll