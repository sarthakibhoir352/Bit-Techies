// EcoFinds - Frontend with Flask Backend Integration
// Modified to work with your Python Flask backend

// Global state
let currentUser = null;
let products = [];
let cart = [];
let purchases = [];
let currentPage = 'login-page';

// Backend API configuration
const API_BASE_URL = 'http://127.0.0.1:5000'; // Your Flask server URL

// Sample products (you can move this to backend later)
const sampleProducts = [
    {
        id: '1',
        title: 'Vintage Wooden Chair',
        description: 'Beautiful vintage wooden chair in excellent condition. Perfect for dining room or study.',
        category: 'Furniture',
        price: 45.99,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        seller: { username: 'john_doe', email: 'john@example.com' },
        userId: 'user1'
    },
    {
        id: '2',
        title: 'MacBook Pro 2019',
        description: '13-inch MacBook Pro in great condition. Battery life is excellent, no scratches.',
        category: 'Electronics',
        price: 899.99,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        seller: { username: 'jane_smith', email: 'jane@example.com' },
        userId: 'user2'
    },
    {
        id: '3',
        title: 'Designer Jeans',
        description: 'High-quality designer jeans, size 32. Worn only a few times.',
        category: 'Clothing',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
        seller: { username: 'john_doe', email: 'john@example.com' },
        userId: 'user1'
    },
    {
        id: '4',
        title: 'Garden Tools Set',
        description: 'Complete set of garden tools including spade, rake, and pruning shears.',
        category: 'Home & Garden',
        price: 35.50,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        seller: { username: 'jane_smith', email: 'jane@example.com' },
        userId: 'user2'
    },
    {
        id: '5',
        title: 'Programming Books Collection',
        description: 'Collection of 5 programming books covering React, Node.js, and TypeScript.',
        category: 'Books',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        seller: { username: 'john_doe', email: 'john@example.com' },
        userId: 'user1'
    },
    {
        id: '6',
        title: 'Basketball',
        description: 'Official size basketball in good condition. Great for outdoor games.',
        category: 'Sports',
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
        seller: { username: 'jane_smith', email: 'jane@example.com' },
        userId: 'user2'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Load non-auth data from localStorage
    loadData();
    
    // Check if user is logged in via session
    checkAuthStatus();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
    
    // Initialize event listeners
    initializeEventListeners();
});

// Data persistence (for products, cart, purchases - not auth)
function saveData() {
    localStorage.setItem('ecofinds_products', JSON.stringify(products));
    localStorage.setItem('ecofinds_cart', JSON.stringify(cart));
    localStorage.setItem('ecofinds_purchases', JSON.stringify(purchases));
}

function loadData() {
    products = JSON.parse(localStorage.getItem('ecofinds_products')) || sampleProducts;
    cart = JSON.parse(localStorage.getItem('ecofinds_cart')) || [];
    purchases = JSON.parse(localStorage.getItem('ecofinds_purchases')) || [];
}

// Authentication with Flask backend
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            method: 'GET',
            credentials: 'include' // Important for session cookies
        });
        
        if (response.ok) {
            const data = await response.json();
            // Extract username from welcome message
            const username = data.message.replace('Welcome ', '').replace('!', '');
            currentUser = { username: username, email : data.email };//modified added email
            showApp();
        } else {
            showPage('login-page');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showPage('login-page');
    }
}

async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            currentUser = { username: username, email: data.email }; //modified added email
            showApp();
            return true;
        } else {
            showErrorMessage('login-error', data.message);
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage('login-error', 'Network error. Please try again.');
        return false;
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            currentUser = { username: username, email: data.email }; //modified added email
            showApp();
            return true;
        } else {
            showErrorMessage('signup-error', data.message);
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage('signup-error', 'Network error. Please try again.');
        return false;
    }
}

function clearUserInfo() {
    document.getElementById('user-username').textContent = '';
    document.getElementById('user-email').textContent = '';
    document.getElementById('profile-username').textContent = '';
    document.getElementById('profile-email').textContent = '';
    document.getElementById('profile-username-input').value = '';
    document.getElementById('profile-email-input').value = '';
}

async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = null;
            showPage('login-page');
            clearUserInfo();
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Still logout locally even if server call fails
        currentUser = null;
        showPage('login-page');
        clearUserInfo();
    }
}

// UI Management
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show target page
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update navigation
    updateNavigation(pageId);
    
    // Load page content
    loadPageContent(pageId);
    
    currentPage = pageId;
}

function showApp() {
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('signup-page').classList.add('hidden');
    
    // Update user info
    if (currentUser) {
        document.getElementById('user-username').textContent = currentUser.username;
        document.getElementById('user-email').textContent = currentUser.email || 'No email';
        document.getElementById('profile-username').textContent = currentUser.username;
        document.getElementById('profile-email').textContent = currentUser.email || 'No email';
        document.getElementById('profile-username-input').value = currentUser.username;
        document.getElementById('profile-email-input').value = currentUser.email || '';
    }
    
    showPage('feed-page');
}

function updateNavigation(pageId) {
    // Update sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // Update mobile navigation
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        'feed-page': 'Feed',
        'my-listings-page': 'My Listings',
        'add-product-page': 'Add Product',
        'cart-page': 'Cart',
        'purchases-page': 'Purchases',
        'profile-page': 'Profile'
    };
    
    document.getElementById('page-title').textContent = titles[pageId] || 'EcoFinds';
}

function loadPageContent(pageId) {
    switch(pageId) {
        case 'feed-page':
            loadFeedPage();
            break;
        case 'my-listings-page':
            loadMyListingsPage();
            break;
        case 'cart-page':
            loadCartPage();
            break;
        case 'purchases-page':
            loadPurchasesPage();
            break;
    }
}

// Error handling
function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.classList.add('hidden');
    });
}

// Feed Page
function loadFeedPage() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.querySelector('.filter-btn.active').dataset.category;
    
    let filteredProducts = products;
    
    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    renderProducts(filteredProducts, 'products-grid');
}

function renderProducts(productsToRender, containerId) {
    const container = document.getElementById(containerId);
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="viewProduct('${product.id}')">
            <img src="${product.imageUrl}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='">
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-seller">
                        <i class="fas fa-user"></i>
                        ${product.seller.username}
                    </span>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// Product Detail
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('detail-product-image').src = product.imageUrl;
    document.getElementById('detail-product-image').onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
    };
    document.getElementById('detail-product-title').textContent = product.title;
    document.getElementById('detail-product-seller').textContent = `by ${product.seller.username}`;
    document.getElementById('detail-product-category').textContent = product.category;
    document.getElementById('detail-product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detail-product-description').textContent = product.description;
    
    // Store current product for add to cart
    window.currentProduct = product;
    
    showPage('product-detail-page');
}

function addToCart() {
    if (!window.currentProduct) return;
    
    const existingItem = cart.find(item => item.productId === window.currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: 'cart_' + Date.now(),
            productId: window.currentProduct.id,
            product: window.currentProduct,
            quantity: 1
        });
    }
    
    saveData();
    updateCartCount();
    showSuccessMessage('Added to cart!');
}

// My Listings Page
function loadMyListingsPage() {
    const userProducts = products.filter(product => product.userId === currentUser.username);
    renderProducts(userProducts, 'my-products-grid');
}

// Cart Page
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartItemCount = document.getElementById('cart-item-count');
    
    cartItemCount.textContent = `${cart.length} items in your cart`;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some items to get started</p>
                <button class="primary-button" onclick="showPage('feed-page')">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.product.imageUrl}" alt="${item.product.title}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.title}</div>
                <div class="cart-item-seller">by ${item.product.seller.username}</div>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveData();
        loadCartPage();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveData();
    updateCartCount();
    loadCartPage();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) return;
    
    // Create purchases
    const newPurchases = cart.map(item => ({
        id: 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
        purchaseDate: new Date().toISOString()
    }));
    
    purchases.push(...newPurchases);
    
    // Clear cart
    cart = [];
    
    saveData();
    updateCartCount();
    showPage('purchases-page');
    showSuccessMessage('Checkout successful! Your items have been added to your purchase history.');
}

// Purchases Page
function loadPurchasesPage() {
    const purchasesContainer = document.getElementById('purchases-list');
    
    if (purchases.length === 0) {
        purchasesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No purchases yet</h3>
                <p>Start shopping to see your purchases here</p>
                <button class="primary-button" onclick="showPage('feed-page')">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    purchasesContainer.innerHTML = purchases.map(purchase => `
        <div class="purchase-item">
            <img src="${purchase.product.imageUrl}" alt="${purchase.product.title}" class="purchase-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'">
            <div class="purchase-info">
                <div class="purchase-title">${purchase.product.title}</div>
                <div class="purchase-seller">by ${purchase.product.seller.username}</div>
                <div class="purchase-description">${purchase.product.description}</div>
                <div class="purchase-meta">
                    <span><i class="fas fa-calendar"></i> Purchased on ${new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> Seller: ${purchase.product.seller.username}</span>
                </div>
                <div class="purchase-status">Completed</div>
            </div>
            <div class="purchase-price">
                <div>$${purchase.totalPrice.toFixed(2)}</div>
                <div style="font-size: 14px; color: #6b7280;">Qty: ${purchase.quantity}</div>
            </div>
        </div>
    `).join('');
}

// Add Product
function addProduct(formData) {
    const newProduct = {
        id: 'product_' + Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        seller: { username: currentUser.username, email: currentUser.email || 'No email' },
        userId: currentUser.username
    };
    
    products.push(newProduct);
    saveData();
    showPage('my-listings-page');
    showSuccessMessage('Product added successfully!');
}

// Utility Functions
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cart-count').textContent = count;
    document.getElementById('mobile-cart-count').textContent = count;
    document.getElementById('mobile-nav-cart-count').textContent = count;
    
    if (count > 0) {
        document.getElementById('cart-count').classList.remove('hidden');
        document.getElementById('mobile-cart-count').classList.remove('hidden');
        document.getElementById('mobile-nav-cart-count').classList.remove('hidden');
    } else {
        document.getElementById('cart-count').classList.add('hidden');
        document.getElementById('mobile-cart-count').classList.add('hidden');
        document.getElementById('mobile-nav-cart-count').classList.add('hidden');
    }
}

function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Insert at top of current page
    const currentPageElement = document.querySelector('.page:not(.hidden)');
    currentPageElement.insertBefore(successDiv, currentPageElement.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function goBack() {
    if (currentPage === 'product-detail-page') {
        showPage('feed-page');
    } else {
        showPage('feed-page');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Event Listeners
function initializeEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrorMessages();
        
        const formData = new FormData(this);
        const username = formData.get('username') || formData.get('email'); // Support both username and email
        const password = formData.get('password');
        
        await login(username, password);
    });
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrorMessages();
        
        const formData = new FormData(this);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            showErrorMessage('signup-error', 'Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showErrorMessage('signup-error', 'Password must be at least 6 characters');
            return;
        }
        
        await register(username, email, password);
    });
    
    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorMessages();
        
        const formData = new FormData(this);
        const productData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: formData.get('price'),
            imageUrl: formData.get('imageUrl')
        };
        
        if (!productData.title || !productData.description || !productData.category || !productData.price) {
            showErrorMessage('add-product-error', 'Please fill in all required fields');
            return;
        }
        
        addProduct(productData);
        this.reset();
    });
    
    // Profile form
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrorMessages();
        
        const formData = new FormData(this);
        const username = formData.get('username');
        const email = formData.get('email');
        
        currentUser.username = username;
        currentUser.email = email;
        
        // Update UI
        document.getElementById('user-username').textContent = username;
        document.getElementById('user-email').textContent = email;
        document.getElementById('profile-username').textContent = username;
        document.getElementById('profile-email').textContent = email;
        
        showSuccessMessage('Profile updated successfully!');
    });
    
    // Search input
    document.getElementById('search-input').addEventListener('input', function() {
        loadFeedPage();
    });
    
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadFeedPage();
        });
    });
    
    // Clear error messages on input
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = this.closest('form').querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        });
    });
}

// Initialize cart count on load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
