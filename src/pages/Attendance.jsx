import { useState } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'

const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

function Attendance() {
  const { employees } = useEmployees()
  const { isHR } = useAuth()
  const [month, setMonth] = useState(5)
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('hrms_attendance')
    return saved ? JSON.parse(saved) : {}
  })

  const toggle = (empId, day) => {
    if (!isHR) return
    const key = `${empId}-${day}`
    setAttendance(prev => {
      const updated = {
        ...prev,
        [key]: prev[key] === 'P' ? 'A' : prev[key] === 'A' ? '-' : 'P'
      }
      localStorage.setItem('hrms_attendance', JSON.stringify(updated))
      return updated
    })
  }

  const getStatus = (empId, day) => attendance[`${empId}-${day}`] || '-'

  const getColor = (status) => {
    if (status === 'P') return 'bg-green-500 text-white'
    if (status === 'A') return 'bg-red-400 text-white'
    return 'bg-gray-100 text-gray-400'
  }

  const getCount = (empId, type) =>
    days.filter(d => getStatus(empId, d) === type).length

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Attendance</h1>
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

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <p className="text-gray-500 text-sm mb-2">
          {isHR
            ? <>Click a cell to toggle: <span className="text-green-500 font-semibold">P = Present</span> → <span className="text-red-400 font-semibold">A = Absent</span> → <span className="text-gray-400">- = Unmarked</span></>
            : 'You are viewing attendance records (read-only).'}
        </p>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-40 sticky left-0 bg-gray-50">Employee</th>
              {days.map(d => (
                <th key={d} className="px-2 py-3 text-center w-8">{d}</th>
              ))}
              <th className="px-4 py-3 text-center text-green-600">P</th>
              <th className="px-4 py-3 text-center text-red-500">A</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700 sticky left-0 bg-white w-40">
                  <div>{emp.name.split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">{emp.department}</div>
                </td>
                {days.map(d => (
                  <td key={d} className="px-1 py-2 text-center">
                    <button
                      onClick={() => toggle(emp.id, d)}
                      disabled={!isHR}
                      className={`w-6 h-6 rounded text-xs font-semibold transition ${getColor(getStatus(emp.id, d))} ${!isHR ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      {getStatus(emp.id, d)}
                    </button>
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-bold text-green-600">
                  {getCount(emp.id, 'P')}
                </td>
                <td className="px-4 py-2 text-center font-bold text-red-500">
                  {getCount(emp.id, 'A')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Attendance