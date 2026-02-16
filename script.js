const trendingContainer = document.getElementById("trending");
const productDetailsModal = document.getElementById("productDetailsModal");
const productDetailsModalContent = document.getElementById(
  "productDetailsModalContent"
);

const showModalLoadingState = () => {
  productDetailsModalContent.innerHTML = `
    <div class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  `;
};

const renderModalDetails = (product) => {
  const rating = product.rating?.rate ?? "N/A";
  const count = product.rating?.count ?? 0;

  productDetailsModalContent.innerHTML = `
    <div class="grid gap-6 md:grid-cols-2">
      <figure class="bg-slate-100 rounded-xl p-6 flex items-center justify-center">
        <img src="${product.image}" alt="${product.title}" class="max-h-80 object-contain" />
      </figure>
      <div>
        <div class="badge badge-outline badge-info mb-3">${product.category}</div>
        <h3 class="text-2xl font-bold">${product.title}</h3>
        <p class="mt-4 text-slate-600 leading-7">${product.description}</p>
        <div class="mt-4 flex items-center gap-4">
          <p class="text-2xl font-bold text-primary">$${product.price}</p>
          <p><i class="fa-solid fa-star text-amber-500"></i> ${rating} (${count})</p>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            class="btn btn-primary"
            data-add-to-cart
            data-product-id="${product.id}"
          >
            <i class="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>
          <button class="btn btn-outline">Buy Now</button>
        </div>
      </div>
    </div>
  `;
};

const openProductDetailsModal = async (productId) => {
  if (!productDetailsModal || !productDetailsModalContent) {
    return;
  }

  showModalLoadingState();

  if (typeof productDetailsModal.showModal === "function") {
    productDetailsModal.showModal();
  } else {
    productDetailsModal.setAttribute("open", "true");
  }

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const product = await response.json();
    renderModalDetails(product);
  } catch (error) {
    console.error("Failed to load product details:", error);
    productDetailsModalContent.innerHTML =
      '<p class="text-red-500 text-center py-8">Failed to load product details.</p>';
  }
};

const createTrendingCard = (product) => {
  const rating = product.rating?.rate ?? "N/A";
  const count = product.rating?.count ?? 0;
  const shortDescription =
    product.description.length > 90
      ? `${product.description.slice(0, 90)}...`
      : product.description;

  return `
    <div class="card bg-base-100 shadow-sm">
      <figure class="h-56 p-4 bg-slate-200 ">
        <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
      </figure>
      <div class="flex justify-between px-6 pt-4 text-sm">
        <div class="badge  badge-outline badge-info">${product.category}</div>
        <p class="content-center"><i class="fa-solid fa-star"></i> ${rating} (${count})</p>
      </div>
      <div class="card-body">
        <h2 class="card-title">${product.title}</h2>
        <p>${shortDescription}</p>
        <p class="font-bold text-xl">$${product.price}</p>
        <div class="card-actions flex justify-between items-center">
          <div class="flex gap-2 w-full">
            <button
              class="btn btn-outline btn-primary btn-sm flex-1"
              data-view-details
              data-product-id="${product.id}"
            >
              <i class="fa-regular fa-eye"></i>
              Details
            </button>
            <button
              class="btn btn-primary btn-sm flex-1"
              data-add-to-cart
              data-product-id="${product.id}"
            >
              <i class="fa-solid fa-cart-shopping"></i>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const fetchTrendingProducts = async () => {
  try {
    trendingContainer.innerHTML =
      '<p class="text-gray-500">Loading trending products...</p>';

    const res = await fetch("https://fakestoreapi.com/products?limit=3");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const products = await res.json();
    trendingContainer.innerHTML = products.map(createTrendingCard).join("");
  } catch (error) {
    console.error("Failed to fetch products:", error);
    trendingContainer.innerHTML =
      '<p class="text-red-500">Failed to load trending products.</p>';
  }
};

trendingContainer.addEventListener("click", (event) => {
  const detailsButton = event.target.closest("[data-view-details]");
  if (!detailsButton) {
    return;
  }

  openProductDetailsModal(detailsButton.dataset.productId);
});

fetchTrendingProducts();
