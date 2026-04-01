// Shared functions for cart management across all pages
// This file should be included on all pages that need cart functionality

// Global cart functions that work across all pages
window.TechStoreCart = {
    // Get cart from localStorage
    getCart: function() {
        try {
            const saved = localStorage.getItem('techstore_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        try {
            localStorage.setItem('techstore_cart', JSON.stringify(cart));
            this.updateCartCount();
            return true;
        } catch (error) {
            console.error('Error saving cart:', error);
            return false;
        }
    },

    // Get total item count
    getItemCount: function() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Update cart count display on all cart count elements
    updateCartCount: function() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            
            // Add bounce animation when count changes
            element.classList.add('bounce');
            setTimeout(() => {
                element.classList.remove('bounce');
            }, 500);
        });
    },

    // Add product to cart
    addProduct: function(product) {
        let cart = this.getCart();
        const existingItem = cart.find(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.storage === product.storage
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Explicitly include all product properties
            const newItem = {
                id: product.id,
                name: product.name,
                image: product.image || 'https://via.placeholder.com/80x80?text=No+Image',
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                color: product.color || 'Đen',
                storage: product.storage || '128GB',
                warranty: product.warranty || '12 tháng',
                category: product.category || '',
                quantity: 1,
                dateAdded: new Date().toISOString()
            };
            cart.push(newItem);
        }

        this.saveCart(cart);
        return true;
    },

    // Remove product from cart
    removeProduct: function(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return true;
    },

    // Update product quantity
    updateQuantity: function(productId, newQuantity) {
        let cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item && newQuantity >= 1 && newQuantity <= 10) {
            item.quantity = newQuantity;
            this.saveCart(cart);
            return true;
        }
        return false;
    },

    // Clear entire cart
    clearCart: function() {
        localStorage.removeItem('techstore_cart');
        this.updateCartCount();
        return true;
    },

    // Show notification (can be overridden by pages)
    showNotification: function(message, type = 'success') {
        // Basic notification - pages can override this with their own styling
        if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback to alert if no custom notification function
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// Initialize cart count when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    TechStoreCart.updateCartCount();
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'techstore_cart') {
            TechStoreCart.updateCartCount();
        }
    });
});

// Export for backwards compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechStoreCart;
}
