// Cart Management System for TechStore
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.deliveryFee = 50000;
        this.promoCodes = {
            'WELCOME10': { 
                discount: 10, 
                type: 'percent', 
                description: 'Giảm 10% cho khách hàng mới',
                minOrder: 0
            },
            'SAVE500K': { 
                discount: 500000, 
                type: 'fixed', 
                description: 'Giảm 500.000đ cho đơn hàng từ 20 triệu',
                minOrder: 20000000
            },
            'FREESHIP': { 
                discount: 50000, 
                type: 'fixed', 
                description: 'Miễn phí vận chuyển',
                minOrder: 0
            },
            'TECH2025': {
                discount: 15,
                type: 'percent',
                description: 'Giảm 15% mừng năm mới 2025',
                minOrder: 5000000
            }
        };
        this.currentPromo = null;
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem('techstore_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
            this.updateCartCount();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.cart.find(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.storage === product.storage
        );

        if (existingItem) {
            this.updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
            const cartItem = {
                id: product.id || Date.now(),
                name: product.name,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                quantity: 1,
                color: product.color || 'Đen',
                storage: product.storage || '128GB',
                warranty: product.warranty || '12 tháng',
                dateAdded: new Date().toISOString()
            };
            
            this.cart.push(cartItem);
        }
        
        this.saveCart();
        this.showNotification(`Đã thêm ${product.name} vào giỏ hàng`);
        return true;
    }

    // Remove item from cart
    removeItem(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const removedItem = this.cart.splice(itemIndex, 1)[0];
            this.saveCart();
            this.showNotification(`Đã xóa ${removedItem.name} khỏi giỏ hàng`);
            return true;
        }
        return false;
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item && newQuantity >= 1 && newQuantity <= 10) {
            item.quantity = newQuantity;
            this.saveCart();
            return true;
        }
        return false;
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.currentPromo = null;
        this.saveCart();
        this.showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    }

    // Get cart items
    getItems() {
        return this.cart;
    }

    // Get cart count
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Calculate subtotal
    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Calculate discount
    getDiscount() {
        if (!this.currentPromo) return 0;
        
        const subtotal = this.getSubtotal();
        
        if (this.currentPromo.type === 'percent') {
            return subtotal * (this.currentPromo.discount / 100);
        } else {
            return this.currentPromo.discount;
        }
    }

    // Calculate total
    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.getDiscount();
        return subtotal - discount + this.deliveryFee;
    }

    // Apply promo code
    applyPromoCode(code) {
        const upperCode = code.toUpperCase();
        const promo = this.promoCodes[upperCode];
        
        if (!promo) {
            return { success: false, message: 'Mã giảm giá không hợp lệ' };
        }
        
        const subtotal = this.getSubtotal();
        if (subtotal < promo.minOrder) {
            return { 
                success: false, 
                message: `Mã này yêu cầu đơn hàng tối thiểu ${this.formatCurrency(promo.minOrder)}` 
            };
        }
        
        this.currentPromo = promo;
        return { 
            success: true, 
            message: promo.description,
            discount: this.getDiscount()
        };
    }

    // Remove promo code
    removePromoCode() {
        this.currentPromo = null;
    }

    // Update delivery fee
    setDeliveryFee(fee) {
        this.deliveryFee = fee;
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Update cart count in UI
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            
            // Add animation when count changes
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        const contentStyle = `
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        `;
        notification.querySelector('.notification-content').style.cssText = contentStyle;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export cart data
    exportCart() {
        return {
            items: this.cart,
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            discount: this.getDiscount(),
            deliveryFee: this.deliveryFee,
            total: this.getTotal(),
            promoCode: this.currentPromo,
            exportDate: new Date().toISOString()
        };
    }

    // Import cart data
    importCart(cartData) {
        try {
            this.cart = cartData.items || [];
            this.deliveryFee = cartData.deliveryFee || 50000;
            this.currentPromo = cartData.promoCode || null;
            this.saveCart();
            return true;
        } catch (error) {
            console.error('Error importing cart:', error);
            return false;
        }
    }

    // Get recommended products based on cart
    getRecommendedProducts() {
        const categories = [...new Set(this.cart.map(item => this.getProductCategory(item.name)))];
        
        // This would typically call an API
        return [
            {
                id: 101,
                name: "Ốp lưng iPhone 14 Pro Max",
                price: 299000,
                image: "accessory1.jpg",
                category: "Phụ kiện"
            },
            {
                id: 102,
                name: "Tai nghe AirPods Pro 2",
                price: 6990000,
                image: "airpods.jpg",
                category: "Âm thanh"
            }
        ];
    }

    // Get product category (helper function)
    getProductCategory(productName) {
        if (productName.includes('iPhone')) return 'iPhone';
        if (productName.includes('Samsung')) return 'Samsung';
        if (productName.includes('Xiaomi')) return 'Xiaomi';
        return 'Điện thoại';
    }

    // Validate cart before checkout
    validateCart() {
        const errors = [];
        
        if (this.cart.length === 0) {
            errors.push('Giỏ hàng trống');
        }
        
        this.cart.forEach(item => {
            if (item.quantity < 1 || item.quantity > 10) {
                errors.push(`Số lượng ${item.name} không hợp lệ`);
            }
            if (!item.price || item.price < 0) {
                errors.push(`Giá ${item.name} không hợp lệ`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get cart statistics
    getCartStats() {
        const stats = {
            totalItems: this.getItemCount(),
            uniqueItems: this.cart.length,
            totalValue: this.getSubtotal(),
            averageItemPrice: this.cart.length > 0 ? this.getSubtotal() / this.getItemCount() : 0,
            savings: this.cart.reduce((sum, item) => {
                return sum + ((item.originalPrice - item.price) * item.quantity);
            }, 0) + this.getDiscount()
        };
        
        return stats;
    }
}

// Global cart instance
const cart = new CartManager();

// Quick add to cart function for product pages
function addToCart(product) {
    return cart.addItem(product);
}

// Quick functions for common operations
function removeFromCart(itemId) {
    return cart.removeItem(itemId);
}

function updateCartQuantity(itemId, quantity) {
    return cart.updateQuantity(itemId, quantity);
}

function getCartCount() {
    return cart.getItemCount();
}

function getCartTotal() {
    return cart.getTotal();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    cart.updateCartCount();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager, cart };
}
