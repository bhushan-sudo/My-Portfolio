document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavLinksContainer = document.querySelector('.nav-links'); // Renamed to avoid conflict with navLinks (querySelectorAll)

    if (mobileMenuBtn && mobileNavLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavLinksContainer.classList.toggle('active');
        });
    }

    // Preloader Logic
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Keep loader visible for 2 seconds minimal to show animation
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.remove();
                }, 500); // Wait for transition to finish
            }, 2000);
        }
    });

    // 1. Sticky Header Animation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    document.querySelectorAll('.fade-in-section, .project-card, .skill-category').forEach(el => {
        el.classList.add('fade-in-section'); // Ensure class is present
        revealObserver.observe(el);
    });

    // 4. Active Navigation Link on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to corresponding link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active'); // Add styling if needed in CSS
                    // Optional: Update URL hash without jumping
                    // history.replaceState(null, null, `#${id}`);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. Parallax Effect for Hero (Subtle)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            if (scrollValue < 600) {
                heroContent.style.transform = `translateY(${scrollValue * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrollValue / 600);
            }
        });
    }

    // 6. Typewriter Effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const phrases = ["Data Analyst.", "Web Developer.", "Tech Enthusiast."];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before new phrase

                // Update background context based on new phrase
                if (window.updateBackgroundContext) {
                    window.updateBackgroundContext(phrases[phraseIndex]);
                }
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // 7. Code Particle Background & Constellation Effect
    const canvas = document.getElementById('code-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const characters = "0123456789ABCDEF{}[]<>/?!@#$%^&*()_+=-";
        const particles = [];
        const particleCount = 60; // Increased for better connections

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = -20;
                this.opacity = Math.random() * 0.5 + 0.3; // Increased opacity (0.3 to 0.8)
                this.speed = Math.random() * 1.5 + 0.5;
                this.char = characters[Math.floor(Math.random() * characters.length)];
                this.size = Math.random() * 20 + 14; // Increased size (14px to 34px)
            }

            update() {
                this.y += this.speed;
                if (this.y > height) {
                    this.reset();
                }
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const color = isDark ? '255, 255, 255' : '0, 0, 0';
                ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
                ctx.font = `${this.size}px 'Space Mono', monospace`;
                ctx.fillText(this.char, this.x, this.y);
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Context-Aware Logic
        let activeCharSet = "default"; // 'default', 'code', 'data'

        function getCharSet() {
            if (activeCharSet === 'data') return "01%+=*#";
            if (activeCharSet === 'code') return "{}<>/;[]";
            return "0123456789ABCDEF{}[]<>/?!@#$%^&*()_+=-"; // default/mixed
        }

        // Update Particle Class to use dynamic charset
        Particle.prototype.reset = function () {
            this.x = Math.random() * width;
            this.y = -20;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.speed = Math.random() * 1.5 + 0.5;
            const currentChars = getCharSet();
            this.char = currentChars[Math.floor(Math.random() * currentChars.length)];
            this.size = Math.random() * 20 + 14;
        };

        function drawConstellation() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const strokeColor = isDark ? '255, 255, 255' : '0, 0, 0';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) { // Increased connection distance
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${strokeColor}, ${0.2 - distance / 1000})`; // Increased line opacity
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConstellation();
            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Mouse Parallax for Orbs
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Move orbs in opposite direction
            const moveX = (x - 0.5) * 50; // Max 25px movement
            const moveY = (y - 0.5) * 50;

            document.body.style.setProperty('--orb-x', `${-moveX}px`);
            document.body.style.setProperty('--orb-y', `${-moveY}px`);
        });

        // Expose function to update charset from typewriter
        window.updateBackgroundContext = (phrase) => {
            if (phrase.includes("Data")) activeCharSet = 'data';
            else if (phrase.includes("Web") || phrase.includes("Code")) activeCharSet = 'code';
            else activeCharSet = 'default';
        };
    }

    // 10. 3D Tilt Effect for Bento Items
    const bentoItems = document.querySelectorAll('.bento-item, .glass-card');
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 8. Dark Mode Toggle
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            let newTheme = 'light';

            if (currentTheme === 'dark') {
                newTheme = 'light';
                htmlElement.removeAttribute('data-theme');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            } else {
                newTheme = 'dark';
                htmlElement.setAttribute('data-theme', 'dark');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            }

            localStorage.setItem('theme', newTheme);

            // Re-render particles color if canvas exists
            if (typeof particles !== 'undefined') {
                // Trigger resize to clear canvas and redraw with new color intent
                // (handled in draw loop by checks)
            }
        });
    }

    // 9. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (using animate for smoothness)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover Effect
    const interactiveElements = document.querySelectorAll('a, button, .card, .bento-item, .glass-card, .btn, .project-card, .skill-category');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    console.log("Portfolio scripts loaded successfully.");
});
