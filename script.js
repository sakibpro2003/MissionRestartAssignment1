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
            <button class="btn btn-outline btn-primary btn-sm flex-1">
              <i class="fa-regular fa-eye"></i>
              Details
            </button>
            <button class="btn btn-primary btn-sm flex-1">
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

fetchTrendingProducts();
