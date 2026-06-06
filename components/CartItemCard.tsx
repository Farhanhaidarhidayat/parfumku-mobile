import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItem } from "../context/ShopContext";

// Interface untuk properti yang diterima oleh CartItemCard
interface CartItemCardProps {
  item: CartItem;
  onUpdateQty: (cartId: number, qty: number) => void;
  onRemove: (cartId: number) => void;
}

/**
 * Komponen Reusable CartItemCard
 * Digunakan untuk merender item di dalam keranjang belanja.
 * Menyediakan aksi tambah/kurang kuantitas dan hapus item dari keranjang belanja.
 */
export default function CartItemCard({ item, onUpdateQty, onRemove }: CartItemCardProps) {
  return (
    <View style={styles.cartCard} testID={`cart-item-card-${item.id}`}>
      {/* Informasi Detail Nama dan Total Harga Produk per Item */}
      <View style={styles.cartInfo}>
        <Text style={styles.cartName} numberOfLines={1}>
          {item.product?.productName || "Produk Tidak Dikenal"}
        </Text>
        <Text style={styles.cartPrice}>
          Rp {((item.product?.productPrice || 0) * item.quantity).toLocaleString("id-ID")}
        </Text>
      </View>

      {/* Bagian Aksi Update Jumlah (Quantity) dan Hapus Item */}
      <View style={styles.actionRow}>
        <View style={styles.qtyWrapper}>
          {/* Tombol Kurangi Kuantitas */}
          <TouchableOpacity
            onPress={() => onUpdateQty(item.id, item.quantity - 1)}
            style={styles.qtyActionBtn}
            testID={`btn-decrease-${item.id}`}
          >
            <Text style={styles.qtyActionText}>-</Text>
          </TouchableOpacity>

          {/* Jumlah Kuantitas Saat Ini */}
          <Text style={styles.qtyText} testID={`qty-text-${item.id}`}>{item.quantity}</Text>

          {/* Tombol Tambah Kuantitas */}
          <TouchableOpacity
            onPress={() => onUpdateQty(item.id, item.quantity + 1)}
            style={styles.qtyActionBtn}
            testID={`btn-increase-${item.id}`}
          >
            <Text style={styles.qtyActionText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Hapus Item dari Keranjang */}
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.deleteBtn}
          testID={`btn-delete-${item.id}`}
        >
          <Text style={styles.deleteBtnText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
