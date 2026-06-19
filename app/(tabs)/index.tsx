import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../../components/ProductCard";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

export default function HomeScreen() {
  const { products, categories, fetchProducts, fetchCategories, user } =
    useShop();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  // Trigger pemanggilan data dari server API
  useEffect(() => {
    const loadData = async () => {
      setLoadingRefresh(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoadingRefresh(false);
    };
    loadData();
  }, [fetchCategories, fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.productName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "Semua" ||
      p.categoryId ===
        categories.find((c) => c.categoryName === selectedCategory)?.id;
    return matchSearch && matchCat;
  });

  return (
    <View style={styles.container}>
      {/* 1. Test Greetings dengan Nama User Hasil Login API */}
      <View style={styles.header}>
        <Text style={styles.subGreeting}>
          Halo, {user?.name || "Mahasiswa"}
        </Text>
        <Text style={styles.mainGreeting}>ParfumKu</Text>
      </View>

      {/* 2. Filter Search */}
      <TextInput
        placeholder="Cari produk di proyek ini..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {/* 3. Filter Kategori */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.categoryName)}
              style={[
                styles.categoryBadge,
                selectedCategory === item.categoryName &&
                  styles.categoryBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.categoryName &&
                    styles.categoryTextActive,
                ]}
              >
                {item.categoryName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Loading Indikator Data API */}
      {loadingRefresh ? (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 40 }}
        />
      ) : (
        /* 4. List Product Grid */
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

// Gunakan stylesheet murni dari respons sebelumnya untuk menghemat baris kode Anda
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: { marginBottom: 16 },
  subGreeting: { color: "#6b7280", fontSize: 13 },
  mainGreeting: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  searchBar: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  categoryContainer: { marginBottom: 16 },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  categoryBadgeActive: { backgroundColor: "#3b82f6" },
  categoryText: { color: "#374151", fontWeight: "500" },
  categoryTextActive: { color: "#ffffff" },
  gridRow: { justifyContent: "space-between", gap: 12 },
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
