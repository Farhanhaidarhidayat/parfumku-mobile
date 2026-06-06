import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useShop } from "../context/ShopContext";

export default function CheckoutScreen() {
  const { paymentMethods, checkout, fetchPaymentMethods, user, createPaymentMethod } = useShop();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  // Tarik data metode pembayaran aktif milik Project ID Anda dari API
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleCreateDefaultPayment = async () => {
    const success = await createPaymentMethod("GoPay", "wallet", "https://example.com/gopay.png");
    if (success) {
      Alert.alert("Sukses", "Metode pembayaran GoPay berhasil dibuat untuk Proyek Anda!");
    }
  };

  const handleProcessCheckout = async () => {
    if (!address.trim())
      return Alert.alert("Error", "Alamat pengiriman wajib diisi.");
    if (!selectedMethod)
      return Alert.alert("Error", "Pilih salah satu metode pembayaran API.");

    const success = await checkout(address, selectedMethod);
    if (success) {
      Alert.alert(
        "Sukses",
        "Transaksi checkout berhasil disimpan di database server!",
        [
          {
            text: "Buka Riwayat Pesanan",
            onPress: () => router.replace({ pathname: "/(tabs)/profile" }),
          },
        ],
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. Informasi User Identity dari API */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Identitas Akun Customer</Text>
        <Text style={styles.cardMainText}>{user?.name || "Loading..."}</Text>
        <Text style={styles.cardSubText}>{user?.email}</Text>
      </View>

      {/* 2. Form Input Alamat */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Alamat Tujuan Lengkap</Text>
        <TextInput
          placeholder="Tuliskan nama jalan, nomor rumah, kota, dan kode pos paket..."
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
      </View>

      {/* 3. Seleksi Opsi Metode Pembayaran (Real API Data) */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Pilih Metode Pembayaran Proyek Anda
        </Text>
        {paymentMethods.length === 0 ? (
          <View>
            <Text style={styles.noPaymentText}>
              Belum ada opsi pembayaran di database proyek.
            </Text>
            <TouchableOpacity onPress={handleCreateDefaultPayment} style={styles.createPaymentBtn}>
              <Text style={styles.createPaymentBtnText}>Buat Metode Pembayaran Uji Coba (GoPay)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={[
                styles.paymentOption,
                selectedMethod === method.id && styles.paymentOptionActive,
              ]}
            >
              <Text style={styles.paymentName}>{method.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{method.type}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity onPress={handleProcessCheckout} style={styles.payBtn}>
        <Text style={styles.payBtnText}>Kirim Transaksi ke Server</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardMainText: { fontSize: 15, fontWeight: "bold", color: "#1f2937" },
  cardSubText: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  noPaymentText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    lineHeight: 18,
  },
  textArea: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 13,
    textAlignVertical: "top",
    marginTop: 4,
  },
  paymentOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentOptionActive: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  paymentName: { fontWeight: "500", color: "#374151", fontSize: 14 },
  badge: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    color: "#4b5563",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  payBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  payBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  createPaymentBtn: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  createPaymentBtnText: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 12,
  },
});
