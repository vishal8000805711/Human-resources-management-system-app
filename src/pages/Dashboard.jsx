import Layout from '../components/Layout'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'

const attendanceData = [
  { day: 'Mon', present: 20, absent: 4 },
  { day: 'Tue', present: 22, absent: 2 },
  { day: 'Wed', present: 18, absent: 6 },
  { day: 'Thu', present: 21, absent: 3 },
  { day: 'Fri', present: 19, absent: 5 },
]

const departmentData = [
  { dept: 'Engineering', employees: 8 },
  { dept: 'Design', employees: 4 },
  { dept: 'HR', employees: 3 },
  { dept: 'Sales', employees: 5 },
  { dept: 'Finance', employees: 4 },
]

const cards = [
  { label: 'Total Employees', value: '24', icon: '👥', bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  { label: 'Present Today', value: '18', icon: '✅', bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  { label: 'On Leave', value: '4', icon: '🏖️', bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
  { label: 'Payroll Due', value: '₹2.4L', icon: '💰', bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
]

function Dashboard() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good Morning, Admin! 👋</h1>
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

      {/* Charts Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        {/* Attendance Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Attendance This Week</h3>
              <p className="text-gray-400 text-sm">Daily present vs absent</p>
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
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
            <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">Total: 24</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dept" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </Layout>
  )
}

export default Dashboard