import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../context/ShopContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

// Interface mendefinisikan prop yang diterima oleh komponen ProductCard
interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

/**
 * Komponen Reusable ProductCard
 * Digunakan untuk merender item produk secara grid di HomeScreen.
 * Dilengkapi dengan pratinjau gambar placeholder abu-abu serta informasi stok & harga.
 */
export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.productCard}
      testID={`product-card-${product.id}`}
    >
      {/* Frame Gambar Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>No Image Frame</Text>
      </View>

      {/* Detail Informasi Nama Produk */}
      <Text style={styles.productName} numberOfLines={1}>
        {product.productName}
      </Text>

      {/* Harga Produk Berformat Rupiah (IDR) */}
      <Text style={styles.productPrice}>
        Rp {product.productPrice.toLocaleString("id-ID")}
      </Text>

      {/* Menampilkan Jumlah Stok Aktif dari Server */}
      <Text style={styles.productStock}>
        Stok aktif: {product.productStock}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 16,
    width: cardWidth,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  imagePlaceholderText: { color: "#9ca3af", fontSize: 11 },
  productName: { fontWeight: "bold", color: "#1f2937", fontSize: 14 },
  productPrice: {
    color: "#3b82f6",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  productStock: { color: "#9ca3af", fontSize: 10, marginTop: 2 },
});
