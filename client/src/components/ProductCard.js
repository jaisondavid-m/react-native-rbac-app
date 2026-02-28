import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useAuth } from "../context/AuthContext"

export default function ProductCard({ item, onDelete }) {
    const { user } = useAuth()
    return (
        <View style={styles.card}>
            <Text style={styles.name}>{item.product_name}</Text>

            <Text style={styles.price}>
                ₹ {item.product_price.toLocaleString("en-IN")}
            </Text>

            <Text style={styles.date}>
                Added at : {new Date(item.added_at).toLocaleDateString()}
            </Text>

            {(user?.role === "admin" || user?.role === "superadmin") && (
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => onDelete(item.id)}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        padding: 14,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#16a34a",
        backgroundColor: "#dcfce7",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 12,
    },
    deleteBtn: {
        backgroundColor: "#dc2626",
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
    },
})