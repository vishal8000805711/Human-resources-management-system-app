import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection, doc, getDoc, getDocs,
  setDoc, deleteDoc, query, where
} from 'firebase/firestore'

const AuthContext = createContext()

function generateCompanyCode() {
  return 'CMP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrms_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', email))
      if (!userDoc.exists()) {
        return { success: false, error: 'Invalid email or password' }
      }
      const userData = userDoc.data()
      if (userData.password !== password) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Check if banned
      const companyCode = userData.companyCode
      const banDoc = await getDoc(doc(db, 'banned', `${email}_${companyCode}`))
      if (banDoc.exists()) {
        return { success: false, error: 'Your access to this company has been removed by HR.' }
      }

      const loggedIn = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        companyCode: userData.companyCode,
        department: userData.department || ''
      }
      setUser(loggedIn)
      localStorage.setItem('hrms_user', JSON.stringify(loggedIn))
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  }

  const register = async (name, email, password, role, companyCodeInput, department) => {
    try {
      // Check if email already exists
      const userDoc = await getDoc(doc(db, 'users', email))
      if (userDoc.exists()) {
        return { success: false, error: 'Email already exists' }
      }

      let companyCode

      if (role === 'HR') {
        companyCode = generateCompanyCode()
      } else {
  // Verify company code exists - search by companyCode only to avoid index requirement
  const q = query(collection(db, 'users'), where('companyCode', '==', companyCodeInput))
  const snap = await getDocs(q)
  //
  console.log('Firestore snap size:', snap.size, 'Input code:', companyCodeInput, 'Docs:', snap.docs.map(d => d.data()))
  
  const hrExists = snap.docs.some(d => d.data().role === 'HR')
  if (!hrExists) {
    return { success: false, error: 'Invalid company code. Please check with your HR.' }
  }

        // Check if banned
        const banDoc = await getDoc(doc(db, 'banned', `${email}_${companyCodeInput}`))
        if (banDoc.exists()) {
          return { success: false, error: 'This email has been removed from this company and cannot rejoin.' }
        }

        companyCode = companyCodeInput
      }

      await setDoc(doc(db, 'users', email), {
        name,
        email,
        password,
        role,
        companyCode,
        department: department || ''
      })

      return { success: true, companyCode }
    } catch (err) {
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  }

  const removeEmployee = async (email) => {
    if (!user || user.role !== 'HR') return
    const companyCode = user.companyCode

    try {
      // 1. Delete user from Firestore
      await deleteDoc(doc(db, 'users', email))

      // 2. Ban them from rejoining
      await setDoc(doc(db, 'banned', `${email}_${companyCode}`), { email, companyCode })

      // 3. Remove their attendance
      const attSnap = await getDocs(query(collection(db, 'attendance'), where('empId', '==', email), where('companyCode', '==', companyCode)))
      attSnap.forEach(async d => await deleteDoc(d.ref))

      // 4. Remove their leave requests
      const leaveSnap = await getDocs(query(collection(db, 'leaves'), where('empId', '==', email), where('companyCode', '==', companyCode)))
      leaveSnap.forEach(async d => await deleteDoc(d.ref))

      // 5. Remove their payroll
      const paySnap = await getDocs(query(collection(db, 'payroll'), where('empId', '==', email), where('companyCode', '==', companyCode)))
      paySnap.forEach(async d => await deleteDoc(d.ref))

    } catch (err) {
      console.error('Error removing employee:', err)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hrms_user')
  }

  const isHR = user?.role === 'HR'

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isHR, removeEmployee }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}