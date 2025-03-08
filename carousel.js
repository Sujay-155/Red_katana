// Carousel functionality for Red Katana Website

document.addEventListener('DOMContentLoaded', function() {
    // Get carousel elements
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    // Set initial state
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Auto scroll timer
    let autoScrollTimer;
    const autoScrollInterval = 5000; // 5 seconds
    
    // Set up click events for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoScroll();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoScroll();
        });
    }
    
    // Set up click events for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoScroll();
        });
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
        // Handle wrap-around for prev/next
        if (index < 0) {
            index = totalItems - 1;
        } else if (index >= totalItems) {
            index = 0;
        }
        
        // Remove active class from current items
        document.querySelector('.carousel-item.active').classList.remove('active');
        document.querySelector('.indicator.active').classList.remove('active');
        
        // Add active class to new items
        items[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Function to start auto-scroll
    function startAutoScroll() {
        autoScrollTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, autoScrollInterval);
    }
    
    // Function to reset auto-scroll timer after user interaction
    function resetAutoScroll() {
        clearInterval(autoScrollTimer);
        startAutoScroll();
    }
    
    // Start auto-scroll on page load
    startAutoScroll();
    
    // Add swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetAutoScroll();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const threshold = 50; // Minimum distance required for a swipe
        
        if (touchEndX < touchStartX - threshold) {
            // Swipe left, go to next
            goToSlide(currentIndex + 1);
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe right, go to previous
            goToSlide(currentIndex - 1);
        }
    }
});