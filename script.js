const productContainer = document.getElementById("product");
const loadButton = document.getElementById("loadProductsBtn");

const fetchProducts = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    productContainer.innerHTML = "";

    products.forEach((product) => {
      const div = document.createElement("div");
      div.className = "bg-red-100 p-3 rounded";
      div.innerHTML = `<h2 class="font-semibold">${product.title}</h2>`;
      productContainer.appendChild(div);
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productContainer.textContent = "Failed to load products.";
    return [];
  }
};

loadButton.addEventListener("click", fetchProducts);
