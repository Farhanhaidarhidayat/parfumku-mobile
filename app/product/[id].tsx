import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../../context/ShopContext";
import { getProductImages, getRemainingStockForProduct } from "../../utils/shopLogic";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    products,
    cart = [],
    addToCart,
    fetchProducts,
    favorites = [],
    ratings = {},
    toggleFavorite = async () => {},
    setProductRating = async () => {},
  } = useShop();
  const router = useRouter();

  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCartConfirmation, setShowCartConfirmation] = useState(false);

  const remainingStock = useMemo(
    () => (product ? getRemainingStockForProduct(product, cart) : 0),
    [cart, product],
  );
  const galleryImages = useMemo(
    () => (product ? getProductImages(product) : []),
    [product],
  );

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

  const rating = ratings[product.id] ?? 0;
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = async () => {
    if (remainingStock <= 0) {
      Alert.alert("Stok Habis", "Stok produk ini sudah habis atau sudah penuh di keranjang.");
      return;
    }

    if (qty > remainingStock) {
      Alert.alert("Gagal", `Jumlah maksimal yang bisa ditambahkan ${remainingStock}.`);
      setQty(remainingStock);
      return;
    }

    const success = await addToCart(product.id, qty);

    if (success) {
      setShowCartConfirmation(true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageBigPlaceholder}>
        {galleryImages.length > 0 ? (
          <FlatList
            data={galleryImages}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.productImageBig}
                resizeMode="cover"
              />
            )}
          />
        ) : (
          <Text style={styles.imageBigText}>Pratinjau Gambar Produk</Text>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#D35A4A" : "#6B5D55"}
          />
        </TouchableOpacity>
      </View>

      {galleryImages.length > 1 && (
        <View style={styles.dotsRow}>
          {galleryImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeImageIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{product.productName}</Text>
          <Text style={styles.price}>
            Rp {product.productPrice.toLocaleString("id-ID")}
          </Text>
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>Stok {product.productStock}</Text>
        </View>
      </View>

      <View style={styles.ratingBox}>
        <Text style={styles.ratingLabel}>Rating barang</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setProductRating(product.id, star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={25}
                color="#B78952"
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingValue}>{rating ? `${rating}/5` : "Belum dinilai"}</Text>
        </View>
      </View>

      <Text style={styles.description}>{product.productDescription}</Text>

      <View style={styles.footer}>
        <View style={styles.qtyContainer}>
          <Text style={styles.qtyLabel}>
            Atur Jumlah (Bisa ditambah: {remainingStock})
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
              onPress={() => setQty(Math.min(remainingStock, qty + 1))}
              style={[styles.qtyBtn, remainingStock <= qty && styles.qtyBtnDisabled]}
              disabled={remainingStock <= qty}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.primaryButton, remainingStock <= 0 && styles.primaryButtonDisabled]}
          disabled={remainingStock <= 0}
        >
          <Text style={styles.primaryButtonText}>
            {remainingStock <= 0 ? "Stok Tidak Tersedia" : "Tambah Ke Keranjang"}
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
                <Text style={styles.modalSecondaryText}>Belanja Lagi</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F3ED" },
  content: { padding: 16, paddingBottom: 34, maxWidth: 820, width: "100%", alignSelf: "center" },
  centerContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  imageBigPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EFE7DE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  productImageBig: { width: "100%", height: "100%" },
  imageBigText: { color: "#8E7E76", fontWeight: "bold" },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,253,249,0.92)",
  },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#D8CABE" },
  dotActive: { width: 18, backgroundColor: "#8A4E2A" },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginTop: 6 },
  title: { fontSize: 23, fontWeight: "900", color: "#2F2722", marginBottom: 4 },
  price: { fontSize: 18, fontWeight: "800", color: "#8A4E2A", marginBottom: 12 },
  stockBadge: { backgroundColor: "#EFE3D6", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  stockText: { color: "#6B5D55", fontWeight: "800", fontSize: 12 },
  ratingBox: { backgroundColor: "#FFFDF9", borderWidth: 1, borderColor: "#E8DDD2", borderRadius: 16, padding: 12, marginBottom: 12 },
  ratingLabel: { color: "#6B5D55", fontWeight: "800", fontSize: 12, marginBottom: 8 },
  starRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingValue: { color: "#8E7E76", marginLeft: 8, fontSize: 12, fontWeight: "700" },
  description: { fontSize: 14, color: "#5D514A", lineHeight: 21, marginBottom: 18 },
  footer: { marginTop: "auto", borderTopWidth: 1, borderTopColor: "#E8DDD2", paddingTop: 16 },
  qtyContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 },
  qtyLabel: { color: "#5D514A", fontSize: 13, fontWeight: "700", flex: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#D8CABE", borderRadius: 10, overflow: "hidden" },
  qtyBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#FFFDF9" },
  qtyBtnDisabled: { opacity: 0.45 },
  qtyBtnText: { fontSize: 16, fontWeight: "bold", color: "#2F2722" },
  qtyValue: { paddingHorizontal: 17, fontWeight: "bold", fontSize: 14, color: "#2F2722" },
  primaryButton: { backgroundColor: "#8A4E2A", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  primaryButtonDisabled: { backgroundColor: "#B7AAA0" },
  primaryButtonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.35)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard: { width: "100%", maxWidth: 420, backgroundColor: "#FFFDF9", borderRadius: 18, padding: 20 },
  modalTitle: { color: "#2F2722", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalMessage: { color: "#5D514A", fontSize: 14, lineHeight: 20, marginBottom: 18 },
  modalActions: { flexDirection: "row", gap: 10 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  modalSecondaryButton: { backgroundColor: "#EFE3D6" },
  modalPrimaryButton: { backgroundColor: "#8A4E2A" },
  modalSecondaryText: { color: "#5D514A", fontWeight: "bold" },
  modalPrimaryText: { color: "#ffffff", fontWeight: "bold" },
});
