import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import OrderCard from "../../components/OrderCard";
import { useShop } from "../../context/ShopContext";

export default function HistoryScreen() {
  const { purchases, fetchPurchases } = useShop();

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Histori Pembelian</Text>
      <Text style={styles.subtitle}>Riwayat checkout dan barang yang pernah dibeli.</Text>

      {purchases.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Belum ada riwayat pembelian.</Text>
        </View>
      ) : (
        purchases.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F3ED" },
  content: { padding: 16, paddingBottom: 110, maxWidth: 820, width: "100%", alignSelf: "center" },
  title: { fontSize: 22, fontWeight: "900", color: "#2F2722", marginTop: 6 },
  subtitle: { color: "#6B5D55", fontSize: 13, marginTop: 4, marginBottom: 16 },
  emptyCard: { backgroundColor: "#FFFDF9", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#E8DDD2", alignItems: "center" },
  emptyText: { color: "#8E7E76" },
});
