import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItem } from "../context/ShopContext";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQty: (cartId: number, qty: number) => void;
  onRemove: (cartId: number) => void;
}

export default function CartItemCard({ item, onUpdateQty, onRemove }: CartItemCardProps) {
  const product = item.product;
  const maxQty = product?.productStock ?? item.quantity;
  const canIncrease = item.quantity < maxQty;

  return (
    <View style={styles.cartCard} testID={`cart-item-card-${item.id}`}>
      <View style={styles.imageBox}>
        {product?.productImage ? (
          <Image source={{ uri: product.productImage }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <Text style={styles.imageText}>Foto</Text>
        )}
      </View>

      <View style={styles.cartInfo}>
        <Text style={styles.cartName} numberOfLines={1}>
          {product?.productName || "Produk Tidak Dikenal"}
        </Text>
        <Text style={styles.cartPrice}>
          Rp {((product?.productPrice || 0) * item.quantity).toLocaleString("id-ID")}
        </Text>
        <Text style={styles.stockText}>Stok: {maxQty}</Text>

        <View style={styles.actionRow}>
          <View style={styles.qtyWrapper}>
            <TouchableOpacity
              onPress={() => onUpdateQty(item.id, item.quantity - 1)}
              style={styles.qtyActionBtn}
              testID={`btn-decrease-${item.id}`}
            >
              <Text style={styles.qtyActionText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText} testID={`qty-text-${item.id}`}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => onUpdateQty(item.id, item.quantity + 1)}
              style={[styles.qtyActionBtn, !canIncrease && styles.qtyActionDisabled]}
              testID={`btn-increase-${item.id}`}
              disabled={!canIncrease}
            >
              <Text style={styles.qtyActionText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            style={styles.deleteBtn}
            testID={`btn-delete-${item.id}`}
          >
            <Text style={styles.deleteBtnText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartCard: {
    backgroundColor: "#FFFDF9",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8DDD2",
  },
  imageBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#EFE7DE",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: { width: "100%", height: "100%" },
  imageText: { color: "#8E7E76", fontSize: 11 },
  cartInfo: { flex: 1 },
  cartName: { fontWeight: "800", color: "#2F2722", fontSize: 14 },
  cartPrice: { color: "#8A4E2A", fontSize: 13, marginTop: 3, fontWeight: "800" },
  stockText: { color: "#8E7E76", fontSize: 11, marginTop: 2 },
  actionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  qtyWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#D8CABE", borderRadius: 8, overflow: "hidden" },
  qtyActionBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#F8F3ED" },
  qtyActionDisabled: { opacity: 0.45 },
  qtyActionText: { fontWeight: "bold", color: "#2F2722" },
  qtyText: { paddingHorizontal: 12, fontSize: 12, fontWeight: "700", color: "#2F2722" },
  deleteBtn: { backgroundColor: "#FBEDEA", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  deleteBtnText: { color: "#B24B3E", fontSize: 12, fontWeight: "700" },
});
