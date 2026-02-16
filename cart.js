const CART_STORAGE_KEY = "swiftcart_cart_items";

const getCartItems = () => {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Invalid cart data in localStorage:", error);
    return [];
  }
};

const saveCartItems = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const updateCartCountBadge = () => {
  const count = getCartItems().length;
  const badges = document.querySelectorAll("[data-cart-count]");

  badges.forEach((badge) => {
    badge.textContent = count;
  });
};

const addProductToCart = (productId) => {
  const items = getCartItems();
  items.push(productId);
  saveCartItems(items);
  updateCartCountBadge();
};

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (!addButton) {
    return;
  }

  const productId = addButton.dataset.productId || "unknown";
  addProductToCart(productId);
});

updateCartCountBadge();
