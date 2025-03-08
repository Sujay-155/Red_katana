// Cart functionality for Red Katana Website

// Calculate cart totals
function calculateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return {
        subtotal,
        tax,
        total
    };
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add event listeners to quantity buttons and remove buttons in the cart
function addCartEventListeners() {
    // Event delegation for cart item interactions
    document.addEventListener('click', function(e) {
        // Increase quantity
        if (e.target.classList.contains('increase')) {
            const itemId = e.target.dataset.id;
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                item.quantity += 1;
                saveCart();
                updateCartDisplay();
            }
        }
        
        // Decrease quantity
        if (e.target.classList.contains('decrease')) {
            const itemId = e.target.dataset.id;
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Remove item if quantity would be 0
                    cart = cart.filter(i => i.id !== itemId);
                }
                saveCart();
                updateCartDisplay();
            }
        }
        
        // Remove item
        if (e.target.classList.contains('cart-item-remove') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('cart-item-remove'))) {
            
            const button = e.target.classList.contains('cart-item-remove') ? 
                e.target : e.target.parentElement;
            
            const itemId = button.dataset.id;
            cart = cart.filter(item => item.id !== itemId);
            saveCart();
            updateCartDisplay();
        }
    });
}

// Update all cart displays (count, modal, etc.)
function updateCartDisplay() {
    // Update cart count in header
    updateCartCount();
    
    // If the cart modal is open, update it
    const modal = document.getElementById('cart-modal');
    if (modal && modal.style.display === 'block') {
        openCartModal();
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage if available
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Update cart count
    updateCartCount();
    
    // Add event listeners
    addCartEventListeners();
});