import React, { useEffect, useState } from "react"
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Modal,
    TouchableOpacity,
    Text,
    TextInput,
} from "react-native"
import api from "../api/axios"
import ProductCard from "../components/ProductCard"
import { getErrorMessage } from "../components/ErrorSender"
import { useAuth } from "../context/AuthContext"

export default function HomeScreen() {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [refreshing, setRefreshing] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products")
            setProducts(res.data)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleAddProduct = async () => {
        if (!name.trim() || !price.trim()) {
            Alert.alert("Validation", "All fields are required")
            return
        }

        try {
            setSubmitting(true)

            await api.post("/product", {
                product_name: name,
                product_price: Number(price),
            })

            setModalVisible(false)
            setName("")
            setPrice("")
            fetchProducts()
        } catch (err) {
            Alert.alert("Error", getErrorMessage(err))
        } finally {
            setSubmitting(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchProducts()
        setRefreshing(false)
    }

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/product/${id}`)
                            setProducts((prev) =>
                                prev.filter((item) => item.id !== id)
                            )
                        } catch (err) {
                            Alert.alert("Error", getErrorMessage(err))
                        }
                    },
                },
            ]
        )
    }

    useEffect(() => {
        fetchProducts()
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
                data={products}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <ProductCard item={item} onDelete={handleDelete} />
                    </View>
                )}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            {(user?.role === "admin" || user?.role === "superadmin") && (
                <>
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalBox}>
                                <Text style={styles.modalTitle}>Add Product</Text>

                                <TextInput
                                    placeholder="Product Name"
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />

                                <TextInput
                                    placeholder="Product Price"
                                    style={styles.input}
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={handleAddProduct}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.submitText}>Submit</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addBtnText}>+ Add Product</Text>
                    </TouchableOpacity>
                </>
            )}



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f5f9",
    },

    addBtn: {
        backgroundColor: "#4c6ef5",
        padding: 12,
        margin: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    addBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 20,
    },

    cardWrapper: {
        flex: 1,
        padding: 8,
    },

    row: {
        justifyContent: "space-between",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
    },

    errorText: {
        color: "#dc2626",
        fontSize: 16,
        fontWeight: "500",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },

    modalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },

    submitBtn: {
        backgroundColor: "#4c6ef5",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },

    submitText: {
        color: "#fff",
        fontWeight: "bold",
    },

    cancelText: {
        marginTop: 12,
        color: "#dc2626",
        textAlign: "center",
        fontWeight: "500",
    },
})