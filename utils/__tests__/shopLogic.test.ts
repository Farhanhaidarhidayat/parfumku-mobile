import {
  clampQuantityToStock,
  getCartQuantityForProduct,
  getProductImages,
  getRemainingStockForProduct,
} from "../shopLogic";

describe("shopLogic", () => {
  it("membatasi jumlah pembelian berdasarkan stok setelah isi keranjang", () => {
    const product = { id: 1, productStock: 6 };
    const cart = [
      { quantity: 4, product },
      { quantity: 1, product: { id: 2, productStock: 8 } },
    ];

    expect(getCartQuantityForProduct(cart, 1)).toBe(4);
    expect(getRemainingStockForProduct(product, cart)).toBe(2);
    expect(clampQuantityToStock(5, 2)).toBe(2);
  });

  it("menghasilkan daftar foto produk unik untuk galeri", () => {
    expect(
      getProductImages({
        id: 1,
        productStock: 6,
        productImage: "foto-1.jpg",
        productImages: ["foto-1.jpg", "foto-2.jpg"],
        images: ["foto-3.jpg"],
      }),
    ).toEqual(["foto-1.jpg", "foto-2.jpg", "foto-3.jpg"]);
  });
});
