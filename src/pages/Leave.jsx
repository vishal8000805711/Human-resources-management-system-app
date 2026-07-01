import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import {
  collection, query, where,
  onSnapshot, addDoc, doc, updateDoc
} from 'firebase/firestore'

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave']

function Leave() {
  const { employees } = useEmployees()
  const { isHR, user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ type: leaveTypes[0], from: '', to: '', reason: '' })

  useEffect(() => {
    if (!user?.companyCode) return
    const q = query(collection(db, 'leaves'), where('companyCode', '==', user.companyCode))
    const unsub = onSnapshot(q, snap => {
      setLeaves(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user?.companyCode])

  const handleSubmit = async () => {
    if (!form.from || !form.to || !form.reason) return
    await addDoc(collection(db, 'leaves'), {
      empId: user?.email,
      empName: user?.name,
      type: form.type,
      from: form.from,
      to: form.to,
      reason: form.reason,
      status: 'Pending',
      companyCode: user?.companyCode
    })
    setForm({ type: leaveTypes[0], from: '', to: '', reason: '' })
    setShowModal(false)
  }

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'leaves', id), { status })
  }

  const statusColor = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700'
    if (status === 'Rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Leave Management</h1>
        {!isHR && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >+ Apply Leave</button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Requests</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">{leaves.length}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-1">{leaves.filter(l => l.status === 'Pending').length}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Approved</p>
          <h2 className="text-3xl font-bold text-green-500 mt-1">{leaves.filter(l => l.status === 'Approved').length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">No leave requests yet.</td>
              </tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{leave.empName}</td>
                  <td className="px-6 py-4 text-gray-600">{leave.type}</td>
                  <td className="px-6 py-4 text-gray-600">{leave.from}</td>
                  <td className="px-6 py-4 text-gray-600">{leave.to}</td>
                  <td className="px-6 py-4 text-gray-600">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isHR && leave.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(leave.id, 'Approved')} className="text-green-600 hover:underline text-sm">Approve</button>
                        <button onClick={() => updateStatus(leave.id, 'Rejected')} className="text-red-500 hover:underline text-sm">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Apply for Leave</h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Leave Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {leaveTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-1">From</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">To</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 mb-1">Reason</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Submit</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Leave