 // Create floating coffee beans
        function createCoffeeBeans() {
            const container = document.getElementById('coffee-beans');
            const beanCount = window.innerWidth < 768 ? 10 : 20;
            
            for (let i = 0; i < beanCount; i++) {
                const bean = document.createElement('div');
                bean.classList.add('coffee-bean');
                
                // Random position
                bean.style.left = `${Math.random() * 100}%`;
                bean.style.top = `${Math.random() * 100}%`;
                
                // Random size
                const size = Math.random() * 0.5 + 0.5;
                bean.style.transform = `scale(${size}) rotate(${Math.random() * 360}deg)`;
                
                // Random animation duration
                const duration = Math.random() * 10 + 15;
                bean.style.animationDuration = `${duration}s`;
                
                // Random delay
                const delay = Math.random() * 10;
                bean.style.animationDelay = `${delay}s`;
                
                container.appendChild(bean);
            }
        }
        
        // Sticky header
        function handleScroll() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(44, 21, 24, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'rgba(44, 21, 24, 0.9)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Mobile menu toggle
        function setupMobileMenu() {
            const menuToggle = document.getElementById('menu-toggle');
            const mainNav = document.getElementById('main-nav');
            
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                menuToggle.innerHTML = mainNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('nav ul li a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('nav') && !e.target.closest('.menu-toggle') && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
        
        // Initialize
        window.addEventListener('DOMContentLoaded', () => {
            createCoffeeBeans();
            setupMobileMenu();
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial call
        });
        // Menu Filtering
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;

            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Update dots
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        currentTranslate = currentIndex * -100;
        prevTranslate = currentTranslate;
        setSliderPosition();
        updateDots();
    }

    // Set slider position
    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}%)`;
    }

    // Handle next slide
    function nextSlide() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        goToSlide(currentIndex);
    }

    // Handle previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1;
        }
        goToSlide(currentIndex);
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Touch events
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('touchend', touchEnd);

    // Mouse events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        startPos = getPositionX(event);
        isDragging = true;
        track.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + (currentPosition - startPos) / track.offsetWidth * 100;
            track.style.transform = `translateX(${currentTranslate}%)`;
        }
    }

    function touchEnd() {
        isDragging = false;
        track.style.cursor = 'grab';
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -20) nextSlide();
        else if (movedBy > 20) prevSlide();
        else goToSlide(currentIndex);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Auto slide
    let autoSlideInterval = setInterval(nextSlide, 5000);

    // Pause auto slide on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    track.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
});
function sendWhatsApp(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Format the message for WhatsApp
    const whatsappMessage = `*New Enquiry from Website*%0A%0A*Subject:* ${subject}%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Message:* ${message}`;

    // Replace with your business WhatsApp number
    const whatsappNumber = '919876543210';

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Open WhatsApp in a new window
    window.open(whatsappURL, '_blank');

    // Reset the form
    document.getElementById('contactForm').reset();

    return false;
}