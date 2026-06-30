import { useState } from 'react'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your HR data — leaves, attendance, payroll, or employees.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { employees } = useEmployees()
  const { user } = useAuth()

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
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
              content: `You are an HR assistant for an HRMS system. Current logged in user: ${user?.name}. Employee database: ${JSON.stringify(employees)}. Answer questions concisely based only on this data. If the answer isn't in the data, say so politely.`
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
            <p className="text-blue-100 text-xs">Ask about leaves, payroll, attendance</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
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