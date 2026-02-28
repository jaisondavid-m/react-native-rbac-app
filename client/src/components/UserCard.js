import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"

export default function UserCard({
    user,
    onChangeRole,
    onDelete,
}) {
    const { user: currentUser } = useAuth()
    return (
        <View style={styles.card}>
            <View style={styles.row}>

                <View style={styles.leftSection}>
                    <View style={styles.avatar}>
                        <Icon name="account" size={28} color="#fff" />
                    </View>

                    <View>
                        <Text style={styles.userid}>
                            {user.userid}
                        </Text>

                        <Text style={styles.date}>
                            Created:{" "}
                            {new Date(user.created_at).toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    {(currentUser?.role === "superadmin") && (
                        <TouchableOpacity
                            style={styles.roleBtn}
                            onPress={() => onChangeRole(user.userid, user.role)}
                        >
                            <Text style={styles.roleText}>
                                Change Role
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => onDelete(user.userid)}
                    >
                        <Text style={styles.deleteText}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#4c6ef5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    userid: {
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        color: "gray",
        marginTop: 2,
    },
    actions: {
        justifyContent: "space-between",
        marginLeft: 10,
    },
    roleBtn: {
        backgroundColor: "#2563eb",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 6,
    },
    roleText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    deleteBtn: {
        backgroundColor: "#dc2626",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
})