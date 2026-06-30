import { useState } from 'react'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your company — employees, attendance, leaves, or payroll.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { employees } = useEmployees()
  const { user } = useAuth()

  const buildContext = () => {
    const companyCode = user?.companyCode

    // Attendance: keys look like "empId-year-month-day"
    const attendanceRaw = localStorage.getItem('hrms_attendance')
    const attendanceData = attendanceRaw ? JSON.parse(attendanceRaw) : {}
    const employeeIds = employees.map(e => e.id)
    const relevantAttendance = Object.entries(attendanceData)
      .filter(([key]) => employeeIds.some(id => key.startsWith(`${id}-`)))
      .reduce((acc, [key, val]) => {
        acc[key] = val
        return acc
      }, {})

    // Leaves: filtered by companyCode
    const leavesRaw = localStorage.getItem('hrms_leaves')
    const allLeaves = leavesRaw ? JSON.parse(leavesRaw) : []
    const companyLeaves = allLeaves.filter(l => l.companyCode === companyCode)

    return {
      currentUser: { name: user?.name, role: user?.role, email: user?.email },
      employees,
      attendance: relevantAttendance,
      attendanceKeyFormat: 'key = "employeeEmail-year-monthIndex(0-11)-dayOfMonth", value = "P" (present), "A" (absent), or unmarked/missing',
      leaves: companyLeaves
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const context = buildContext()

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an HR assistant for a company HRMS system.
Current logged in user: ${JSON.stringify(context.currentUser)}.

Here is the company's full data in JSON. Use it to answer questions accurately by counting, filtering, or summarizing as needed:

EMPLOYEES: ${JSON.stringify(context.employees)}

ATTENDANCE: ${JSON.stringify(context.attendance)}
ATTENDANCE FORMAT EXPLANATION: ${context.attendanceKeyFormat}

LEAVE REQUESTS: ${JSON.stringify(context.leaves)}

Answer questions concisely based only on this data (e.g. "how many employees are present today", "who is on leave", "what is X's attendance this month"). If asked something the data can't answer, say so politely. Do not make up information.`
            },
            { role: "user", content: userMessage }
          ]
        })
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that."
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-40 transition"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl">
            <h3 className="font-semibold">HR Assistant</h3>
            <p className="text-blue-100 text-xs">Ask about employees, attendance, leaves, payroll</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-2xl text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-full flex items-center justify-center transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot