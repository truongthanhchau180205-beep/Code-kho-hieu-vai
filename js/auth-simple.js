// Simple Authentication System for TechStore
(function() {
    'use strict';
    
    // User database
    const users = {
        'admin@gmail.com': {
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

    // Current user
    let currentUser = null;

    // Load user session from localStorage
    function loadUserSession() {
        try {
            const savedUser = localStorage.getItem('techstore_user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
            }
        } catch (e) {
            console.error('Error loading user session:', e);
        }
    }

    // Save user session to localStorage
    function saveUserSession(user) {
        try {
            localStorage.setItem('techstore_user', JSON.stringify(user));
            currentUser = user;
        } catch (e) {
            console.error('Error saving user session:', e);
        }
    }

    // Login function
    function login(email, password) {
        console.log('Login attempt:', email);
        
        const user = users[email];
        if (user && user.password === password) {
            const userToSave = { ...user };
            delete userToSave.password;
            
            saveUserSession(userToSave);
            console.log('Login successful');
            return { success: true, user: userToSave };
        }
        
        console.log('Login failed');
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    // Logout function
    function logout() {
        localStorage.removeItem('techstore_user');
        currentUser = null;
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    function isLoggedIn() {
        return currentUser !== null;
    }

    // Get current user
    function getCurrentUser() {
        return currentUser;
    }

    // Protect page
    function protectPage() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Update user profile
    function updateProfile(updatedData) {
        if (!currentUser) return false;

        currentUser = { ...currentUser, ...updatedData };
        saveUserSession(currentUser);
        
        return true;
    }

    // Update navigation
    function updateNavigation() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn && isLoggedIn()) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.fullName}`;
            loginBtn.href = 'profile.html';
            
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
                        logout();
                    }
                };
                navActions.appendChild(logoutBtn);
            }
        }
    }

    // Initialize
    loadUserSession();

    // Create global object
    window.TechStoreAuth = {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser,
        protectPage: protectPage,
        updateProfile: updateProfile,
        updateNavigation: updateNavigation
    };

    console.log('TechStoreAuth initialized successfully');

})();
