import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Purchase } from "../context/ShopContext";

interface OrderCardProps {
  order: Purchase;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <View style={styles.orderCard} testID={`order-card-${order.id}`}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.invoiceNo}>Invoice #{order.id}</Text>
          <Text style={styles.orderDate}>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("id-ID")
              : "Hari ini"}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      {order.items?.length ? (
        <View style={styles.itemList}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <View style={styles.productImageBox}>
                {item.productImage ? (
                  <Image source={{ uri: item.productImage }} style={styles.productImage} />
                ) : (
                  <Text style={styles.productImageText}>Foto</Text>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.productMeta}>{item.quantity} x Rp {item.productPrice.toLocaleString("id-ID")}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noItemsText}>Detail produk mengikuti data riwayat server.</Text>
      )}

      <Text style={styles.addressText} numberOfLines={2}>
        📍 {order.address}
      </Text>

      <View style={styles.orderFooter}>
        <Text style={styles.orderMethod}>
          {order.paymentMethod?.name || "Pembayaran selesai"}
        </Text>
        <Text style={styles.orderTotal}>
          Total: Rp {order.totalPrice.toLocaleString("id-ID")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: { backgroundColor: "#FFFDF9", padding: 14, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E8DDD2" },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#EFE7DE", paddingBottom: 8, marginBottom: 10 },
  invoiceNo: { fontWeight: "800", fontSize: 13, color: "#2F2722" },
  orderDate: { fontSize: 11, color: "#8E7E76", marginTop: 2 },
  statusBadge: { backgroundColor: "#E6F4EA", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, justifyContent: "center" },
  statusText: { fontSize: 9, color: "#2F6B42", fontWeight: "900", textTransform: "uppercase" },
  itemList: { gap: 8, marginBottom: 10 },
  productRow: { flexDirection: "row", alignItems: "center" },
  productImageBox: { width: 46, height: 46, borderRadius: 10, backgroundColor: "#EFE7DE", alignItems: "center", justifyContent: "center", overflow: "hidden", marginRight: 10 },
  productImage: { width: "100%", height: "100%" },
  productImageText: { color: "#8E7E76", fontSize: 10 },
  productInfo: { flex: 1 },
  productName: { color: "#2F2722", fontWeight: "800", fontSize: 13 },
  productMeta: { color: "#8E7E76", fontSize: 11, marginTop: 2 },
  noItemsText: { color: "#8E7E76", fontSize: 12, marginBottom: 10 },
  addressText: { fontSize: 12, color: "#6B5D55", marginBottom: 8 },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#EFE7DE", paddingTop: 9, marginTop: 4, gap: 10 },
  orderMethod: { fontSize: 11, color: "#8E7E76", flex: 1 },
  orderTotal: { fontSize: 13, fontWeight: "800", color: "#8A4E2A" },
});
