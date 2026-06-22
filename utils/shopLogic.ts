export interface StockProductLike {
  id: number;
  productStock: number;
  productImage?: string;
  productImages?: string[];
  images?: string[];
}

export interface CartItemLike {
  quantity: number;
  product?: StockProductLike;
}

export function getProductImages(product: StockProductLike): string[] {
  const images = [
    ...(Array.isArray(product.productImages) ? product.productImages : []),
    ...(Array.isArray(product.images) ? product.images : []),
    product.productImage,
  ].filter((image): image is string => Boolean(image));

  return Array.from(new Set(images));
}

export function getCartQuantityForProduct(
  cart: CartItemLike[],
  productId: number,
): number {
  return cart
    .filter((item) => item.product?.id === productId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

export function getRemainingStockForProduct(
  product: StockProductLike,
  cart: CartItemLike[],
): number {
  return Math.max(
    0,
    product.productStock - getCartQuantityForProduct(cart, product.id),
  );
}

export function clampQuantityToStock(
  requestedQuantity: number,
  availableStock: number,
): number {
  if (availableStock <= 0) return 0;
  if (requestedQuantity <= 0) return 1;
  return Math.min(requestedQuantity, availableStock);
}
