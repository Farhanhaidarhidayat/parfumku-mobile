import { render } from "@testing-library/react-native";
import React from "react";
import CheckoutScreen from "../checkout";
import { useShop } from "../../context/ShopContext";

// Mocking useShop context hook
jest.mock("../../context/ShopContext", () => ({
  useShop: jest.fn(),
}));

// Mocking expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe("CheckoutScreen test", () => {
  it("harus merender form pengiriman dan metode pembayaran", () => {
    const mockPaymentMethods = [
      { id: 1, name: "Transfer Bank BCA", type: "bank" },
    ];

    (useShop as jest.Mock).mockReturnValue({
      paymentMethods: mockPaymentMethods,
      cart: [
        {
          id: 1,
          quantity: 1,
          product: {
            id: 10,
            categoryId: 1,
            productName: "Parfum Test",
            productDescription: "Produk test",
            productPrice: 100000,
            productStock: 5,
          },
        },
      ],
      checkout: jest.fn(),
      fetchPaymentMethods: jest.fn(),
      user: { name: "Budi", email: "budi@test.com" },
      createPaymentMethod: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<CheckoutScreen />);

    expect(getByText("Budi")).toBeTruthy();
    expect(getByText("budi@test.com")).toBeTruthy();
    expect(getByPlaceholderText("Tuliskan nama jalan, nomor rumah, kota, dan kode pos paket...")).toBeTruthy();
    expect(getByText("Transfer Bank BCA")).toBeTruthy();
  });
});
