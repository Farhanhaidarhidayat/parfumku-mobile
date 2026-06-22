import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useShop } from "../../context/ShopContext";

export default function FavoritesScreen() {
  const { products, favorites, ratings, toggleFavorite } = useShop();
  const router = useRouter();
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barang Disukai</Text>
      <Text style={styles.subtitle}>Produk parfum yang kamu simpan dengan tombol love.</Text>

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada barang yang disukai.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: String(item.id) } })}
          >
            <View style={styles.imageBox}>
              {item.productImage ? <Image source={{ uri: item.productImage }} style={styles.image} /> : <Text style={styles.imageText}>Foto</Text>}
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.price}>Rp {item.productPrice.toLocaleString("id-ID")}</Text>
              <Text style={styles.rating}>Rating: {ratings[item.id] ? `${ratings[item.id]}/5` : "Belum dinilai"}</Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.removeText}>Hapus</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F3ED", padding: 16 },
  title: { fontSize: 22, fontWeight: "900", color: "#2F2722", marginTop: 6 },
  subtitle: { color: "#6B5D55", fontSize: 13, marginTop: 4, marginBottom: 16 },
  listContent: { paddingBottom: 110, maxWidth: 820, width: "100%", alignSelf: "center" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFDF9", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#E8DDD2", marginBottom: 12 },
  imageBox: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#EFE7DE", alignItems: "center", justifyContent: "center", overflow: "hidden", marginRight: 12 },
  image: { width: "100%", height: "100%" },
  imageText: { color: "#8E7E76", fontSize: 11 },
  info: { flex: 1 },
  name: { color: "#2F2722", fontWeight: "900", fontSize: 14 },
  price: { color: "#8A4E2A", fontWeight: "800", fontSize: 13, marginTop: 4 },
  rating: { color: "#8E7E76", fontSize: 11, marginTop: 3 },
  removeBtn: { backgroundColor: "#FBEDEA", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  removeText: { color: "#B24B3E", fontWeight: "800", fontSize: 11 },
  emptyCard: { backgroundColor: "#FFFDF9", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#E8DDD2", alignItems: "center" },
  emptyText: { color: "#8E7E76" },
});
