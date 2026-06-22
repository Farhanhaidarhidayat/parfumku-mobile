import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { getCartQuantityForProduct } from "../utils/shopLogic";

const BASE_URL = "https://shop.tandurkarya.com";
const PROJECT_ID = 3;

export interface Product {
  id: number;
  categoryId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productImage?: string;
  productImages?: string[];
  images?: string[];
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: "wallet" | "bank";
  logoUrl?: string;
}

export interface Purchase {
  id: number;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  paymentMethod?: PaymentMethod;
  items?: {
    id: number;
    quantity: number;
    productName: string;
    productPrice: number;
    productImage?: string;
  }[];
}

export interface SavedAddress {
  id: number;
  label: string;
  address: string;
}

interface ShopContextType {
  token: string | null;
  user: any | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  paymentMethods: PaymentMethod[];
  purchases: Purchase[];
  favorites: number[];
  ratings: Record<number, number>;
  savedAddresses: SavedAddress[];
  profileImage: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  updateCartQty: (cartId: number, qty: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  checkout: (address: string, paymentMethodId: number) => Promise<boolean>;
  toggleFavorite: (productId: number) => Promise<void>;
  setProductRating: (productId: number, rating: number) => Promise<void>;
  saveAddress: (address: string, label?: string) => Promise<void>;
  setProfileImage: (uri: string | null) => Promise<void>;
  createPaymentMethod: (
    name: string,
    type: "wallet" | "bank",
    logoUrl: string,
  ) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const parseJsonResponse = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Response server tidak valid.");
  }
};

const getErrorMessage = (data: any, fallback: string) => {
  return data?.message || data?.error || fallback;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, categoryName: "Semua" },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token],
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData"]);
    } catch (err) {
      console.error("Gagal menghapus session token", err);
    }

    setToken(null);
    setUser(null);
    setProducts([]);
    setCategories([{ id: 0, categoryName: "Semua" }]);
    setCart([]);
    setPaymentMethods([]);
    setPurchases([]);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const savedToken = await AsyncStorage.getItem("userToken");
        const savedUser = await AsyncStorage.getItem("userData");
        const savedFavorites = await AsyncStorage.getItem("favoriteProducts");
        const savedRatings = await AsyncStorage.getItem("productRatings");
        const savedAddressesData = await AsyncStorage.getItem("savedAddresses");
        const savedProfileImage = await AsyncStorage.getItem("profileImage");

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedRatings) setRatings(JSON.parse(savedRatings));
        if (savedAddressesData) setSavedAddresses(JSON.parse(savedAddressesData));
        if (savedProfileImage) setProfileImageState(savedProfileImage);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Gagal memuat token dari storage", err);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [logout]);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: PROJECT_ID, name, email, password }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(getErrorMessage(data, "Registrasi gagal."));
        }

        Alert.alert("Sukses", "Akun berhasil dibuat. Silakan login.");
        return true;
      } catch (err: any) {
        Alert.alert("Register Error", err.message || "Registrasi gagal.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || !data?.success || !data?.data?.token) {
          throw new Error(getErrorMessage(data, "Email atau password salah."));
        }

        const loginToken = data.data.token;
        const loginUser = data.data.user;

        setToken(loginToken);
        setUser(loginUser);
        await AsyncStorage.setItem("userToken", loginToken);
        await AsyncStorage.setItem("userData", JSON.stringify(loginUser));

        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        headers: getHeaders(),
      });
      const data = await parseJsonResponse(res);

      if (res.status === 401) {
        await logout();
        return;
      }

      if (res.ok && data?.success && Array.isArray(data.data)) {
        setCategories([{ id: 0, categoryName: "Semua" }, ...data.data]);
      }
    } catch (err) {
      console.error("Gagal mengambil data kategori", err);
    }
  }, [getHeaders, logout, token]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        headers: getHeaders(),
      });
      const data = await parseJsonResponse(res);

      if (res.status === 401) {
        await logout();
        return;
      }

      if (res.ok && data?.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data produk", err);
    }
  }, [getHeaders, logout, token]);

  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/carts`, { headers: getHeaders() });
      const data = await parseJsonResponse(res);

      if (res.status === 401) {
        await logout();
        return;
      }

      if (res.ok && data?.success && Array.isArray(data.data)) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data keranjang", err);
    }
  }, [getHeaders, logout, token]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/payment-methods`, {
        headers: getHeaders(),
      });
      const data = await parseJsonResponse(res);

      if (res.status === 401) {
        await logout();
        return;
      }

      if (res.ok && data?.success && Array.isArray(data.data)) {
        setPaymentMethods(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil metode pembayaran", err);
    }
  }, [getHeaders, logout, token]);

  const fetchPurchases = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/purchases`, {
        headers: getHeaders(),
      });
      const data = await parseJsonResponse(res);

      if (res.status === 401) {
        await logout();
        return;
      }

      if (res.ok && data?.success && Array.isArray(data.data)) {
        setPurchases(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat transaksi", err);
    }
  }, [getHeaders, logout, token]);

  const addToCart = useCallback(
    async (productId: number, quantity: number): Promise<boolean> => {
      if (!token) return false;

      const product = products.find((item) => item.id === productId);
      if (product) {
        const inCartQty = getCartQuantityForProduct(cart, productId);
        const availableQty = Math.max(0, product.productStock - inCartQty);

        if (availableQty <= 0) {
          Alert.alert("Stok Habis", "Semua stok produk ini sudah ada di keranjang.");
          return false;
        }

        if (quantity > availableQty) {
          Alert.alert(
            "Stok Tidak Cukup",
            `Stok tersedia tinggal ${availableQty}. Jumlah disesuaikan dengan stok.`,
          );
          quantity = availableQty;
        }
      }

      try {
        const res = await fetch(`${BASE_URL}/carts`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ productId, quantity }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(
            getErrorMessage(data, "Gagal menambahkan item ke keranjang."),
          );
        }

        await fetchCart();
        await fetchProducts();
        return true;
      } catch (err: any) {
        Alert.alert("Cart Error", err.message || "Gagal menambahkan item.");
        return false;
      }
    },
    [cart, fetchCart, fetchProducts, getHeaders, products, token],
  );

  const removeFromCart = useCallback(
    async (cartId: number) => {
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(getErrorMessage(data, "Gagal menghapus item."));
        }

        await fetchCart();
        await fetchProducts();
      } catch (err: any) {
        Alert.alert("Delete Error", err.message || "Gagal menghapus item.");
      }
    },
    [fetchCart, fetchProducts, getHeaders, token],
  );

  const updateCartQty = useCallback(
    async (cartId: number, qty: number) => {
      if (qty <= 0) {
        await removeFromCart(cartId);
        return;
      }

      if (!token) return;

      const currentItem = cart.find((item) => item.id === cartId);
      if (!currentItem) return;

      const maxAllowedQty = Math.max(0, currentItem.product?.productStock ?? 0);
      if (qty > maxAllowedQty) {
        Alert.alert("Stok Tidak Cukup", `Maksimal pembelian produk ini ${maxAllowedQty} item.`);
        return;
      }

      try {
        if (qty > currentItem.quantity) {
          const addedQty = qty - currentItem.quantity;

          if (addedQty > (currentItem.product?.productStock ?? 0)) {
            Alert.alert("Stok Tidak Cukup", "Jumlah pembelian melebihi stok tersedia.");
            return;
          }

          const res = await fetch(`${BASE_URL}/carts`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              productId: currentItem.product.id,
              quantity: addedQty,
            }),
          });
          const data = await parseJsonResponse(res);

          if (!res.ok || data?.success === false) {
            throw new Error(getErrorMessage(data, "Gagal menambahkan kuantitas."));
          }
        } else if (qty < currentItem.quantity) {
          const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ quantity: qty }),
          });
          const data = await parseJsonResponse(res);

          if (!res.ok || data?.success === false) {
            throw new Error(getErrorMessage(data, "Gagal memperbarui kuantitas."));
          }
        } else {
          return;
        }

        await fetchCart();
        await fetchProducts();
      } catch (err: any) {
        Alert.alert(
          "Update Cart Error",
          err.message || "Gagal memperbarui kuantitas.",
        );
      }
    },
    [cart, fetchCart, fetchProducts, getHeaders, removeFromCart, token],
  );

  const saveAddress = useCallback(
    async (address: string, label = "Alamat Utama") => {
      const cleanAddress = address.trim();
      if (!cleanAddress) return;

      const nextAddresses = [
        { id: Date.now(), label, address: cleanAddress },
        ...savedAddresses.filter((item) => item.address !== cleanAddress),
      ].slice(0, 5);

      setSavedAddresses(nextAddresses);
      await AsyncStorage.setItem("savedAddresses", JSON.stringify(nextAddresses));
    },
    [savedAddresses],
  );

  const checkout = useCallback(
    async (address: string, paymentMethodId: number): Promise<boolean> => {
      if (!token) return false;

      if (cart.length === 0) {
        Alert.alert("Checkout Gagal", "Keranjang masih kosong.");
        return false;
      }

      try {
        const res = await fetch(`${BASE_URL}/purchases`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ address: address.trim(), paymentMethodId }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(
            getErrorMessage(data, "Proses checkout gagal divalidasi server."),
          );
        }

        setCart([]);
        await saveAddress(address.trim());
        await fetchPurchases();
        await fetchProducts();
        return true;
      } catch (err: any) {
        Alert.alert("Checkout Gagal", err.message || "Checkout gagal.");
        return false;
      }
    },
    [cart.length, fetchProducts, fetchPurchases, getHeaders, saveAddress, token],
  );

  const toggleFavorite = useCallback(async (productId: number) => {
    const nextFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(nextFavorites);
    await AsyncStorage.setItem("favoriteProducts", JSON.stringify(nextFavorites));
  }, [favorites]);

  const setProductRating = useCallback(
    async (productId: number, rating: number) => {
      const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
      const nextRatings = { ...ratings, [productId]: safeRating };

      setRatings(nextRatings);
      await AsyncStorage.setItem("productRatings", JSON.stringify(nextRatings));
    },
    [ratings],
  );

  const setProfileImage = useCallback(async (uri: string | null) => {
    setProfileImageState(uri);
    if (uri) {
      await AsyncStorage.setItem("profileImage", uri);
    } else {
      await AsyncStorage.removeItem("profileImage");
    }
  }, []);

  const createPaymentMethod = useCallback(
    async (
      name: string,
      type: "wallet" | "bank",
      logoUrl: string,
    ): Promise<boolean> => {
      if (!token) return false;

      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/payment-methods`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ name, type, logoUrl }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(
            getErrorMessage(data, "Gagal membuat metode pembayaran."),
          );
        }

        await fetchPaymentMethods();
        return true;
      } catch (err: any) {
        Alert.alert("Payment Error", err.message || "Gagal membuat metode pembayaran.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPaymentMethods, getHeaders, token],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      products,
      categories,
      cart,
      paymentMethods,
      purchases,
      favorites,
      ratings,
      savedAddresses,
      profileImage,
      loading,
      login,
      register,
      logout,
      fetchProducts,
      fetchCategories,
      fetchCart,
      fetchPaymentMethods,
      fetchPurchases,
      addToCart,
      updateCartQty,
      removeFromCart,
      checkout,
      toggleFavorite,
      setProductRating,
      saveAddress,
      setProfileImage,
      createPaymentMethod,
    }),
    [
      addToCart,
      cart,
      categories,
      checkout,
      createPaymentMethod,
      fetchCart,
      fetchCategories,
      fetchPaymentMethods,
      fetchProducts,
      fetchPurchases,
      favorites,
      loading,
      login,
      logout,
      paymentMethods,
      products,
      profileImage,
      purchases,
      ratings,
      register,
      removeFromCart,
      savedAddresses,
      saveAddress,
      setProductRating,
      setProfileImage,
      token,
      toggleFavorite,
      updateCartQty,
      user,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop harus dibungkus di dalam ShopProvider");
  }
  return context;
};
