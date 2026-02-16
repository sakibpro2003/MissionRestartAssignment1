const productDetailsContainer = document.getElementById("productDetails");
const detailsLoader = document.getElementById("detailsLoader");
const detailsError = document.getElementById("detailsError");

const renderProductDetails = (product) => {
  productDetailsContainer.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 grid gap-8 md:grid-cols-2">
      <figure class="bg-slate-100 rounded-xl p-6 flex items-center justify-center">
        <img src="${product.image}" alt="${product.title}" class="max-h-96 object-contain" />
      </figure>

      <div>
        <div class="badge badge-outline badge-info mb-3">${product.category}</div>
        <h1 class="text-2xl md:text-3xl font-bold">${product.title}</h1>
        <div class="mt-4 flex items-center gap-4 text-sm">
          <span class="text-xl font-bold text-primary">$${product.price}</span>
          <span><i class="fa-solid fa-star text-amber-500"></i> ${
            product.rating?.rate ?? "N/A"
          } (${product.rating?.count ?? 0})</span>
        </div>
        <p class="mt-5 text-slate-600 leading-7">${product.description}</p>

        <div class="mt-6">
          <button
            class="btn btn-primary"
            data-add-to-cart
            data-product-id="${product.id}"
          >
            <i class="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
};

const loadProductDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    detailsError.textContent = "Product id is missing.";
    detailsError.classList.remove("hidden");
    detailsLoader.classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const product = await response.json();
    if (!product || !product.id) {
      throw new Error("Product not found");
    }
    document.title = `SwiftCart | ${product.title}`;
    renderProductDetails(product);
  } catch (error) {
    console.error("Failed to load product details:", error);
    detailsError.textContent = "Failed to load product details.";
    detailsError.classList.remove("hidden");
  } finally {
    detailsLoader.classList.add("hidden");
  }
};

loadProductDetails();
