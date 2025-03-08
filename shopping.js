// shopping.js

// Cart and UI state
let cartItems = [];
let accessories = [];
let categories = [];
let activeTab = 'cart';
let activeCategory = 'all';

// Base API URL - change this to your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// DOM elements
const cartTabButton = document.querySelector('[data-tab="cart"]');
const accessoriesTabButton = document.querySelector('[data-tab="accessories"]');
const cartTab = document.getElementById('cart-tab');
const accessoriesTab = document.getElementById('accessories-tab');
const checkoutTab = document.getElementById('checkout-tab');
const cartCount = document.getElementById('cart-count');
const emptyCart = document.getElementById('empty-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const orderTotal = document.getElementById('order-total');
const accessoriesContainer = document.getElementById('accessories-container');
const categoryFilters = document.getElementById('category-filters');
const browseAccessoriesBtn = document.getElementById('browse-accessories-btn');
const checkoutButton = document.getElementById('checkout-button');
const backToCartButton = document.getElementById('back-to-cart');
const orderSummary = document.getElementById('order-summary');
const completePaymentButton = document.getElementById('complete-payment');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Load cart from localStorage
  loadCart();
  
  // Fetch accessories from the server
  fetchAccessories();
  
  // Set up event listeners
  setupEventListeners();
  
  // Update the UI
  updateCartUI();
});

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('redKatanaCart');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('redKatanaCart', JSON.stringify(cartItems));
}

// Fetch accessories from the server
async function fetchAccessories() {
  try {
    const response = await fetch(`${API_BASE_URL}/accessories`);
    if (!response.ok) {
      throw new Error('Failed to fetch accessories');
    }
    
    accessories = await response.json();
    
    // Extract unique categories for filters
    extractCategories();
    
    // Render category filters
    renderCategoryFilters();
    
    // Render accessories
    renderAccessories();
  } catch (error) {
    console.error('Error fetching accessories:', error);
    
    // If API fails, show error message in accessories container
    accessoriesContainer.innerHTML = `
      <div class="error-message">
        <p>Unable to load accessories. Please try again later.</p>
        <button class="primary-button" onclick="fetchAccessories()">Retry</button>
      </div>
    `;
  }
}

// Extract unique categories from accessories
function extractCategories() {
  const categorySet = new Set();
  
  accessories.forEach(accessory => {
    if (accessory.category) {
      categorySet.add(accessory.category);
    }
  });
  
  categories = Array.from(categorySet);
}

// Render category filters
function renderCategoryFilters() {
  categoryFilters.innerHTML = `
    <button class="category-filter active" data-category="all">All</button>
  `;
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-filter';
    button.setAttribute('data-category', category);
    button.textContent = category;
    
    button.addEventListener('click', () => {
      // Update active category
      activeCategory = category;
      
      // Update active button
      document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Filter accessories
      renderAccessories();
    });
    
    categoryFilters.appendChild(button);
  });
  
  // Add event listener for "All" filter
  const allButton = categoryFilters.querySelector('[data-category="all"]');
  allButton.addEventListener('click', () => {
    // Update active category
    activeCategory = 'all';
    
    // Update active button
    document.querySelectorAll('.category-filter').forEach(btn => {
      btn.classList.remove('active');
    });
    allButton.classList.add('active');
    
    // Render all accessories
    renderAccessories();
  });
}

// Set up event listeners
function setupEventListeners() {
  // Tab navigation
  cartTabButton.addEventListener('click', () => switchTab('cart'));
  accessoriesTabButton.addEventListener('click', () => switchTab('accessories'));
  
  // Buttons
  browseAccessoriesBtn.addEventListener('click', () => switchTab('accessories'));
  checkoutButton.addEventListener('click', proceedToCheckout);
  backToCartButton.addEventListener('click', () => {
    checkoutTab.classList.remove('active');
    cartTab.classList.add('active');
  });
  
  completePaymentButton.addEventListener('click', processPayment);
}

// Switch between tabs
function switchTab(tab) {
  activeTab = tab;
  
  // Update active tab button
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  
  // Update active tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  if (tab === 'cart') {
    cartTab.classList.add('active');
  } else if (tab === 'accessories') {
    accessoriesTab.classList.add('active');
  }
}

// Render accessories in the grid based on active category
function renderAccessories() {
  accessoriesContainer.innerHTML = '';
  
  // Filter accessories by category if needed
  const filteredAccessories = activeCategory === 'all' 
    ? accessories 
    : accessories.filter(accessory => accessory.category === activeCategory);
  
  if (filteredAccessories.length === 0) {
    accessoriesContainer.innerHTML = `
      <div class="empty-result">
        <p>No accessories found in this category.</p>
      </div>
    `;
    return;
  }
  
  filteredAccessories.forEach(accessory => {
    const card = document.createElement('div');
    card.className = 'accessory-card';
    
    const imageSrc = accessory.imageUrl || '/images/accessories/placeholder.jpg';
    const inStock = accessory.inStock !== false; // Default to true if not specified
    
    card.innerHTML = `
      <img src="${imageSrc}" alt="${accessory.name}" class="accessory-image">
      <div class="accessory-details">
        <h3 class="accessory-name">${accessory.name}</h3>
        <p class="accessory-category">${accessory.category}</p>
        <p class="accessory-description">${accessory.description}</p>
        <div class="accessory-actions">
          <span class="accessory-price">$${accessory.price.toFixed(2)}</span>
          <button class="primary-button add-to-cart-btn" data-id="${accessory._id}" ${!inStock ? 'disabled' : ''}>
            ${inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    `;
    
    if (inStock) {
      const addButton = card.querySelector('.add-to-cart-btn');
      addButton.addEventListener('click', () => addToCart(accessory));
    }
    
    accessoriesContainer.appendChild(card);
  });
}

// Add item to cart
function addToCart(item) {
  // Check if item is already in cart
  const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
  
  if (existingItem) {
    // Increase quantity if already in cart
    existingItem.quantity += 1;
  } else {
    // Add new item
    cartItems.push({
      _id: item._id,
      name: item.name,
      price: item.price,
      type: item.type || 'accessory',
      imageUrl: item.imageUrl,
      quantity: 1
    });
  }
  
  // Save and update UI
  saveCart();
  updateCartUI();
  
  // Show notification
  showNotification(`${item.name} added to cart!`);
  
  // Switch to cart tab
  switchTab('cart');
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Update cart quantities
function updateQuantity(itemId, change) {
  cartItems = cartItems.map(item => {
    if (item._id === itemId) {
      const newQuantity = Math.max(1, item.quantity + change);
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  
  saveCart();
  updateCartUI();
}

// Remove item from cart
function removeItem(itemId) {
  const itemToRemove = cartItems.find(item => item._id === itemId);
  if (itemToRemove) {
    showNotification(`${itemToRemove.name} removed from cart`);
  }
  
  cartItems = cartItems.filter(item => item._id !== itemId);
  saveCart();
  updateCartUI();
}

// Calculate total price
function calculateTotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update the cart UI
function updateCartUI() {
  // Update cart count
  cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Show/hide empty cart message
  if (cartItems.length === 0) {
    emptyCart.style.display = 'block';
    cartItemsContainer.style.display = 'none';
    cartSummary.style.display = 'none';
  } else {
    emptyCart.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'flex';
    
    // Render cart items
    renderCartItems();
    
    // Update total
    orderTotal.textContent = `$${calculateTotal().toFixed(2)}`;
  }
}

// Render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  
  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const imageSrc = item.imageUrl || '/images/placeholder.jpg';
    
    cartItem.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-type">${item.type === 'game' ? 'Digital Game' : 'Gaming Accessory'}</p>
      </div>
      <div class="quantity-controls">
        <button class="quantity-button decrease-btn" data-id="${item._id}">-</button>
        <span class="quantity-value">${item.quantity}</span>
        <button class="quantity-button increase-btn" data-id="${item._id}">+</button>
      </div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-button" data-id="${item._id}">×</button>
    `;
    
    // Add event listeners
    const decreaseBtn = cartItem.querySelector('.decrease-btn');
    const increaseBtn = cartItem.querySelector('.increase-btn');
    const removeBtn = cartItem.querySelector('.remove-button');
    
    decreaseBtn.addEventListener('click', () => updateQuantity(item._id, -1));
    increaseBtn.addEventListener('click', () => updateQuantity(item._id, 1));
    removeBtn.addEventListener('click', () => removeItem(item._id));
    
    cartItemsContainer.appendChild(cartItem);
  });
}

// Proceed to checkout
function proceedToCheckout() {
  if (cartItems.length === 0) return;
  
  // Update order summary
  updateOrderSummary();
  
  // Show checkout tab
  cartTab.classList.remove('active');
  checkoutTab.classList.add('active');
}

// Update order summary
function updateOrderSummary() {
  orderSummary.innerHTML = '';
  
  cartItems.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderSummary.appendChild(orderItem);
  });
  
  const totalRow = document.createElement('div');
  totalRow.className = 'order-total-row';
  totalRow.innerHTML = `
    <span>Total</span>
    <span>$${calculateTotal().toFixed(2)}</span>
  `;
  orderSummary.appendChild(totalRow);
}

// Process payment
async function processPayment() {
  if (cartItems.length === 0) return;
  
  // Get form data
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const postalCode = document.getElementById('postalCode').value;
  
  // Validate form (basic validation)
  if (!firstName || !lastName || !email || !address || !city || !postalCode) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create order object
  const order = {
    items: cartItems.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type
    })),
    totalAmount: calculateTotal(),
    customerInfo: {
      firstName,
      lastName,
      email,
      address,
      city,
      postalCode
    }
  };
  
  // Send order to server
  try {
    completePaymentButton.disabled = true;
    completePaymentButton.textContent = 'Processing...';
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    
    if (!response.ok) {
      throw new Error('Failed to process order');
    }
    
    const result = await response.json();
    console.log('Order created:', result);
    
    // Show success message
    alert('Payment successful! Thank you for your order.');
    
    // Clear cart
    cartItems = [];
    saveCart();
    updateCartUI();
    
    // Go back to cart tab (now empty)
    switchTab('cart');
  } catch (error) {
    console.error('Error processing payment:', error);
    alert('There was an error processing your payment. Please try again.');
  } finally {
    completePaymentButton.disabled = false;
    completePaymentButton.textContent = 'Complete Payment';
  }
}

// Event listener for Add to Cart from games page
function addGameToCart(game) {
  addToCart({
    _id: game._id,
    name: game.name,
    price: game.price,
    type: 'game',
    imageUrl: game.imageUrl,
    quantity: 1
  });
}

// Expose function globally so it can be called from other pages
window.addGameToCart = addGameToCart;