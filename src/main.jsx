import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { EmployeeProvider } from './context/EmployeeContext'
import { PayrollProvider } from './context/PayrollContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <EmployeeProvider>
        <PayrollProvider>
          <App />
        </PayrollProvider>
      </EmployeeProvider>
    </AuthProvider>
  </React.StrictMode>
)