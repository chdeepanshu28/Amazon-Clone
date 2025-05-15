const products = [
    { id: "p1", title: "Echo Dot (4th Gen) | Smart speaker with Alexa", price: 49.99, img: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg" },
    { id: "p2", title: "Fire TV Stick 4K streaming device with Alexa Voice Remote", price: 39.99, img: "https://m.media-amazon.com/images/I/51CgKGfMelL._AC_SL1000_.jpg" },
    { id: "p3", title: "Apple AirPods with Charging Case", price: 119.00, img: "https://m.media-amazon.com/images/I/71NTi82uBEL._AC_SL1500_.jpg" },
    { id: "p4", title: "Samsung 65-inch Class QLED Q80A Series 4K Smart TV", price: 999.99, img: "https://m.media-amazon.com/images/I/91GlUEqXi7L._AC_SL1500_.jpg" },
    { id: "p5", title: "Kindle Paperwhite – Now Waterproof with 2x the Storage", price: 139.99, img: "https://m.media-amazon.com/images/I/61OGUaKjg5L._AC_SL1000_.jpg" },
    { id: "p6", title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker", price: 89.99, img: "https://m.media-amazon.com/images/I/71o3DWyGYSL._AC_SL1500_.jpg" },
    { id: "p7", title: "Bose QuietComfort 35 Wireless Headphones", price: 299.00, img: "https://m.media-amazon.com/images/I/81+jNVOUsJL._AC_SL1500_.jpg" },
    { id: "p8", title: "ASUS Laptop 15.6-inch Full HD", price: 599.99, img: "https://m.media-amazon.com/images/I/81NJf3LasFL._AC_SL1500_.jpg" },
    { id: "p9", title: "Logitech MX Master 3 Advanced Wireless Mouse", price: 99.99, img: "https://m.media-amazon.com/images/I/710QSnYS-1L._AC_SL1500_.jpg" },
    { id: "p10", title: "Samsung Galaxy S21 5G Smartphone", price: 799.99, img: "https://m.media-amazon.com/images/I/91BG03fSKSL._AC_SL1500_.jpg" },
    { id: "p11", title: "Sony WH-1000XM4 Wireless Noise Canceling Headphones", price: 348.00, img: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg" },
    { id: "p12", title: "Nintendo Switch with Neon Blue and Neon Red Joy‑Con", price: 299.99, img: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg" }
  ];
  const productGrid = document.getElementById("product-grid");
  const cartCountElem = document.getElementById("cart-count");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartBtn = document.getElementById("cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalElem = document.getElementById("cart-total");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  
  let cart = {};
  function renderProducts(list) {
    productGrid.innerHTML = "";
    list.forEach(product => {
      const prodElem = document.createElement("article");
      prodElem.className = "product";
      prodElem.setAttribute("tabindex", "0");
      prodElem.innerHTML = `
        <img src="${product.img}" alt="${product.title}" loading="lazy" />
        <div class="product-title" title="${product.title}">${product.title}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="btn-add-cart" aria-label="Add ${product.title} to cart" data-id="${product.id}">Add to Cart</button>
      `;
      productGrid.appendChild(prodElem);
    });
  }
  function updateCartCount() {
    const totalCount = Object.values(cart).reduce((acc, val) => acc + val, 0);
    if (totalCount > 0) {
      cartCountElem.style.display = "inline-block";
      cartCountElem.textContent = totalCount;
      cartBtn.setAttribute('aria-expanded', 'true');
    } else {
      cartCountElem.style.display = "none";
      cartBtn.setAttribute('aria-expanded', 'false');
    }
  }
  function addToCart(productId) {
    if (cart[productId]) { cart[productId]++; } else { cart[productId] = 1; }
    updateCartCount();
    renderCartItems();
  }
  function removeFromCart(productId) {
    if (cart[productId]) {
      delete cart[productId];
      updateCartCount();
      renderCartItems();
    }
  }
  function changeQty(productId, delta) {
    if (cart[productId]) {
      const newQty = cart[productId] + delta;
      if (newQty <= 0) removeFromCart(productId);
      else cart[productId] = newQty;
      updateCartCount();
      renderCartItems();
    }
  }
  function formatPrice(value) { return "$" + value.toFixed(2); }
  function calculateTotal() {
    let total = 0;
    for (const pid in cart) {
      const product = products.find(p => p.id === pid);
      if (product) total += product.price * cart[pid];
    }
    return total;
  }
  function renderCartItems() {
    cartItemsContainer.innerHTML = "";
    const total = calculateTotal();
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = `<div class="cart-empty-msg" tabindex="0">Your cart is empty.</div>`;
      cartTotalElem.textContent = `Total: $0.00`;
      return;
    }
    for (const pid in cart) {
      const product = products.find(p => p.id === pid);
      if (!product) continue;
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${product.img}" alt="${product.title}" />
        <div class="item-details">
          <div class="item-title">${product.title}</div>
          <div class="item-qty">Quantity: ${cart[pid]}</div>
          <div class="qty-controls" aria-label="Change quantity for ${product.title}">
            <button class="qty-btn" aria-label="Decrease quantity" data-action="decrease" data-id="${pid}">−</button>
            <button class="qty-btn" aria-label="Increase quantity" data-action="increase" data-id="${pid}">+</button>
            <button class="qty-btn" aria-label="Remove item" data-action="remove" data-id="${pid}">×</button>
          </div>
          <div class="item-price">${formatPrice(product.price * cart[pid])}</div>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    }
    cartTotalElem.textContent = `Total: ${formatPrice(total)}`;
  }
  function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    cartSidebar.focus();
  }
  function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    cartBtn.focus();
  }
  function searchProducts(term) {
    const lowerTerm = term.trim().toLowerCase();
    if (lowerTerm === "") {
      renderProducts(products);
      return;
    }
    const filtered = products.filter(p => p.title.toLowerCase().includes(lowerTerm));
    renderProducts(filtered);
  }
  renderProducts(products);
  updateCartCount();
  productGrid.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add-cart")) {
      addToCart(e.target.getAttribute("data-id"));
    }
  });
  cartBtn.addEventListener("click", () => { openCart(); });
  cartCloseBtn.addEventListener("click", () => { closeCart(); });
  cartOverlay.addEventListener("click", () => { closeCart(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && cartSidebar.classList.contains("active")) closeCart();
  });
  cartItemsContainer.addEventListener("click", e => {
    const btn = e.target;
    if (!btn.classList.contains("qty-btn")) return;
    const action = btn.getAttribute("data-action");
    const pid = btn.getAttribute("data-id");
    if (action === "increase") changeQty(pid, 1);
    else if (action === "decrease") changeQty(pid, -1);
    else if (action === "remove") removeFromCart(pid);
  });
  searchButton.addEventListener("click", () => { searchProducts(searchInput.value); });
  searchInput.addEventListener("keydown", e => { if(e.key === "Enter") searchProducts(searchInput.value); });
