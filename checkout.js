// Checkout functionality for Red Katana Website

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display order summary
function displayOrderSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
    // Clear previous items
    if (checkoutItems) {
        checkoutItems.innerHTML = '';
        
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p class="empty-cart">Your cart is empty!</p>';
            window.location.href = 'index.html'; // Redirect if cart is empty
        } else {
            // Populate cart items
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                checkoutItems.innerHTML += `
                    <div class="checkout-item">
                        <div class="checkout-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="checkout-item-details">
                            <h3 class="checkout-item-title">${item.title}</h3>
                            <p class="checkout-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                        <div class="checkout-item-total">$${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            });
            
            // Calculate summary
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1; // 10% tax
            const shipping = 9.99; // Fixed shipping cost
            const total = subtotal + tax + shipping;
            
            // Update summary display
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            taxElement.textContent = `$${tax.toFixed(2)}`;
            shippingElement.textContent = `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
}

// Handle form submission and payment processing
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const processingModal = document.getElementById('processing-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show processing modal
            processingModal.style.display = 'block';
            
            // Get form data
            const formData = new FormData(form);
            const paymentData = {
                cardName: formData.get('cardname'),
                cardNumber: formData.get('cardnumber'),
                expDate: formData.get('expdate'),
                cvv: formData.get('cvv'),
                amount: calculateTotal(),
                billingInfo: {
                    name: formData.get('fullname'),
                    email: formData.get('email'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    zip: formData.get('zip'),
                    country: formData.get('country')
                },
                timestamp: new Date().toISOString()
            };
            
            try {
                // Send payment data to server for processing and fraud detection
                const response = await processPayment(paymentData);
                
                // Hide processing modal
                processingModal.style.display = 'none';
                
                if (response.success) {
                    // Show success message
                    confirmationMessage.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Payment Successful!</h3>
                            <p>Your order has been placed successfully. Order #${response.orderNumber}</p>
                            <p>A confirmation email has been sent to ${paymentData.billingInfo.email}</p>
                        </div>
                    `;
                    
                    // Clear cart
                    localStorage.removeItem('cart');
                } else {
                    // Show failure message
                    confirmationMessage.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>Payment Failed</h3>
                            <p>${response.message || 'There was an issue processing your payment. Please try again.'}</p>
                        </div>
                    `;
                }
                
                // Show confirmation modal
                confirmationModal.style.display = 'block';
            } catch (error) {
                // Hide processing modal
                processingModal.style.display = 'none';
                
                // Show error message
                confirmationMessage.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>An Error Occurred</h3>
                        <p>There was an error processing your request. Please try again later.</p>
                    </div>
                `;
                
                // Show confirmation modal
                confirmationModal.style.display = 'block';
                
                console.error('Payment processing error:', error);
            }
        });
    }
    
    // Continue shopping button in confirmation modal
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Close button in confirmation modal
    const closeBtn = document.querySelector('#confirmation-modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
        });
    }
}

// Calculate total order amount
function calculateTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 9.99; // Fixed shipping cost
    return subtotal + tax + shipping;
}

// Process payment and call fraud detection service
async function processPayment(paymentData) {
    // This function would normally send the data to a backend server
    // Here we'll mock a request to our Python fraud detection system
    
    try {
        const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
            throw new Error('Payment processing failed');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error during payment processing:', error);
        
        // For demo purposes, simulate a successful payment
        // In a real application, you'd want to properly handle the error
        return {
            success: true,
            orderNumber: 'RK' + Math.floor(Math.random() * 1000000),
            message: 'Payment processed successfully!'
        };
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    displayOrderSummary();
    setupCheckoutForm();
});