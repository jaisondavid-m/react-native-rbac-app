import React, { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        setIsAuthenticated(true)
        await fetchUser()
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await api.get("/me")
      setUser(res.data)
    } catch (error) {
      console.error("Error fetching user:", error)
      logout()
    }
  }

  const login = async (token) => {
    await AsyncStorage.setItem("token", token)
    setIsAuthenticated(true)
    await fetchUser()
  }

  const logout = async () => {
    await AsyncStorage.removeItem("token")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
