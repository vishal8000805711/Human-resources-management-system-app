# ⚡ HRMS — Human Resource Management System

A full-stack, multi-tenant HR management web application built from scratch using React and Firebase. Companies (HR) can register, get a unique company code, and manage their employees, attendance, leave requests, and payroll — all in one place, with an AI-powered HR assistant chatbot built in.

**Live Demo:** [your-vercel-link.vercel.app](https://human-resources-management-system-a.vercel.app)
**GitHub:** [github.com/vishal8000805711/Human-resources-management-system-app](https://github.com/vishal8000805711/Human-resources-management-system-app)

---

## 📖 About

HRMS is a role-based, multi-company HR platform. Each HR that registers gets their own auto-generated **Company Code**, which they share with their employees. Employees register using that code and automatically join their company's private workspace — so no two companies' data ever mixes.

- **HR / Admin** can view and manage employees, mark attendance, approve/reject leave requests, and update payroll.
- **Employees** can view their company's data, apply for leave, and chat with the AI HR assistant — but cannot edit records.

---

## ✨ Features

- 🔐 **Authentication** — Register/Login with role selection (HR or Employee)
- 🏢 **Multi-Tenant Company System** — Unique company codes keep each organization's data fully isolated
- 🧑‍💼 **Role-Based Access Control** — HR has full edit rights; Employees have read-only + self-service access
- 📊 **Live Dashboard** — Real-time stats and charts (total employees, attendance, leave, department breakdown)
- 👥 **Employee Directory** — Auto-populated from registered employees, searchable, with HR-only removal
- 🚫 **Employee Offboarding** — HR can remove an employee; all their attendance, leave, and payroll records are cleaned up, and they're banned from rejoining that company
- 📅 **Attendance Tracking** — Month/year-wise attendance grid with Present/Absent toggling (HR only), view-only for employees
- 🏖️ **Leave Management** — Employees apply for leave; HR approves/rejects with live status tracking
- 💰 **Payroll Management** — HR can edit Basic, HRA, Allowance, and Deductions per employee per month; employees can view their payslip
- 🤖 **AI HR Chatbot** — Ask natural-language questions about employees, attendance, and leave data, powered by Groq's LLaMA 3.3 70B
- 📱 **Fully Responsive** — Collapsible sidebar and mobile-optimized layout
- ☁️ **Cloud Data Sync** — Firebase Firestore ensures data is accessible from any device, any browser

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Charts | Recharts |
| Database | Firebase Firestore (NoSQL, cloud) |
| AI Chatbot | Groq API — LLaMA 3.3 70B |
| State Management | React Context API (Auth, Employee, Payroll) |
| Session Persistence | localStorage |
| Deployment | Vercel (CI/CD via GitHub) |
| Version Control | Git & GitHub |

---

## 📁 Project Structure

```
hrms-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Dark, collapsible nav sidebar (role-aware)
│   │   ├── Navbar.jsx         # Top bar with hamburger menu (mobile) & user info
│   │   ├── Layout.jsx         # Wraps pages with Sidebar + Navbar + ChatBot
│   │   ├── ProtectedRoute.jsx # Redirects unauthenticated users to Login
│   │   └── ChatBot.jsx        # Floating AI HR assistant widget
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx       # Role selection + company code / department
│   │   ├── Dashboard.jsx      # Live stats & charts
│   │   ├── Employees.jsx      # Employee directory (HR can remove)
│   │   ├── Attendance.jsx     # Month/year attendance grid
│   │   ├── Leave.jsx          # Leave requests & approvals
│   │   └── Payroll.jsx        # Payroll table, editing & payslips
│   ├── context/
│   │   ├── AuthContext.jsx      # Login, register, logout, remove employee, roles
│   │   ├── EmployeeContext.jsx  # Live employee list scoped to company
│   │   └── PayrollContext.jsx   # Get/set salary per employee per month
│   ├── firebase.js            # Firebase project config & Firestore init
│   ├── App.jsx                # Route definitions
│   └── main.jsx                # Provider tree + app entry point
├── .env                        # VITE_GROQ_API_KEY (not committed)
├── vercel.json                 # SPA routing rewrite rules for Vercel
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version)
- A free [Firebase](https://console.firebase.google.com) project with Firestore enabled
- A free [Groq](https://console.groq.com/keys) API key

### Installation

```bash
git clone https://github.com/vishal8000805711/Human-resources-management-system-app.git
cd Human-resources-management-system-app
npm install
```

### Environment Variables
Create a `.env` file in the root directory:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Firebase Setup
Update `src/firebase.js` with your own Firebase project config, and set Firestore rules to allow read/write (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🧑‍💻 How It Works

1. **HR registers** → gets a unique company code (e.g. `CMP-AB12CD`)
2. **HR shares the code** with their team
3. **Employees register** with that code + their department → automatically join the company's workspace
4. **HR manages** attendance, approves leave, and updates payroll
5. **Employees view** their data and can ask the AI chatbot things like *"How many employees are present this month?"* or *"What's my leave status?"*

---

## 🌱 Future Improvements

- Firebase Authentication (replace custom password storage)
- Push notifications for leave approval/rejection
- Exportable payslips (PDF)
- Attendance analytics per department
- Dark mode

---

## 👤 Author

**Vishal Sevada**
B.Tech CSE, 3rd Year
[GitHub](https://github.com/vishal8000805711)

---

## 📄 License

This project is open source and available for learning purposes.
