import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import ChatBot from './ChatBot'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 flex-1">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  )
}

export default Layout