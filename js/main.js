document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. STICKY HEADER & SCROLL SPY
       ========================================== */
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        const scrollY = window.pageYOffset;

        // Sticky Header effect
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy: Update active link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset header height
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call


    /* ==========================================
       2. MOBILE MENU TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navBar = document.getElementById('nav-bar');
    const body = document.body;

    const toggleMenu = () => {
        mobileToggle.classList.toggle('open');
        navBar.classList.toggle('open');
        
        // Prevent body scrolling when mobile menu is open
        if (navBar.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navBar.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================
       3. CUSTOM TOAST SYSTEM
       ========================================== */
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Custom SVG icons inside toast
        const iconSvg = type === 'success' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

        toast.innerHTML = `
            <span class="toast-icon">${iconSvg}</span>
            <span class="toast-msg">${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        // Hide and remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            // Allow animation to finish before removing element
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    };


    /* ==========================================
       4. INTERACTIVE FORMS
       ========================================== */
    // Contact Form
    const contactForm = document.getElementById('contact-form-element');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('btn-contact-submit');
            const btnText = submitBtn.querySelector('span');
            
            // Visual loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            
            // Simulate form submission delay
            setTimeout(() => {
                showToast('Thank you! Your inquiry has been received. Our admission office will contact you shortly.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
            }, 1200);
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                showToast(`Successfully subscribed: ${emailInput.value}!`, 'success');
                newsletterForm.reset();
            }
        });
    }


    /* ==========================================
       5. PHOTO GALLERY LIGHTBOX MODAL
       ========================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    const imagesData = [];

    // Extract information from gallery DOM
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.getAttribute('data-title') || img.alt;
        const desc = item.getAttribute('data-desc') || '';
        const src = img.src;
        
        imagesData.push({ src, title, desc });

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        updateLightboxContent();
        lightbox.classList.add('active');
        body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Only unlock body overflow if mobile menu is also closed
        if (!navBar.classList.contains('open')) {
            body.style.overflow = '';
        }
    };

    const updateLightboxContent = () => {
        const currentData = imagesData[currentImageIndex];
        lightboxImg.src = currentData.src;
        lightboxImg.alt = currentData.title;
        lightboxTitle.textContent = currentData.title;
        lightboxDesc.textContent = currentData.desc;
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % imagesData.length;
        updateLightboxContent();
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + imagesData.length) % imagesData.length;
        updateLightboxContent();
    };

    // Lightbox triggers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    // Close on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
});
