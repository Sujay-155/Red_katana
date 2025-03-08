// Main JavaScript file for Red Katana Shopping Website

// Product data (would normally be fetched from a backend API)
const products = {
    'gaming-chairs': [
        {
            id: 'gc1',
            title: 'Red Katana Ergonomic Gaming Chair',
            price: 299.99,
            rating: 4.5,
            image: 'images/chair-1.jpg',
            category: 'gaming-chairs',
            description: 'Premium ergonomic gaming chair with adjustable lumbar support and 4D armrests.'
        },
        {
            id: 'gc2',
            title: 'Pro XL Racing Gaming Chair',
            price: 349.99,
            rating: 4.8,
            image: 'images/chair-2.jpg',
            category: 'gaming-chairs',
            description: 'Professional-grade racing style gaming chair with extended recline and neck pillow.'
        },
        {
            id: 'gc3',
            title: 'Comfort Plus Gaming Recliner',
            price: 399.99,
            rating: 4.7,
            image: 'images/chair-3.jpg',
            category: 'gaming-chairs',
            description: 'Luxurious gaming recliner with built-in speakers and massage function.'
        },
        {
            id: 'gc4',
            title: 'Budget Gaming Chair',
            price: 159.99,
            rating: 4.0,
            image: 'images/chair-4.jpg',
            category: 'gaming-chairs',
            description: 'Affordable gaming chair with essential features for casual gamers.'
        }
    ],
    'accessories': [
        {
            id: 'ac1',
            title: 'Red Katana RGB Headset Stand',
            price: 49.99,
            rating: 4.3,
            image: 'images/accessory-1.jpg',
            category: 'accessories',
            description: 'Stylish RGB headset stand with integrated USB hub.'
        },
        {
            id: 'ac2',
            title: 'Gaming Keyboard and Mouse Combo',
            price: 129.99,
            rating: 4.6,
            image: 'images/accessory-2.jpg',
            category: 'accessories',
            description: 'Mechanical keyboard with RGB lighting and precise gaming mouse bundle.'
        },
        {
            id: 'ac3',
            title: 'Pro Gaming Headset',
            price: 89.99,
            rating: 4.4,
            image: 'images/accessory-3.jpg',
            category: 'accessories',
            description: '7.1 surround sound headset with noise-cancelling microphone.'
        },
        {
            id: 'ac4',
            title: 'XL RGB Mousepad',
            price: 29.99,
            rating: 4.5,
            image: 'images/accessory-4.jpg',
            category: 'accessories',
            description: 'Extra-large RGB mousepad with 10 lighting modes.'
        }
    ],
    'gaming-mouse': [
        {
            id: 'gm1',
            title: 'Red Katana Pro Gaming Mouse',
            price: 79.99,
            rating: 4.9,
            image: 'images/mouse-1.jpg',
            category: 'gaming-mouse',
            description: 'High-precision gaming mouse with 16K DPI optical sensor and programmable buttons.'
        },
        {
            id: 'gm2',
            title: 'Lightweight Gaming Mouse',
            price: 59.99,
            rating: 4.7,
            image: 'images/mouse-2.jpg',
            category: 'gaming-mouse',
            description: 'Ultra-lightweight honeycomb design mouse for fast-paced gaming.'
        },
        {
            id: 'gm3',
            title: 'Premium RGB Mouse Pad',
            price: 39.99,
            rating: 4.5,
            image: 'images/mouse-3.jpg',
            category: 'gaming-mouse',
            description: 'Smooth-surface RGB mouse pad with USB passthrough.'
        },
        {
            id: 'gm4',
            title: 'Wireless Gaming Mouse',
            price: 89.99,
            rating: 4.6,
            image: 'images/mouse-4.jpg',
            category: 'gaming-mouse',
            description: 'Low-latency wireless gaming mouse with 60-hour battery life.'
        }
    ],
    'games': [
        {
            id: 'g1',
            title: 'Cyber Warfare 2077',
            price: 59.99,
            rating: 4.8,
            image: 'images/game-1.jpg',
            category: 'games',
            description: 'Open-world futuristic RPG with stunning graphics and immersive gameplay.'
        },
        {
            id: 'g2',
            title: 'Legends of the Realm',
            price: 49.99,
            rating: 4.7,
            image: 'images/game-2.jpg',
            category: 'games',
            description: 'Fantasy MMORPG with epic quests and legendary loot.'
        },
        {
            id: 'g3',
            title: 'Velocity Racing Extreme',
            price: 39.99,
            rating: 4.5,
            image: 'images/game-3.jpg',
            category: 'games',
            description: 'High-octane racing simulator with realistic physics and stunning tracks.'
        },
        {
            id: 'g4',
            title: 'Battle Royale Legends',
            price: 29.99,
            rating: 4.6,
            image: 'images/game-4.jpg',
            category: 'games',
            description: 'Last-man-standing multiplayer battle royale game with unique character abilities.'
        }
    ]
};

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Create star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">${getStarRating(product.rating)} (${product.rating})</div>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Load products into respective sections
function loadProducts() {
    // Load featured products (one from each category)
    const featuredGrid = document.querySelector('.featured .product-grid');
    if (featuredGrid) {
        let featuredHTML = '';
        Object.keys(products).forEach(category => {
            // Get the highest rated product from each category
            const topProduct = [...products[category]].sort((a, b) => b.rating - a.rating)[0];
            featuredHTML += createProductCard(topProduct);
        });
        featuredGrid.innerHTML = featuredHTML;
    }
    
    // Load products by category
    Object.keys(products).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) {
            let productsHTML = '';
            products[category].forEach(product => {
                productsHTML += createProductCard(product);
            });
            grid.innerHTML = productsHTML;
        }
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(event) {
    const productId = event.target.dataset.id;
    let productToAdd;
    
    // Find the product in our data
    for (const category in products) {
        const product = products[category].find(p => p.id === productId);
        if (product) {
            productToAdd = { ...product };
            break;
        }
    }
    
    if (productToAdd) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            productToAdd.quantity = 1;
            cart.push(productToAdd);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count and show success message
        updateCartCount();
        showNotification(`${productToAdd.title} added to cart!`);
    }
}

// Show notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Category navigation
document.addEventListener('DOMContentLoaded', function() {
    // Load products when the page is ready
    loadProducts();
    
    // Update cart count
    updateCartCount();
    
    // Category dropdown links
    const categoryLinks = document.querySelectorAll('.dropdown-content a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            const section = document.getElementById(category);
            
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cart button click event
    document.getElementById('cart-button').addEventListener('click', function(e) {
        e.preventDefault();
        openCartModal();
    });
    
    // Close modal when clicking the X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Continue shopping button
    document.getElementById('continue-shopping').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'none';
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        window.location.href = 'checkout.html';
    });
});

// Open cart modal and populate it
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    // Clear previous items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        // If cart is empty
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Start shopping now!</p>';
        subtotalElement.textContent = '$0.00';
        taxElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
    } else {
        // Populate cart with items
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartItems.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <span class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </span>
                </div>
            `;
        });
        
        // Calculate summary
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to the cart item buttons
        cartItems.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        cartItems.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', removeCartItem);
        });
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Functions to manipulate cart items
function increaseQuantity(e) {
    const itemId = e.target.dataset.id;
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        openCartModal(); // Refresh the cart modal
        updateCartCount();
    }
}

function decreaseQuantity(e) {
    const itemId = e.target.dataset.id;
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            // Remove if quantity becomes 0
            removeFromCart(itemId);
        }
        openCartModal(); // Refresh the cart modal
        updateCartCount();
    }
}

function removeCartItem(e) {
    const itemId = e.target.closest('.cart-item-remove').dataset.id;
    removeFromCart(itemId);
    openCartModal(); // Refresh the cart modal
    updateCartCount();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
}