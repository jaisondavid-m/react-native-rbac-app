import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import api from "../api/axios"
import { getErrorMessage } from "../components/ErrorSender"

export default function ProfileScreen() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchProfile = async () => {
        try {
            const res = await api.get("/me")
            setUser(res.data)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Icon name="account" size={60} color="#fff" />
                </View>

                <Text style={styles.userid}>{user?.userid}</Text>

                <View style={[styles.roleBadge,user?.role === "superadmin" ? styles.superAdminBadge : user?.role === "admin" ? styles.adminBadge : styles.userBadge,]}>
                    <Text style={styles.roleText}>
                        {user?.role?.toUpperCase()}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        width: "85%",
        padding: 30,
        borderRadius: 16,
        alignItems: "center",
        elevation: 5,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#4c6ef5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    userid: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    roleBadge: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    adminBadge: {
        backgroundColor: "#16a34a",
        borderRadius:12,
    },
    userBadge: {
        backgroundColor: "#4c6ef5",
        borderRadius:12,
    },
    roleText: {
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    superAdminBadge: {
        backgroundColor: "#7c3aed", 
        borderRadius:12,
    },
})