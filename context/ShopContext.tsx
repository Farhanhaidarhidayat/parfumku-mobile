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
  }[];
}

interface ShopContextType {
  token: string | null;
  user: any | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  paymentMethods: PaymentMethod[];
  purchases: Purchase[];
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
        return true;
      } catch (err: any) {
        Alert.alert("Cart Error", err.message || "Gagal menambahkan item.");
        return false;
      }
    },
    [fetchCart, getHeaders, token],
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
      } catch (err: any) {
        Alert.alert("Delete Error", err.message || "Gagal menghapus item.");
      }
    },
    [fetchCart, getHeaders, token],
  );

  const updateCartQty = useCallback(
    async (cartId: number, qty: number) => {
      if (qty <= 0) {
        await removeFromCart(cartId);
        return;
      }

      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ quantity: qty }),
        });
        const data = await parseJsonResponse(res);

        if (!res.ok || data?.success === false) {
          throw new Error(getErrorMessage(data, "Gagal memperbarui kuantitas."));
        }

        await fetchCart();
      } catch (err: any) {
        Alert.alert(
          "Update Cart Error",
          err.message || "Gagal memperbarui kuantitas.",
        );
      }
    },
    [fetchCart, getHeaders, removeFromCart, token],
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
        await fetchPurchases();
        return true;
      } catch (err: any) {
        Alert.alert("Checkout Gagal", err.message || "Checkout gagal.");
        return false;
      }
    },
    [cart.length, fetchPurchases, getHeaders, token],
  );

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
      loading,
      login,
      logout,
      paymentMethods,
      products,
      purchases,
      register,
      removeFromCart,
      token,
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
