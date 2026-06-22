import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ProductCard from "../../components/ProductCard";
import { useShop } from "../../context/ShopContext";

const COLORS = {
  background: "#080605",
  surface: "#17110E",
  surfaceSoft: "#211713",
  orange: "#F07122",
  orangeDark: "#B83B08",
  orangeDeep: "#702000",
  orangeSoft: "#32170C",
  text: "#FFFFFF",
  textSoft: "#E6D8D1",
  textMuted: "#A9978E",
  border: "#3A2A23",
};

export default function HomeScreen() {
  const {
    products,
    categories,
    fetchProducts,
    fetchCategories,
    user,
    favorites = [],
    ratings = {},
    toggleFavorite = async () => {},
  } = useShop();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const loadData = async () => {
    try {
      setLoadingRefresh(true);

      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (error) {
      console.error("Gagal mengambil data halaman Home:", error);
    } finally {
      setLoadingRefresh(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

    // Hanya dijalankan saat halaman pertama kali dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = product.productName?.toLowerCase() || "";

    const searchValue = search.trim().toLowerCase();

    const matchSearch = productName.includes(searchValue);

    const selectedCategoryData = categories.find(
      (category) => category.categoryName === selectedCategory,
    );

    const matchCategory =
      selectedCategory === "Semua" ||
      product.categoryId === selectedCategoryData?.id;

    return matchSearch && matchCategory;
  });

  const firstName = user?.name?.trim().split(" ")[0] || "Pengguna";

  const openCart = () => {
    router.push("/(tabs)/cart");
  };

  const openProduct = (productId: number) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: productId.toString(),
      },
    });
  };

  const resetFilter = () => {
    setSearch("");
    setSelectedCategory("Semua");
  };

  const renderHeader = () => (
    <View>
      {/* HEADER */}
      <LinearGradient
        colors={[
          COLORS.background,
          "#1E100A",
          COLORS.orangeDeep,
          COLORS.orangeDark,
        ]}
        locations={[0, 0.35, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.orangeGlowOne} />
        <View style={styles.orangeGlowTwo} />

        <View style={styles.heroTopRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Halo, {firstName} 👋</Text>

            <Text style={styles.brandTitle}>ParfumKu</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cartButton}
            onPress={openCart}
          >
            <Ionicons name="bag-outline" size={23} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>
          Temukan aroma yang mencerminkan dirimu.
        </Text>

        <Text style={styles.heroDescription}>
          Pilih parfum terbaik untuk setiap karakter dan suasana.
        </Text>

        {/* PENCARIAN */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={21} color={COLORS.textMuted} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari parfum favoritmu..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSearch("")}
              style={styles.clearSearchButton}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* BANNER PROMO */}
      <LinearGradient
        colors={["#FFF7EF", "#F1E3D4", "#D7B58F"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.promoCard}
      >
        <View style={styles.promoContent}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>PROMO</Text>
          </View>

          <Text style={styles.promoTitle}>
            Promo aroma pilihan bulan ini
          </Text>

          <Text style={styles.promoDescription}>
            Penawaran khusus parfum original dengan stok terbatas.
          </Text>
        </View>

        <View style={styles.promoIconContainer}>
          <Ionicons name="pricetag-outline" size={34} color="#8A4E2A" />
        </View>
      </LinearGradient>

      {/* JUDUL KATEGORI */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kategori</Text>

        <Text style={styles.sectionSubtitle}>Pilih sesuai karakter</Text>
      </View>

      {/* DAFTAR KATEGORI */}
      <FlatList
        data={categories}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isActive = selectedCategory === item.categoryName;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(item.categoryName)}
              style={[
                styles.categoryBadge,
                isActive && styles.categoryBadgeActive,
              ]}
            >
              {isActive && (
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={COLORS.text}
                  style={styles.categoryIcon}
                />
              )}

              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {item.categoryName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* JUDUL PRODUK */}
      <View style={styles.productSectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Pilihan Untukmu</Text>

          <Text style={styles.productCount}>
            {filteredProducts.length} produk ditemukan
          </Text>
        </View>

        <View style={styles.filterIcon}>
          <Ionicons name="options-outline" size={20} color={COLORS.orange} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loadingRefresh}
            onRefresh={loadData}
            colors={[COLORS.orange]}
            tintColor={COLORS.orange}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          loadingRefresh ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.orange} />

              <Text style={styles.loadingText}>Memuat produk...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={[COLORS.surfaceSoft, COLORS.orangeSoft]}
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="search-outline"
                  size={34}
                  color={COLORS.orange}
                />
              </LinearGradient>

              <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>

              <Text style={styles.emptyDescription}>
                Coba gunakan kata pencarian atau kategori yang berbeda.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={resetFilter}
                style={styles.resetButtonWrapper}
              >
                <LinearGradient
                  colors={[COLORS.orange, COLORS.orangeDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resetButton}
                >
                  <Text style={styles.resetButtonText}>Reset pencarian</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => openProduct(item.id)}
            isFavorite={favorites.includes(item.id)}
            rating={ratings[item.id] ?? 0}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingBottom: 110,
    backgroundColor: COLORS.background,
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    marginHorizontal: -16,
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  orangeGlowOne: {
    position: "absolute",
    top: -90,
    right: -50,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(255,126,43,0.13)",
  },

  orangeGlowTwo: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,87,0,0.08)",
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greetingContainer: {
    flex: 1,
  },

  greeting: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  brandTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 2,
  },

  cartButton: {
    width: 47,
    height: 47,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "900",
    maxWidth: 410,
    marginTop: 27,
  },

  heroDescription: {
    color: COLORS.textSoft,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 380,
    marginTop: 8,
  },

  searchContainer: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,11,9,0.88)",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    marginTop: 23,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 15,
  },

  clearSearchButton: {
    padding: 4,
  },

  promoCard: {
    minHeight: 132,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginTop: 18,
  },

  promoContent: {
    flex: 1,
    paddingRight: 12,
  },

  promoBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.orange,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginBottom: 9,
  },

  promoBadgeText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  promoTitle: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },

  promoDescription: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  promoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,7,5,0.40)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  categoryList: {
    paddingRight: 10,
  },

  categoryBadge: {
    minHeight: 41,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 17,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 9,
  },

  categoryBadgeActive: {
    backgroundColor: COLORS.orange,
    borderColor: "#FF8A3C",
  },

  categoryIcon: {
    marginRight: 6,
  },

  categoryText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: COLORS.text,
  },

  productSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 14,
  },

  productCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  filterIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.orangeSoft,
    borderWidth: 1,
    borderColor: "#56250E",
  },

  gridRow: {
    justifyContent: "space-between",
    gap: 12,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 12,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 55,
  },

  emptyIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 16,
  },

  emptyDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
  },

  resetButtonWrapper: {
    overflow: "hidden",
    borderRadius: 13,
    marginTop: 18,
  },

  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
  },

  resetButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
  },
});
