import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../../context/ShopContext";
import CartItemCard from "../../components/CartItemCard";

export default function CartScreen() {
  const { cart, updateCartQty, removeFromCart, fetchCart } = useShop();
  const router = useRouter();

  // Tarik data keranjang dari API saat halaman aktif
  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const harga = item.product?.productPrice || 0;
    return sum + harga * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Keranjang belanja API Anda kosong</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/" })}
          style={styles.shopBtn}
        >
          <Text style={styles.shopBtnText}>Mulai Belanja</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
          />
        )}
      />

      <View style={styles.totalBox}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Pembayaran:</Text>
          <Text style={styles.totalPrice}>
            Rp {subtotal.toLocaleString("id-ID")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/checkout" })}
          style={styles.checkoutBtn}
        >
          <Text style={styles.checkoutBtnText}>Lanjut Ke Pengiriman</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  emptyText: { color: "#9ca3af", marginBottom: 12 },
  shopBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shopBtnText: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
  cartCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cartInfo: { flex: 1, paddingRight: 8 },
  cartName: { fontWeight: "bold", color: "#1f2937", fontSize: 14 },
  cartPrice: {
    color: "#3b82f6",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  actionRow: { flexDirection: "row", alignItems: "center" },
  qtyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    marginRight: 12,
  },
  qtyActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#f9fafb",
  },
  qtyActionText: { fontWeight: "bold" },
  qtyText: { paddingHorizontal: 10, fontSize: 12, fontWeight: "600" },
  deleteBtn: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: { color: "#ef4444", fontSize: 12, fontWeight: "600" },
  totalBox: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { color: "#6b7280", fontSize: 14 },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#3b82f6" },
  checkoutBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutBtnText: { color: "#ffffff", fontWeight: "bold" },
});
