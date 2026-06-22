import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrderCard from "../../components/OrderCard";
import { useShop } from "../../context/ShopContext";

export default function ProfileScreen() {
  const {
    purchases,
    fetchPurchases,
    user,
    logout,
    savedAddresses = [],
    saveAddress = async () => {},
    profileImage,
    setProfileImage = async () => {},
    favorites = [],
    products = [],
  } = useShop();
  const [addressInput, setAddressInput] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handlePickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin diperlukan", "Berikan izin galeri untuk memilih foto profil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.82,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressInput.trim()) {
      Alert.alert("Alamat kosong", "Masukkan alamat terlebih dahulu.");
      return;
    }
    await saveAddress(addressInput, "Alamat Tersimpan");
    setAddressInput("");
  };

  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={handlePickProfileImage} style={styles.avatarWrapper} activeOpacity={0.85}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.substring(0, 2).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}><Text style={styles.cameraText}>Ubah Foto</Text></View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{user?.name || "Loading..."}</Text>
        <Text style={styles.profileNim}>Pembeli ParfumKu</Text>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar / Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Alamat Tersimpan</Text>
      <View style={styles.card}>
        <TextInput
          placeholder="Tambah alamat rumah/kantor..."
          placeholderTextColor="#9B8B81"
          value={addressInput}
          onChangeText={setAddressInput}
          multiline
          style={styles.addressInput}
        />
        <TouchableOpacity style={styles.saveAddressBtn} onPress={handleSaveAddress}>
          <Text style={styles.saveAddressText}>Simpan Alamat</Text>
        </TouchableOpacity>
        {savedAddresses.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada alamat tersimpan.</Text>
        ) : (
          savedAddresses.map((item) => (
            <View key={item.id} style={styles.addressItem}>
              <Text style={styles.addressLabel}>{item.label}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Barang Disukai</Text>
      <View style={styles.card}>
        {favoriteProducts.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada produk yang disukai.</Text>
        ) : (
          favoriteProducts.map((product) => (
            <View key={product.id} style={styles.favoriteRow}>
              <View style={styles.favoriteImageBox}>
                {product.productImage ? <Image source={{ uri: product.productImage }} style={styles.favoriteImage} /> : <Text style={styles.favoriteImageText}>Foto</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.favoriteName} numberOfLines={1}>{product.productName}</Text>
                <Text style={styles.favoritePrice}>Rp {product.productPrice.toLocaleString("id-ID")}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Histori Pembelian</Text>
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
  content: { padding: 16, paddingBottom: 34, maxWidth: 820, width: "100%", alignSelf: "center" },
  profileCard: { backgroundColor: "#FFFDF9", padding: 18, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "#E8DDD2", marginBottom: 20 },
  avatarWrapper: { alignItems: "center", marginBottom: 10 },
  avatar: { width: 78, height: 78, backgroundColor: "#8A4E2A", borderRadius: 39, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: 78, height: 78, borderRadius: 39 },
  avatarText: { color: "#ffffff", fontWeight: "bold", fontSize: 22 },
  cameraBadge: { backgroundColor: "#EFE3D6", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: -8, borderWidth: 1, borderColor: "#FFFDF9" },
  cameraText: { color: "#6B5D55", fontSize: 10, fontWeight: "800" },
  profileName: { fontSize: 18, fontWeight: "900", color: "#2F2722" },
  profileNim: { color: "#8E7E76", fontSize: 12, marginTop: 2, marginBottom: 12 },
  logoutBtn: { backgroundColor: "#FBEDEA", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  logoutText: { color: "#B24B3E", fontSize: 12, fontWeight: "800" },
  sectionTitle: { fontSize: 12, fontWeight: "900", color: "#6B5D55", textTransform: "uppercase", marginBottom: 10, paddingHorizontal: 4 },
  card: { backgroundColor: "#FFFDF9", padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#E8DDD2", marginBottom: 20 },
  addressInput: { minHeight: 74, backgroundColor: "#F8F3ED", borderRadius: 12, borderWidth: 1, borderColor: "#E8DDD2", padding: 11, color: "#2F2722", textAlignVertical: "top", marginBottom: 10 },
  saveAddressBtn: { backgroundColor: "#8A4E2A", paddingVertical: 11, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  saveAddressText: { color: "#FFFFFF", fontWeight: "900" },
  addressItem: { backgroundColor: "#F8F3ED", borderRadius: 12, padding: 11, marginTop: 8 },
  addressLabel: { color: "#2F2722", fontWeight: "900", fontSize: 12, marginBottom: 3 },
  addressText: { color: "#6B5D55", fontSize: 12, lineHeight: 18 },
  favoriteRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  favoriteImageBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#EFE7DE", alignItems: "center", justifyContent: "center", overflow: "hidden", marginRight: 10 },
  favoriteImage: { width: "100%", height: "100%" },
  favoriteImageText: { color: "#8E7E76", fontSize: 10 },
  favoriteName: { color: "#2F2722", fontWeight: "900", fontSize: 13 },
  favoritePrice: { color: "#8A4E2A", fontWeight: "800", fontSize: 12, marginTop: 2 },
  emptyCard: { backgroundColor: "#FFFDF9", padding: 24, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#E8DDD2" },
  emptyText: { color: "#8E7E76", fontSize: 13, lineHeight: 19 },
});
