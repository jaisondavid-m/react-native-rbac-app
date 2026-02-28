import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext"
import {getErrorMessage} from "../components/ErrorSender"
import api from "../api/axios";

export default function LoginScreen({ navigation }) {
  const [userid, setUserid] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!userid || !password) {
      return Alert.alert("Error", "All fields are required");
    }
    try {
      setLoading(true)
      const response = await api.post("/login", { userid, password })
      const token = response.data.token
      await login(token)
      Alert.alert("Success", "Login Successfully")
    } catch (error) {
      Alert.alert("Login Failed", getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Enter UserID" placeholderTextColor="#999" value={userid} onChangeText={setUserid} />
        <TextInput style={styles.input} placeholder="Enter Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Loggin In..." : "Login"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>
            Doesnt have an account? <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#333"
  },
  input: {
    backgroundColor: "#f1f3f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingLeft: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 18,
    alignItems: "center"
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#4c6ef5",
    fontWeight: "600",
  },
})