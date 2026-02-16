const trendingContainer = document.getElementById("trending");

const createTrendingCard = (product) => {
  const rating = product.rating?.rate ?? "N/A";
  const count = product.rating?.count ?? 0;
  const shortDescription =
    product.description.length > 90
      ? `${product.description.slice(0, 90)}...`
      : product.description;

  return `
    <div class="card bg-base-100 shadow-sm">
      <figure class="h-56 bg-white p-4">
        <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
      </figure>
      <div class="flex justify-between px-6 pt-4 text-sm">
        <div class="badge badge-outline badge-info">${product.category}</div>
        <p class="content-center"><i class="fa-solid fa-star"></i> ${rating} (${count})</p>
      </div>
      <div class="card-body">
        <h2 class="card-title">${product.title}</h2>
        <p>${shortDescription}</p>
        <div class="card-actions flex justify-between items-center">
          <p class="font-bold text-primary">$${product.price}</p>
          <button class="btn btn-primary">
            <i class="fa-solid fa-cart-shopping"></i>
            Add
          </button>
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

fetchTrendingProducts();
