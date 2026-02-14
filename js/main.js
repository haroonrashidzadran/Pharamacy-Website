/* ==============================
   MediCare Pharmacy - Main JavaScript
   ============================== */

// DOM Elements
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchBtn = document.querySelector('.search-btn');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');

// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('medicareCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('medicareCart', JSON.stringify(cart));
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    showNotification('Product removed from cart');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// Add notification animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Header scroll effect
function handleScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Mobile navigation toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    
    if (navMenu.classList.contains('active')) {
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        }
    });
});

// Search functionality (placeholder)
function openSearch() {
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-modal-content">
            <input type="text" placeholder="Search for medicines, products..." id="search-input">
            <button class="close-search"><i class="fas fa-times"></i></button>
        </div>
    `;
    searchModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = searchModal.querySelector('.search-modal-content');
    content.style.cssText = `
        width: 90%;
        max-width: 600px;
        display: flex;
        gap: 15px;
    `;
    
    const input = searchModal.querySelector('#search-input');
    input.style.cssText = `
        flex: 1;
        padding: 15px 25px;
        font-size: 1.1rem;
        border: none;
        border-radius: 50px;
        outline: none;
    `;
    
    const closeBtn = searchModal.querySelector('.close-search');
    closeBtn.style.cssText = `
        background: #2ecc71;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
    `;
    
    closeBtn.addEventListener('click', () => searchModal.remove());
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) searchModal.remove();
    });
    
    document.body.appendChild(searchModal);
    input.focus();
}

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters if present
                const counter = entry.target.querySelector('.stat-number');
                if (counter && !counter.dataset.animated) {
                    counter.dataset.animated = 'true';
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.feature-card, .service-card, .product-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyle);

// Product quantity selector
function createQuantitySelector(button) {
    const card = button.closest('.product-card');
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'quantity-selector';
    quantityDiv.innerHTML = `
        <button class="qty-minus"><i class="fas fa-minus"></i></button>
        <span class="qty-value">1</span>
        <button class="qty-plus"><i class="fas fa-plus"></i></button>
    `;
    quantityDiv.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 15px;
    `;
    
    const minusBtn = quantityDiv.querySelector('.qty-minus');
    const plusBtn = quantityDiv.querySelector('.qty-plus');
    const qtyValue = quantityDiv.querySelector('.qty-value');
    
    let quantity = 1;
    
    minusBtn.style.cssText = `
        width: 30px;
        height: 30px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    `;
    
    plusBtn.style.cssText = minusBtn.style.cssText;
    
    minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyValue.textContent = quantity;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        quantity++;
        qtyValue.textContent = quantity;
    });
    
    button.parentNode.insertBefore(quantityDiv, button);
}

// Initialize event listeners
function initEventListeners() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', openSearch);
    }
    
    // Cart button
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showNotification('Cart feature coming soon!');
        });
    }
    
    // Add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.current-price').textContent,
                image: card.querySelector('.product-image img').src
            };
            addToCart(product);
        });
    });
    
    // Header scroll
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.focus();
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initEventListeners();
    setupScrollAnimations();
    handleScroll();
    
    console.log('MediCare Pharmacy website loaded successfully');
});
