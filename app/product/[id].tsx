import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../../context/ShopContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { products, addToCart, fetchProducts } = useShop();
  const router = useRouter();

  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [showCartConfirmation, setShowCartConfirmation] = useState(false);

  useEffect(() => {
    if (!product) {
      fetchProducts();
    }
  }, [fetchProducts, product]);

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text>Produk Tidak Ditemukan</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (qty > product.productStock) {
      Alert.alert("Gagal", "Jumlah melebihi batas stok aktif proyek.");
      return;
    }

    const success = await addToCart(product.id, qty);

    if (success) {
      setShowCartConfirmation(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageBigPlaceholder}>
        {product.productImage ? (
          <Image
            source={{ uri: product.productImage }}
            style={styles.productImageBig}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.imageBigText}>Pratinjau Gambar Produk</Text>
        )}
      </View>

      <Text style={styles.title}>{product.productName}</Text>

      <Text style={styles.price}>
        Rp {product.productPrice.toLocaleString("id-ID")}
      </Text>

      <Text style={styles.description}>{product.productDescription}</Text>

      <View style={styles.footer}>
        <View style={styles.qtyContainer}>
          <Text style={styles.qtyLabel}>
            Atur Jumlah (Stok: {product.productStock})
          </Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={() => setQty(Math.max(1, qty - 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{qty}</Text>

            <TouchableOpacity
              onPress={() => setQty(Math.min(product.productStock, qty + 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            Tambah Ke Keranjang Belanja
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showCartConfirmation}
        onRequestClose={() => setShowCartConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Berhasil Masuk Keranjang</Text>
            <Text style={styles.modalMessage}>
              {qty} item {product.productName} berhasil ditambahkan ke keranjang belanja.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={() => setShowCartConfirmation(false)}
              >
                <Text style={styles.modalSecondaryText}>Tetap Disini</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={() => {
                  setShowCartConfirmation(false);
                  router.push("/(tabs)/cart");
                }}
              >
                <Text style={styles.modalPrimaryText}>Lihat Keranjang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBigPlaceholder: {
    width: "100%",
    height: 240,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  productImageBig: {
    width: "100%",
    height: "100%",
  },
  imageBigText: {
    color: "#9ca3af",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 16,
  },
  qtyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  qtyLabel: {
    color: "#4b5563",
    fontSize: 13,
    fontWeight: "500",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  qtyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qtyValue: {
    paddingHorizontal: 16,
    fontWeight: "bold",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalMessage: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalSecondaryButton: {
    backgroundColor: "#f3f4f6",
  },
  modalPrimaryButton: {
    backgroundColor: "#3b82f6",
  },
  modalSecondaryText: {
    color: "#374151",
    fontWeight: "bold",
  },
  modalPrimaryText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
