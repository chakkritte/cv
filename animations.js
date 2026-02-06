document.addEventListener('DOMContentLoaded', () => {

    // 1. Spotlight Effect
    const cards = document.querySelectorAll('.spotlight-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Scroll Reveal Effect
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));


    // 3. Scroll Velocity & Gradient Effects
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // A. Scroll Gradient Text Logic
                // Calculate percentage of scroll (0 to 1)
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = Math.min(Math.max(currentScrollY / docHeight, 0), 1);
                document.body.style.setProperty('--scroll-p', scrollPercentage);


                // B. Velocity Skew Logic
                // Identify velocity
                const velocity = currentScrollY - lastScrollY;
                const maxSkew = 10; // degrees
                const skewValue = Math.min(Math.max(velocity * 0.1, -maxSkew), maxSkew);

                // Apply skew to elements with .velocity-skew class
                const skewElements = document.querySelectorAll('.velocity-skew');
                skewElements.forEach(el => {
                    el.style.setProperty('--skew-x', `${-skewValue}deg`);
                    // Note: skewX makes it look like it's dragging behind. 
                    // Negative velocity -> moving up -> skew positive? Let's tune.
                    // If moving down (positive velocity) -> content moves up visually relative to viewport -> drag down?
                    // Usually skewX(-velocity) looks like wind.
                });

                lastScrollY = currentScrollY;
                ticking = false;
            });

            ticking = true;
        }
    });

    // Reset skew when stopped scrolling (debounced)
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const skewElements = document.querySelectorAll('.velocity-skew');
            skewElements.forEach(el => {
                el.style.transform = `skewX(0deg)`; // Direct reset or custom prop
                el.style.setProperty('--skew-x', `0deg`);
            });
        }, 150); // 150ms after scroll stops
    });

});
