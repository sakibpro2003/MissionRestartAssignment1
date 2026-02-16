const allProductsGrid = document.getElementById("allProductsGrid");
const productsLoader = document.getElementById("productsLoader");
const productsError = document.getElementById("productsError");
const categoryFilters = document.getElementById("categoryFilters");

const categoryOrder = [
  "all",
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

let activeCategory = "all";
let availableCategories = [];

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

const formatCategoryLabel = (category) => {
  if (category === "all") {
    return "All";
  }
  if (category === "electronics") {
    return "Electronics";
  }
  if (category === "jewelery") {
    return "Jewelery";
  }
  if (category === "men's clothing") {
    return "Men's Clothing";
  }
  if (category === "women's clothing") {
    return "Women's Clothing";
  }
  return category;
};

const createProductCard = (product) => {
  const rating = product.rating?.rate ?? "N/A";
  const count = product.rating?.count ?? 0;

  return `
    <div class="card bg-white shadow-sm">
      <figure class="h-52 p-4 bg-slate-100">
        <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
      </figure>
      <div class="card-body p-5">
        <div class="flex justify-between items-center text-sm">
          <span class="badge badge-outline badge-info">${product.category}</span>
          <span><i class="fa-solid fa-star text-amber-500"></i> ${rating} (${count})</span>
        </div>
        <h2 class="card-title text-base">${truncateText(product.title, 50)}</h2>
        <p class="text-slate-600 text-sm">${truncateText(product.description, 75)}</p>
        <div class="mt-1 text-xl font-bold text-primary">$${product.price}</div>
        <div class="card-actions mt-2">
          <div class="flex gap-2 w-full">
            <button class="btn btn-outline btn-primary btn-sm flex-1">Details</button>
            <button class="btn btn-primary btn-sm flex-1">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderCategoryFilters = () => {
  const categoriesToShow = categoryOrder.filter(
    (category) => category === "all" || availableCategories.includes(category)
  );

  const finalCategories =
    categoriesToShow.length > 1 ? categoriesToShow : categoryOrder;

  categoryFilters.innerHTML = finalCategories
    .map(
      (category) => `
      <button
        data-category="${category}"
        class="btn btn-sm ${activeCategory === category ? "btn-primary" : "btn-outline"}"
      >
        ${formatCategoryLabel(category)}
      </button>
    `
    )
    .join("");
};

const loadCategories = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
};

const loadProducts = async (category = "all") => {
  try {
    productsError.classList.add("hidden");
    productsLoader.classList.remove("hidden");
    allProductsGrid.innerHTML = "";

    const endpoint =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const products = await response.json();
    allProductsGrid.innerHTML = products.map(createProductCard).join("");
  } catch (error) {
    console.error("Failed to load products:", error);
    productsError.classList.remove("hidden");
  } finally {
    productsLoader.classList.add("hidden");
  }
};

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) {
    return;
  }

  const selectedCategory = button.dataset.category;
  if (selectedCategory === activeCategory) {
    return;
  }

  activeCategory = selectedCategory;
  renderCategoryFilters();
  loadProducts(activeCategory);
});

const initProductsPage = async () => {
  availableCategories = await loadCategories();
  renderCategoryFilters();
  await loadProducts(activeCategory);
};

initProductsPage();
