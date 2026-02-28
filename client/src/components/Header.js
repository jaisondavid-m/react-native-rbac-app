import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"

export default function Header({ title }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: logout }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyApp {title && `- ${title}`}</Text>

      <TouchableOpacity 
        style={styles.logoutContainer} 
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#4c6ef5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
})