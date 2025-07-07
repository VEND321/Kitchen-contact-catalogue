document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileNav.classList.toggle('show');
        this.innerHTML = mobileNav.classList.contains('show') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-nav') && !e.target.closest('.mobile-menu-btn')) {
            mobileNav.classList.remove('show');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileNav.classList.contains('show')) {
                    mobileNav.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Glass category filter
    const glassCategoryBtns = document.querySelectorAll('.glass-category-btn');
    
    glassCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            glassCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            const items = document.querySelectorAll('.item-card[data-category]');
            
            items.forEach(item => {
                item.style.display = (category === 'all' || item.dataset.category === category) 
                    ? 'block' 
                    : 'none';
            });
        });
    });

    // ENHANCED Shopping cart functionality
    let cart = [];
    const itemBtns = document.querySelectorAll('.item-btn');
    const successMsg = document.getElementById('success-message');
    const itemCount = document.getElementById('item-count');
    const whatsappBtns = document.querySelectorAll('.btn-whatsapp');
    
    function updateCartUI() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update item count display
        itemCount.textContent = totalItems;
        
        // Update WhatsApp buttons with notification badges
        whatsappBtns.forEach(btn => {
            // Create or update notification badge
            let badge = btn.querySelector('.cart-notification');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-notification';
                btn.appendChild(badge);
            }
            
            badge.textContent = totalItems;
            
            if (totalItems > 0) {
                btn.classList.add('has-items');
                badge.classList.add('visible');
                
                // Add temporary animation
                btn.classList.add('animate-notification');
                setTimeout(() => {
                    btn.classList.remove('animate-notification');
                }, 2000);
            } else {
                btn.classList.remove('has-items');
                badge.classList.remove('visible');
            }
            
            // Update WhatsApp message
            updateWhatsAppMessage(btn);
        });
        
        // Show success message
        if (totalItems > 0) {
            successMsg.style.display = 'flex';
            setTimeout(() => successMsg.style.display = 'none', 3000);
        }
    }
    
    function updateWhatsAppMessage(btn) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        let message = "Hello Kitchen Contact, I'd like to place an order for:\n\n";
        
        if (totalItems > 0) {
            cart.forEach(item => {
                message += `• ${item.name} - ${item.quantity} x ₦${item.price.toLocaleString()} = ₦${(item.quantity * item.price).toLocaleString()}\n`;
            });
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            message += `\nTOTAL: ₦${total.toLocaleString()}\n\nPlease confirm availability. Thank you!`;
        } else {
            message += "I'm interested in your rental items. Please share availability details.";
        }
        
        btn.href = `https://wa.me/2348188726102?text=${encodeURIComponent(message)}`;
    }

    // Initialize cart functionality
    itemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.item-card');
            const itemName = this.dataset.item;
            const itemPrice = parseFloat(this.dataset.price);
            const quantity = parseInt(card.querySelector('.quantity-input').value) || 1;
            
            // Add to cart
            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity
                });
            }
            
            // Create floating "+1" animation
            const itemAdded = document.createElement('span');
            itemAdded.className = 'item-added';
            itemAdded.textContent = `+${quantity}`;
            successMsg.appendChild(itemAdded);
            
            // Remove after animation
            setTimeout(() => {
                itemAdded.remove();
            }, 1000);
            
            // Update all UI elements
            updateCartUI();
            
            // Reset quantity
            card.querySelector('.quantity-input').value = 1;
        });
    });

    // Quantity selectors
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value) || 1;
            
            if (this.classList.contains('minus') && value > 1) {
                input.value = value - 1;
            } else if (this.classList.contains('plus')) {
                input.value = value + 1;
            }
        });
    });

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            answer.classList.toggle('show');
        });
    });

    // Initialize cart UI
    updateCartUI();

    // Animate items on scroll
    const animateOnScroll = () => {
        const itemCards = document.querySelectorAll('.item-card:not(.animated)');
        
        itemCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                card.classList.add('animated');
            }
        });
    };
    
    // Run once on load and then on scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

