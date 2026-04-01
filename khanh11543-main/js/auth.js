// Authentication system for TechStore
class TechStoreAuth {
    constructor() {
        this.users = {
            'admin': {
                email: 'admin@gmail.com',
                password: '12345678@',
                fullName: 'Administrator',
                role: 'admin',
                phone: '+84 90 123 4567',
                address: '123 Đường Công Nghệ, Phường Tech, Quận Innovation, TP.HCM',
                joinDate: '2024-01-01',
                avatar: 'https://ui-avatars.com/api/?name=Administrator&background=667eea&color=fff&size=200'
            }
        };
        this.currentUser = null;
        this.loadUserSession();
    }

    // Load user session from localStorage
    loadUserSession() {
        const savedUser = localStorage.getItem('techstore_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Save user session to localStorage
    saveUserSession(user) {
        localStorage.setItem('techstore_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Login function
    login(email, password) {
        console.log('Attempting login with:', email, password); // Debug log
        
        // Find user by email - check both key and email field
        let user = null;
        
        // First try to find by email field
        user = Object.values(this.users).find(u => u.email === email);
        
        // If not found, try to find by key (backward compatibility)
        if (!user) {
            user = this.users[email];
        }
        
        console.log('Found user:', user); // Debug log
        
        if (user && user.password === password) {
            // Remove password from saved data
            const userToSave = { ...user };
            delete userToSave.password;
            
            this.saveUserSession(userToSave);
            console.log('Login successful'); // Debug log
            return { success: true, user: userToSave };
        }
        
        console.log('Login failed'); // Debug log
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    // Logout function
    logout() {
        localStorage.removeItem('techstore_user');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Protect page (redirect to login if not authenticated)
    protectPage() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Update user profile
    updateProfile(updatedData) {
        if (!this.currentUser) return false;

        // Update current user data
        this.currentUser = { ...this.currentUser, ...updatedData };
        
        // Save to localStorage
        this.saveUserSession(this.currentUser);
        
        // In a real app, you would also update the users database
        const userKey = Object.keys(this.users).find(key => 
            this.users[key].email === this.currentUser.email
        );
        if (userKey) {
            this.users[userKey] = { ...this.users[userKey], ...updatedData };
        }
        
        return true;
    }

    // Show user info in navigation
    updateNavigation() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn && this.isLoggedIn()) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.fullName}`;
            loginBtn.href = 'profile.html';
            
            // Add logout option
            const navActions = document.querySelector('.nav-actions');
            if (navActions && !document.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'logout-btn';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                logoutBtn.title = 'Đăng xuất';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    if (confirm('Bạn có chắc muốn đăng xuất?')) {
                        this.logout();
                    }
                };
                navActions.appendChild(logoutBtn);
            }
        }
    }
}

// Create global instance
if (!window.TechStoreAuth) {
    window.TechStoreAuth = new TechStoreAuth();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.TechStoreAuth && typeof window.TechStoreAuth.updateNavigation === 'function') {
        window.TechStoreAuth.updateNavigation();
    }
});
