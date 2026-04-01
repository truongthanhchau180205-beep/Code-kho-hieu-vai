// VNPay Payment Integration
// TechStore Payment Gateway Integration

class VNPayPayment {
    constructor() {
        this.vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Sandbox URL
        this.tmnCode = 'DEMO'; // Replace with your actual TMN Code
        this.hashSecret = 'DEMO_SECRET_KEY'; // Replace with your actual secret key
        this.returnUrl = window.location.origin + '/cart.html';
    }

    // Create VNPay payment URL
    createPaymentUrl(orderData) {
        const vnpParams = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': this.tmnCode,
            'vnp_Amount': Math.round(orderData.total * 100), // Convert to VND cents
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderData.orderId,
            'vnp_OrderInfo': `Thanh toan don hang TechStore ${orderData.orderId}`,
            'vnp_OrderType': 'other',
            'vnp_Locale': 'vn',
            'vnp_ReturnUrl': this.returnUrl + '?payment=return',
            'vnp_IpAddr': this.getClientIpAddress(),
            'vnp_CreateDate': this.getVNPayDate()
        };

        // Sort parameters
        const sortedParams = Object.keys(vnpParams).sort();
        const signData = sortedParams.map(key => 
            `${key}=${encodeURIComponent(vnpParams[key])}`
        ).join('&');

        // In production, you would create secure hash here
        // vnpParams['vnp_SecureHash'] = this.createSecureHash(signData);

        const paymentUrl = this.vnpUrl + '?' + sortedParams.map(key => 
            `${key}=${encodeURIComponent(vnpParams[key])}`
        ).join('&');

        return paymentUrl;
    }

    // Get VNPay formatted date
    getVNPayDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // Get client IP address (simplified for demo)
    getClientIpAddress() {
        return '127.0.0.1'; // In production, get real IP from server
    }

    // Create secure hash (simplified for demo)
    createSecureHash(signData) {
        // In production, use proper HMAC SHA512 with your secret key
        // This is just for demo purposes
        return 'demo_hash_' + Math.random().toString(36).substring(7);
    }

    // Process payment return
    processReturn(urlParams) {
        const responseCode = urlParams.get('vnp_ResponseCode');
        const transactionStatus = urlParams.get('vnp_TransactionStatus');
        const orderId = urlParams.get('vnp_TxnRef');
        const amount = urlParams.get('vnp_Amount');
        const bankCode = urlParams.get('vnp_BankCode');
        const payDate = urlParams.get('vnp_PayDate');

        return {
            success: responseCode === '00' && transactionStatus === '00',
            responseCode,
            orderId,
            amount: amount ? parseInt(amount) / 100 : 0, // Convert back from cents
            bankCode,
            payDate,
            message: this.getResponseMessage(responseCode)
        };
    }

    // Get response message
    getResponseMessage(responseCode) {
        const messages = {
            '00': 'Giao dịch thành công',
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
            '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
            '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
            '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
            '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            '75': 'Ngân hàng thanh toán đang bảo trì.',
            '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
            '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
        };

        return messages[responseCode] || 'Lỗi không xác định';
    }
}

// Bank Transfer Helper
class BankTransfer {
    constructor() {
        this.banks = [
            {
                name: 'Techcombank',
                account: '19036969696969',
                owner: 'CONG TY TNHH TECHSTORE',
                branch: 'Chi nhánh Hà Nội'
            },
            {
                name: 'Vietcombank',
                account: '0123456789',
                owner: 'CONG TY TNHH TECHSTORE', 
                branch: 'Chi nhánh TP.HCM'
            },
            {
                name: 'BIDV',
                account: '12345678901',
                owner: 'CONG TY TNHH TECHSTORE',
                branch: 'Chi nhánh Đà Nẵng'
            }
        ];
    }

    // Get transfer content
    getTransferContent(orderId, customerName) {
        return `${orderId} ${customerName.toUpperCase()}`;
    }

    // Generate QR Code URL
    generateQRCode(bank, amount, content) {
        // Using VietQR standard
        const bankCode = this.getBankCode(bank.name);
        const accountNumber = bank.account;
        const qrContent = `${bankCode}|${accountNumber}|${amount}|${content}|TechStore`;
        
        // In production, use proper QR code generation service
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}`;
    }

    // Get bank code for QR
    getBankCode(bankName) {
        const codes = {
            'Techcombank': '970407',
            'Vietcombank': '970436',
            'BIDV': '970418'
        };
        return codes[bankName] || '970407';
    }
}

// Payment Analytics
class PaymentAnalytics {
    constructor() {
        this.events = [];
    }

    // Track payment event
    trackEvent(eventType, data) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data,
            sessionId: this.getSessionId()
        };

        this.events.push(event);
        this.saveToLocalStorage();

        // In production, send to analytics service
        console.log('Payment Event:', event);
    }

    // Get session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('payment_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(7);
            sessionStorage.setItem('payment_session_id', sessionId);
        }
        return sessionId;
    }

    // Save events to localStorage
    saveToLocalStorage() {
        localStorage.setItem('payment_analytics', JSON.stringify(this.events));
    }

    // Load events from localStorage
    loadFromLocalStorage() {
        const stored = localStorage.getItem('payment_analytics');
        if (stored) {
            this.events = JSON.parse(stored);
        }
    }

    // Get analytics summary
    getSummary() {
        const summary = {
            totalEvents: this.events.length,
            paymentMethods: {},
            successRate: 0,
            totalAmount: 0
        };

        let successCount = 0;
        
        this.events.forEach(event => {
            if (event.type === 'payment_initiated') {
                const method = event.data.method;
                summary.paymentMethods[method] = (summary.paymentMethods[method] || 0) + 1;
            }
            
            if (event.type === 'payment_success') {
                successCount++;
                summary.totalAmount += event.data.amount || 0;
            }
        });

        const paymentInitiated = this.events.filter(e => e.type === 'payment_initiated').length;
        summary.successRate = paymentInitiated > 0 ? (successCount / paymentInitiated * 100) : 0;

        return summary;
    }
}

// Order Management
class OrderManager {
    constructor() {
        this.orders = this.loadOrders();
    }

    // Create new order
    createOrder(orderData) {
        const order = {
            id: orderData.orderId,
            items: orderData.items,
            customer: orderData.customer,
            total: orderData.total,
            status: 'pending',
            paymentMethod: orderData.paymentMethod,
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deliveryInfo: {
                type: orderData.deliveryType || 'standard',
                fee: orderData.deliveryFee,
                estimatedDays: orderData.deliveryType === 'express' ? 1 : 3
            },
            promoCode: orderData.promoCode,
            notes: orderData.note
        };

        this.orders.unshift(order);
        this.saveOrders();
        return order;
    }

    // Update order status
    updateOrderStatus(orderId, status, paymentStatus = null) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            if (paymentStatus) {
                order.paymentStatus = paymentStatus;
            }
            order.updatedAt = new Date().toISOString();
            this.saveOrders();
        }
        return order;
    }

    // Get order by ID
    getOrder(orderId) {
        return this.orders.find(o => o.id === orderId);
    }

    // Get orders by status
    getOrdersByStatus(status) {
        return this.orders.filter(o => o.status === status);
    }

    // Load orders from localStorage
    loadOrders() {
        const stored = localStorage.getItem('techstore_orders');
        return stored ? JSON.parse(stored) : [];
    }

    // Save orders to localStorage
    saveOrders() {
        localStorage.setItem('techstore_orders', JSON.stringify(this.orders));
    }

    // Get order statistics
    getStatistics() {
        const stats = {
            total: this.orders.length,
            pending: this.orders.filter(o => o.status === 'pending').length,
            processing: this.orders.filter(o => o.status === 'processing').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length,
            totalRevenue: this.orders
                .filter(o => o.paymentStatus === 'completed')
                .reduce((sum, o) => sum + o.total, 0)
        };
        return stats;
    }
}

// Security Helper
class PaymentSecurity {
    // Validate order data
    static validateOrderData(orderData) {
        const errors = [];

        if (!orderData.orderId || orderData.orderId.length < 5) {
            errors.push('Mã đơn hàng không hợp lệ');
        }

        if (!orderData.customer.name || orderData.customer.name.trim().length < 2) {
            errors.push('Tên khách hàng không hợp lệ');
        }

        if (!orderData.customer.phone || !/^(0|\+84)[0-9]{9}$/.test(orderData.customer.phone.replace(/\s/g, ''))) {
            errors.push('Số điện thoại không hợp lệ');
        }

        if (orderData.customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customer.email)) {
            errors.push('Email không hợp lệ');
        }

        if (!orderData.customer.address || orderData.customer.address.trim().length < 10) {
            errors.push('Địa chỉ giao hàng phải có ít nhất 10 ký tự');
        }

        if (!orderData.total || orderData.total < 1000) {
            errors.push('Tổng đơn hàng không hợp lệ');
        }

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Đơn hàng phải có ít nhất 1 sản phẩm');
        }

        return errors;
    }

    // Sanitize input
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
            .substring(0, 1000); // Limit length
    }

    // Generate secure order ID
    static generateOrderId() {
        const prefix = 'TS';
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    // Check for suspicious activity
    static checkSuspiciousActivity(orderData) {
        const warnings = [];

        // Check for excessive order amount
        if (orderData.total > 100000000) { // 100 million VND
            warnings.push('Đơn hàng có giá trị rất cao');
        }

        // Check for duplicate orders (simple check)
        const recentOrders = JSON.parse(localStorage.getItem('techstore_orders') || '[]');
        const duplicates = recentOrders.filter(order => 
            order.customer.phone === orderData.customer.phone &&
            Math.abs(order.total - orderData.total) < 1000 &&
            Date.now() - new Date(order.createdAt).getTime() < 300000 // 5 minutes
        );

        if (duplicates.length > 0) {
            warnings.push('Phát hiện đơn hàng tương tự trong thời gian gần đây');
        }

        return warnings;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VNPayPayment,
        BankTransfer,
        PaymentAnalytics,
        OrderManager,
        PaymentSecurity
    };
}

// Global access for browser
window.TechStorePayment = {
    VNPayPayment,
    BankTransfer,
    PaymentAnalytics,
    OrderManager,
    PaymentSecurity
};
