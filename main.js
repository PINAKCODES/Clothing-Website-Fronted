// Cart functionality (outside DOMContentLoaded)
let cartItems = [];
let cartTotal = 0;

function updateCartCount() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.textContent = `Cart (${cartItems.length})`;
        // Add animation class
        cartBtn.classList.add('cart-updated');
        setTimeout(() => cartBtn.classList.remove('cart-updated'), 300);
    }
}

function updateCartTotal() {
    cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const totalElement = document.querySelector('.total-amount');
    if (totalElement) {
        totalElement.textContent = `$${cartTotal}`;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <button class="secondary-button" onclick="closeCart()">Continue Shopping</button>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cartItems.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        ×
                    </button>
                </div>
            `).join('');
        }
    }
}

function removeFromCart(index) {
    const item = document.querySelector(`.cart-item[data-index="${index}"]`);
    item.classList.add('removing');
    
    setTimeout(() => {
        cartItems.splice(index, 1);
        updateCartCount();
        updateCartTotal();
        renderCartItems();
        showCartNotification('Item removed from cart');
    }, 300);
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function addToCart(button) {
    const item = button.closest('.collection-item');
    const itemName = item.querySelector('h3').textContent;
    const itemPrice = parseFloat(item.dataset.price);
    
    // Add animation to button
    button.classList.add('adding');
    
    cartItems.push({
        name: itemName,
        price: itemPrice
    });
    
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    showCartNotification('Item added to cart!');
    
    // Show cart modal
    openCart();
    
    // Remove animation class after animation completes
    setTimeout(() => {
        button.classList.remove('adding');
    }, 1000);
}

function openCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
    }
}

function closeCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
}

// Scroll Animation Handler
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-reveal, .section-header, .collection-item, .lookbook-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();
    // Handle loader
    setTimeout(() => {
        document.querySelector('.loader').style.animation = 'loaderOut 1s ease forwards';
    }, 2000);

    // Smooth scroll with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Handle header scroll effect
    const header = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Enhanced parallax effect
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroImage = document.querySelector('.hero-image img');
                const parallaxElements = document.querySelectorAll('.parallax');
                
                if (heroImage) {
                    heroImage.style.transform = `translateY(${scrolled * 0.4}px)`;
                }
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.2;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            // Add your newsletter subscription logic here
            alert('Thank you for subscribing!');
            e.target.reset();
        });
    }

    // Enhanced collection item hover effect
    document.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            item.style.transform = `
                perspective(1000px) 
                rotateX(${angleX}deg) 
                rotateY(${angleY}deg) 
                scale3d(1.05, 1.05, 1.05)
                translateZ(50px)
            `;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'none';
        });
    });

    // Add scroll-reveal class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('scroll-reveal');
    });

    // Initialize cart modal functionality
    const cartBtn = document.querySelector('.cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartModal = document.querySelector('.cart-modal');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
        });
    }

    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (cartModal && !cartModal.contains(e.target) && !e.target.closest('.cart-btn')) {
            cartModal.classList.remove('active');
        }
    });

    // Mobile Menu Handler
    initMobileMenu();

    // Add touch support for collection items
    document.querySelectorAll('.collection-item').forEach(item => {
        let touchStartY = 0;
        let touchEndY = 0;

        item.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        item.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
        });

        item.addEventListener('touchend', () => {
            const swipeDistance = touchStartY - touchEndY;
            if (Math.abs(swipeDistance) > 50) {
                // Handle swipe
                if (swipeDistance > 0) {
                    // Swipe up
                    item.classList.add('swiped-up');
                } else {
                    // Swipe down
                    item.classList.remove('swiped-up');
                }
            }
        });
    });

    // Prevent zoom on double tap for iOS
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            e.preventDefault();
        }
        lastTap = now;
    }, { passive: false });
});

// Mobile Menu Handler
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (hamburger && navLinks) {
        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// Smooth scroll with offset for mobile
function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 60; // Adjusted offset for mobile header
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Apply smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            smoothScroll(target, 1000);
        }
    });
}); 