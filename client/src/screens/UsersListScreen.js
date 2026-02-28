import React, { useEffect, useState } from "react"
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Text,
    Alert,
} from "react-native"
import api from "../api/axios"
import { getErrorMessage } from "../components/ErrorSender"
import UserCard from "../components/UserCard"

export default function UsersListScreen() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [refreshing, setRefreshing] = useState(false)

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users")
            setUsers(res.data)
        } catch (error) {
            setError(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchUsers()
        setRefreshing(false)
    }

    const handleChangeRole = (userid, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin"

        Alert.alert(
            "Change Role",
            `Change ${userid} to ${newRole}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            await api.put(`/user/${userid}`, {
                                role: newRole,
                            })
                            fetchUsers()
                        } catch (error) {
                            Alert.alert("Error", getErrorMessage(error))
                        }
                    },
                },
            ]
        )
    }

    const handleDeleteUser = (userid) => {
        Alert.alert(
            "Delete User",
            `Are you sure you want to delete ${userid}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/user/${userid}`)
                            fetchUsers()
                        } catch (error) {
                            Alert.alert("Error", getErrorMessage(error))
                        }
                    },
                },
            ]
        )
    }

    useEffect(() => {
        fetchUsers()
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
            <FlatList
                data={users}
                keyExtractor={(item) => item.userid}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => (
                    <UserCard
                        user={item}
                        onChangeRole={handleChangeRole}
                        onDelete={handleDeleteUser}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No admins found</Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f5f5f5",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
})