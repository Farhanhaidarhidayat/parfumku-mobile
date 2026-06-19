import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../context/ShopContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.productCard}
      testID={`product-card-${product.id}`}
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
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {product.productName}
      </Text>

      <Text style={styles.productPrice}>
        Rp {product.productPrice.toLocaleString("id-ID")}
      </Text>

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
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderText: {
    color: "#9ca3af",
    fontSize: 11,
  },
  productName: {
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: 14,
  },
  productPrice: {
    color: "#3b82f6",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  productStock: {
    color: "#9ca3af",
    fontSize: 10,
    marginTop: 2,
  },
});
