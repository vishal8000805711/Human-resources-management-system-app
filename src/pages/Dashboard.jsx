import Layout from '../components/Layout'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'

const days = Array.from({ length: 30 }, (_, i) => i + 1)
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function Dashboard() {
  const { employees } = useEmployees()
  const { user } = useAuth()

  // Read attendance from localStorage
  const attendance = (() => {
    const saved = localStorage.getItem('hrms_attendance')
    return saved ? JSON.parse(saved) : {}
  })()

  // Read leaves from localStorage
  // Read leaves from localStorage, filtered to this company
const leaves = (() => {
  const saved = localStorage.getItem('hrms_leaves')
  const all = saved ? JSON.parse(saved) : []
  return all.filter(l => l.companyCode === user?.companyCode)
})()

  const totalEmployees = employees.length

  // Count today-ish: just sum up all 'P' marks across first 5 days as a simple "this week" stat
  const presentToday = employees.filter(e => {
    const todayKey = `${e.id}-1` // placeholder day 1 as "today" proxy
    return attendance[todayKey] === 'P'
  }).length

  const onLeave = leaves.filter(l => l.status === 'Approved').length

  const totalPayrollDue = 0 // will connect once payroll editing is built

  const cards = [
    { label: 'Total Employees', value: totalEmployees, icon: '👥', bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    { label: 'Present (Day 1)', value: presentToday, icon: '✅', bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    { label: 'On Leave (Approved)', value: onLeave, icon: '🏖️', bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    { label: 'Payroll Due', value: `₹${totalPayrollDue.toLocaleString()}`, icon: '💰', bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  ]

  // Build attendance chart data for first 5 days, summed across all employees
  const attendanceData = weekDays.map((day, i) => {
    const dayNum = i + 1
    let present = 0
    let absent = 0
    employees.forEach(e => {
      const status = attendance[`${e.id}-${dayNum}`]
      if (status === 'P') present++
      if (status === 'A') absent++
    })
    return { day, present, absent }
  })

  // Build department chart data
  const deptCounts = {}
  employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1
  })
  const departmentData = Object.entries(deptCounts).map(([dept, count]) => ({ dept, employees: count }))

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good Morning, {user?.name}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here's what's happening today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-6 flex items-center gap-4`}>
            <div className={`${card.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <h2 className={`text-3xl font-bold ${card.text} mt-1`}>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {totalEmployees === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
          No employees yet. Charts will appear here once employees join your company and attendance is marked.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Attendance Line Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Attendance (Days 1-5)</h3>
                <p className="text-gray-400 text-sm">Present vs absent</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Employees by Department</h3>
                <p className="text-gray-400 text-sm">Headcount per department</p>
              </div>
              <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">Total: {totalEmployees}</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dept" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </Layout>
  )
}

export default Dashboard