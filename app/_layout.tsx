import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { ShopProvider, useShop } from "../context/ShopContext";

function RootContent() {
  const { width } = useWindowDimensions();

  const isDesktop = Platform.OS === "web" && width >= 900;

  const { token, login, register, loading } = useShop();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const changeAuthMode = () => {
    resetForm();
    setIsLogin((previous) => !previous);
  };

  const handleSubmit = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!isLogin && !cleanName) {
      Alert.alert("Nama belum diisi", "Masukkan nama lengkap terlebih dahulu.");
      return;
    }

    if (!cleanEmail) {
      Alert.alert(
        "Email belum diisi",
        "Masukkan alamat email terlebih dahulu.",
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      Alert.alert("Email tidak valid", "Gunakan format email yang benar.");
      return;
    }

    if (!password) {
      Alert.alert("Password belum diisi", "Masukkan password terlebih dahulu.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password terlalu pendek", "Password minimal 6 karakter.");
      return;
    }

    if (isLogin) {
      await login(cleanEmail, password);
      return;
    }

    const success = await register(cleanName, cleanEmail, password);

    if (success) {
      resetForm();
      setIsLogin(true);
    }
  };

  if (!token) {
    return (
      <View style={styles.screen}>
        <StatusBar style="light" />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isDesktop && styles.scrollContentDesktop,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.authContainer,
                isDesktop
                  ? [
                      styles.authContainerDesktop,
                      {
                        width: Math.min(width - 48, 1100),
                      },
                    ]
                  : styles.authContainerMobile,
              ]}
            >
              {/* HERO PARFUMKU */}
              <LinearGradient
                colors={["#E36B16", "#B94108", "#631D05"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.hero, isDesktop && styles.heroDesktop]}
              >
                <View style={styles.circleDecoration} />

                <View
                  style={[
                    styles.heroContent,
                    isDesktop && styles.heroContentDesktop,
                  ]}
                >
                  <Text style={styles.heroLabel}>Temukan aroma terbaikmu</Text>

                  <Text
                    style={[
                      styles.heroTitle,
                      isDesktop && styles.heroTitleDesktop,
                    ]}
                  >
                    Aroma yang mencerminkan dirimu.
                  </Text>

                  <Text
                    style={[
                      styles.heroDescription,
                      isDesktop && styles.heroDescriptionDesktop,
                    ]}
                  >
                    Jelajahi berbagai pilihan parfum untuk setiap karakter dan
                    suasana.
                  </Text>
                </View>

                {/* Ilustrasi botol sederhana */}
                <View
                  style={[
                    styles.bottleContainer,
                    isDesktop && styles.bottleContainerDesktop,
                  ]}
                >
                  <View style={styles.bottleCap} />

                  <LinearGradient
                    colors={["#FFC47D", "#EC8029", "#B5400C"]}
                    style={styles.bottle}
                  >
                    <Image
                      source={require("../assets/images/parfumku-logo-icon.png")}
                      style={styles.bottleLogoImage}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </View>
              </LinearGradient>

              {/* FORM LOGIN / REGISTER */}
              <View
                style={[styles.formCard, isDesktop && styles.formCardDesktop]}
              >
                {!isDesktop && <View style={styles.handle} />}

                <View style={styles.formContent}>
                  <Text style={styles.formTitle}>
                    {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
                  </Text>

                  <Text style={styles.formSubtitle}>
                    {isLogin
                      ? "Masuk untuk melanjutkan belanja parfum favoritmu."
                      : "Daftar untuk mulai berbelanja di ParfumKu."}
                  </Text>

                  {!isLogin && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nama lengkap</Text>

                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color="#A89A93"
                        />

                        <TextInput
                          value={name}
                          onChangeText={setName}
                          placeholder="Masukkan nama lengkap"
                          placeholderTextColor="#766B66"
                          style={styles.input}
                          autoCapitalize="words"
                          editable={!loading}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>

                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color="#A89A93" />

                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="contoh@email.com"
                        placeholderTextColor="#766B66"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>

                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#A89A93"
                      />

                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Minimal 6 karakter"
                        placeholderTextColor="#766B66"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        onSubmitEditing={handleSubmit}
                      />

                      <TouchableOpacity
                        onPress={() => setShowPassword((previous) => !previous)}
                        style={styles.eyeButton}
                        disabled={loading}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={21}
                          color="#A89A93"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                    style={[
                      styles.buttonWrapper,
                      loading && styles.buttonDisabled,
                    ]}
                  >
                    <LinearGradient
                      colors={["#F07B24", "#B63B08"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitButton}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.submitButtonText}>
                            {isLogin ? "Masuk Sekarang" : "Daftar Sekarang"}
                          </Text>

                          <Ionicons
                            name="arrow-forward"
                            size={19}
                            color="#FFFFFF"
                          />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>
                      {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                    </Text>

                    <TouchableOpacity
                      onPress={changeAuthMode}
                      disabled={loading}
                    >
                      <Text style={styles.switchAction}>
                        {isLogin ? "Daftar" : "Masuk"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.footerText}>
                    Dengan melanjutkan, kamu menyetujui ketentuan layanan
                    ParfumKu.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          title: "Detail Produk",
          headerStyle: {
            backgroundColor: "#17110E",
          },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="checkout"
        options={{
          headerShown: true,
          title: "Checkout",
          headerStyle: {
            backgroundColor: "#17110E",
          },
          headerTintColor: "#FFFFFF",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ShopProvider>
      <RootContent />
    </ShopProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#090706",
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#090706",
  },

  bottleLogoImage: {
    width: 72,
    height: 52,
  },

  scrollContentDesktop: {
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  authContainer: {
    overflow: "hidden",
    backgroundColor: "#17110E",
  },

  authContainerMobile: {
    width: "100%",
    maxWidth: 520,
    minHeight: "100%",
  },

  authContainerDesktop: {
    flexDirection: "row",
    minHeight: 680,
    maxHeight: 760,
    borderRadius: 28,
  },

  hero: {
    position: "relative",
    width: "100%",
    minHeight: 320,
    paddingTop: 48,
    paddingHorizontal: 23,
    paddingBottom: 40,
    overflow: "hidden",
  },

  heroDesktop: {
    width: "56%",
    minHeight: 680,
    flexGrow: 0,
    flexShrink: 0,
    paddingTop: 48,
    paddingHorizontal: 44,
  },

  circleDecoration: {
    position: "absolute",
    top: -75,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  heroContent: {
    width: "67%",
    marginTop: 138,
    zIndex: 2,
  },

  heroContentDesktop: {
    width: "70%",
    maxWidth: 430,
    marginTop: 85,
  },

  heroLabel: {
    color: "#FFE0C7",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "900",
    marginTop: 10,
  },

  heroTitleDesktop: {
    fontSize: 42,
    lineHeight: 49,
  },

  heroDescription: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 13,
  },

  heroDescriptionDesktop: {
    fontSize: 15,
    lineHeight: 23,
  },

  bottleContainer: {
    position: "absolute",
    right: 24,
    bottom: 26,
    alignItems: "center",
    transform: [{ rotate: "7deg" }],
  },

  bottleContainerDesktop: {
    right: 70,
    bottom: 95,
    transform: [{ rotate: "7deg" }, { scale: 1.4 }],
  },

  bottleCap: {
    width: 39,
    height: 26,
    backgroundColor: "#29150D",
    borderWidth: 1,
    borderColor: "#F09A55",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  bottle: {
    width: 90,
    height: 128,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,235,210,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  formCard: {
    width: "100%",
    minHeight: 490,
    marginTop: -24,
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: "#17110E",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  formCardDesktop: {
    width: "44%",
    minHeight: 680,
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 0,
    paddingHorizontal: 45,
    paddingVertical: 45,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: "center",
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "#4A3A33",
    marginBottom: 21,
  },

  formContent: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
  },

  formTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  formSubtitle: {
    color: "#978A84",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    color: "#E3D9D4",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputWrapper: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#241C18",
    borderWidth: 1,
    borderColor: "#3B2D27",
    borderRadius: 14,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  eyeButton: {
    width: 36,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonWrapper: {
    marginTop: 7,
    borderRadius: 14,
    overflow: "hidden",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  submitButton: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 10,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  switchText: {
    color: "#92857F",
    fontSize: 13,
  },

  switchAction: {
    color: "#F0802D",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },

  footerText: {
    color: "#625752",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 23,
    paddingHorizontal: 20,
  },
});
