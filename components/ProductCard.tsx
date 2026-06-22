import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Product } from "../context/ShopContext";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  rating?: number;
  onToggleFavorite?: () => void;
}

export default function ProductCard({
  product,
  onPress,
  isFavorite = false,
  rating = 0,
  onToggleFavorite,
}: ProductCardProps) {
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width, 1200);
  const cardWidth = (containerWidth - 48) / 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.productCard, { width: cardWidth }]}
      testID={`product-card-${product.id}`}
      activeOpacity={0.86}
    >
      <View style={styles.imagePlaceholder}>
        {product.productImage ? (
          <Image
            source={{ uri: product.productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.imagePlaceholderText}>Foto Parfum</Text>
        )}

        <TouchableOpacity
          onPress={(event) => {
            event.stopPropagation?.();
            onToggleFavorite?.();
          }}
          style={styles.loveButton}
          testID={`btn-favorite-${product.id}`}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#D35A4A" : "#6B5D55"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {product.productName}
      </Text>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={12}
            color="#B78952"
          />
        ))}
        <Text style={styles.ratingText}>{rating ? rating.toFixed(1) : "Belum ada rating"}</Text>
      </View>

      <Text style={styles.productPrice}>
        Rp {product.productPrice.toLocaleString("id-ID")}
      </Text>

      <Text style={styles.productStock}>
        Stok tersedia: {product.productStock}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFFDF9",
    padding: 11,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8DDD2",
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EFE7DE",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderText: {
    color: "#8E7E76",
    fontSize: 11,
  },
  loveButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,253,249,0.92)",
    borderWidth: 1,
    borderColor: "rgba(232,221,210,0.9)",
  },
  productName: {
    fontWeight: "800",
    color: "#2F2722",
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 5,
  },
  ratingText: {
    color: "#8E7E76",
    fontSize: 10,
    marginLeft: 4,
  },
  productPrice: {
    color: "#8A4E2A",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 5,
  },
  productStock: {
    color: "#8E7E76",
    fontSize: 10,
    marginTop: 2,
  },
});
