import { useState } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

const salaryData = {
  1: { basic: 50000, hra: 20000, allowance: 5000, deduction: 8000 },
  2: { basic: 45000, hra: 18000, allowance: 4000, deduction: 7000 },
  3: { basic: 55000, hra: 22000, allowance: 6000, deduction: 9000 },
  4: { basic: 40000, hra: 16000, allowance: 3000, deduction: 6000 },
  5: { basic: 60000, hra: 24000, allowance: 7000, deduction: 10000 },
  6: { basic: 50000, hra: 20000, allowance: 5000, deduction: 8000 },
  7: { basic: 42000, hra: 17000, allowance: 3500, deduction: 6500 },
  8: { basic: 38000, hra: 15000, allowance: 3000, deduction: 5500 },
}

function Payroll() {
  const { employees } = useEmployees()
  const [month, setMonth] = useState(5)
  const [showSlip, setShowSlip] = useState(null)

  const getNet = (id) => {
    const s = salaryData[id]
    if (!s) return 0
    return s.basic + s.hra + s.allowance - s.deduction
  }

  const totalPayroll = employees.reduce((sum, e) => sum + getNet(e.id), 0)

  const selectedEmp = employees.find(e => e.id === showSlip)
  const selectedSalary = showSlip ? salaryData[showSlip] : null

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Payroll</h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      {/* Summary Card */}
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
          <p className="text-gray-500 text-sm">Month</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-1">{months[month]}</h2>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map(emp => {
              const s = salaryData[emp.id] || { basic: 0, hra: 0, allowance: 0, deduction: 0 }
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
                    <button
                      onClick={() => setShowSlip(emp.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >View</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Payslip Modal */}
      {showSlip && selectedEmp && selectedSalary && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">HRMS</h2>
              <p className="text-gray-500">Payslip — {months[month]} 2026</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-800">{selectedEmp.name}</p>
              <p className="text-sm text-gray-500">{selectedEmp.role} • {selectedEmp.department}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-medium">₹{selectedSalary.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA</span>
                <span className="font-medium">₹{selectedSalary.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowance</span>
                <span className="font-medium">₹{selectedSalary.allowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Deduction</span>
                <span className="font-medium">-₹{selectedSalary.deduction.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Net Pay</span>
                <span className="text-green-600">₹{(selectedSalary.basic + selectedSalary.hra + selectedSalary.allowance - selectedSalary.deduction).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSlip(null)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >Close</button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Payroll