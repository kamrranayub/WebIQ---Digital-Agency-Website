
document.addEventListener('DOMContentLoaded', () => {
    // Unified event delegation
    document.addEventListener('click', e => {
        const { target } = e;
        const actions = {
            mobileMenuBtn: () => toggleMobileMenu(),
            mobileMenuOverlay: () => closeMobileMenu(),
            contactBtn: () => scrollTo('#contact'),
            'filter-btn': () => filterPortfolio(target),
            'fa-facebook': () => openSocial('facebook'),
            'fa-github': () => openSocial('github'),
            'fa-x-twitter': () => openSocial('twitter'),
            'fa-linkedin': () => openSocial('linkedin')
        };

        // Handle anchor links
        if (target.matches('a[href^="#"]')) {
            e.preventDefault();
            scrollTo(target.getAttribute('href'));
        }

        // Handle mobile menu links
        if (target.closest('.mobile-menu')) closeMobileMenu();

        // Execute actions
        Object.keys(actions).forEach(key => {
            if (target.id === key || target.classList.contains(key)) {
                actions[key]();
            }
        });
    });

    // Mobile menu functions
    const toggleMobileMenu = () => {
        const elements = ['mobileMenuBtn', 'mobileMenu', 'mobileMenuOverlay'].map(id => document.getElementById(id));
        const isActive = elements[1].classList.toggle('active');
        elements.forEach(el => el?.classList.toggle('active', isActive));
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        ['mobileMenuBtn', 'mobileMenu', 'mobileMenuOverlay'].forEach(id => 
            document.getElementById(id)?.classList.remove('active')
        );
        document.body.style.overflow = '';
    };

    // Smooth scrolling
    const scrollTo = selector => {
        const element = document.querySelector(selector) || document.getElementById(selector.substring(1));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        else if (selector.includes('#')) window.location.href = `index.html${selector}`;
    };

    // Portfolio filter
    const filterPortfolio = button => {
        const filter = button.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.toggle('active', btn === button)
        );
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const show = filter === 'all' || (item.dataset.category || '').includes(filter);
            item.classList.toggle('hidden', !show);
            item.classList.toggle('visible', show);
        });
    };

    // Social media
    const openSocial = platform => {
        const urls = {
            facebook: 'https://facebook.com/webiq',
            github: 'https://github.com/webiq',
            twitter: 'https://twitter.com/webiq',
            linkedin: 'https://linkedin.com/company/webiq'
        };
        window.open(urls[platform], '_blank');
    };

    // Form handling
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (validateForm(form)) await submitForm(form);
            else showMessage('Please correct the errors above.', 'error');
        });

        form.addEventListener('input', e => clearError(e.target));
        form.addEventListener('blur', e => {
            if (e.target.matches('input, select, textarea')) validateField(e.target);
        }, true);
    }

    // Validation
    const validateForm = form => 
        Array.from(form.querySelectorAll('input, select, textarea')).every(validateField);

    const validateField = field => {
        const { name, value, type, required, checked } = field;
        const val = value.trim();
        
        clearError(field);
        
        const rules = [
            [required && (!val || (type === 'checkbox' && !checked)), 'This field is required.'],
            [name === 'myEmail' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.'],
            [name === 'phone' && val && !/^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, '')), 'Please enter a valid phone number.']
        ];

        for (const [condition, message] of rules) {
            if (condition) {
                showError(field, message);
                return false;
            }
        }
        return true;
    };

    const showError = (field, message) => {
        const errorMap = {
            myname: 'nameError', myEmail: 'emailError', company: 'companyError',
            phone: 'phoneError', budget: 'budgetError', details: 'detailsError', conditions: 'conditionsError'
        };
        const errorEl = document.getElementById(errorMap[field.name]);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        field.classList.add('error');
    };

    const clearError = field => {
        const errorMap = {
            myname: 'nameError', myEmail: 'emailError', company: 'companyError',
            phone: 'phoneError', budget: 'budgetError', details: 'detailsError', conditions: 'conditionsError'
        };
        const errorEl = document.getElementById(errorMap[field.name]);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        field.classList.remove('error');
    };

    const submitForm = async form => {
        const btn = document.getElementById('button1');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>Sending...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            form.reset();
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.scrollIntoView({ behavior: 'smooth' });
        } catch {
            showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    };

    const showMessage = (message, type) => {
        const container = document.getElementById('formMessages');
        if (container) {
            const className = type === 'success' ? 'success-message' : 'error-alert';
            container.innerHTML = `<div class="${className}">${message}</div>`;
            setTimeout(() => container.innerHTML = '', 5000);
        }
    };

    // Scroll effects with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const nav = document.querySelector('nav');
            if (nav) {
                const isScrolled = window.scrollY > 50;
                nav.style.backgroundColor = isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgb(255, 255, 255)';
                nav.style.backdropFilter = isScrolled ? 'blur(10px)' : 'none';
            }
        }, 16);
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver(entries => 
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    document.querySelectorAll('.service-box, .team-box, .work-box, .portfolio-item, .mission-item, .team-member')
        .forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

    // Handle page load with hash
    if (window.location.hash) {
        setTimeout(() => scrollTo(window.location.hash), 100);
    }
});

// Add required styles
const style = document.createElement('style');
style.textContent = `
    .error { border-color: #ff6b6b !important; box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important; }
    .error-message { display: none; }
    .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
    .spinner { border: 2px solid #f3f3f3; border-top: 2px solid rgb(245, 14, 241); border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; display: inline-block; margin-right: 8px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
