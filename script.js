document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Header Logic
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
            header.classList.remove('bg-transparent');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
            header.classList.add('bg-transparent');
        }
    });

    // Mobile Menu Logic
    const btn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const links = mobileMenu.querySelectorAll('a');

    btn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !btn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Phone Mask
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x[2]) {
                e.target.value = x[1];
            } else {
                e.target.value = '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
            }
        });
    }

    // Privacy Checkbox Logic
    const privacyCheckbox = document.getElementById('privacy-policy');
    const submitBtn = document.getElementById('submit-btn');

    if (privacyCheckbox && submitBtn) {
        privacyCheckbox.addEventListener('change', () => {
            if (privacyCheckbox.checked) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-slate-300', 'cursor-not-allowed', 'shadow-none');
                submitBtn.classList.add('bg-primary', 'hover:bg-blue-700', 'shadow-lg', 'cursor-pointer', 'transform', 'hover:-translate-y-0.5');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.add('bg-slate-300', 'cursor-not-allowed', 'shadow-none');
                submitBtn.classList.remove('bg-primary', 'hover:bg-blue-700', 'shadow-lg', 'cursor-pointer', 'transform', 'hover:-translate-y-0.5');
            }
        });
    }

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.remove('hidden');
        setTimeout(() => {
            cookieBanner.classList.remove('translate-y-full');
        }, 100);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.add('translate-y-full');
            setTimeout(() => {
                cookieBanner.classList.add('hidden');
            }, 500);
        });
    }

    // Form Handling with AJAX
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Loading State
            submitBtn.disabled = true;
            submitBtn.innerText = 'Отправка...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            try {
                const formData = new FormData(form);
                const response = await fetch('sendmail.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success State
                    submitBtn.innerText = 'Отправлено!';
                    submitBtn.classList.remove('bg-primary', 'hover:bg-blue-700');
                    submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                    form.reset();

                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-green-500', 'hover:bg-green-600');
                        submitBtn.classList.add('bg-primary', 'hover:bg-blue-700');
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Error:', error);
                // Error State
                submitBtn.innerText = 'Ошибка!';
                submitBtn.classList.remove('bg-primary', 'hover:bg-blue-700');
                submitBtn.classList.add('bg-red-500', 'hover:bg-red-600');

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-red-500', 'hover:bg-red-600');
                    submitBtn.classList.add('bg-primary', 'hover:bg-blue-700');
                }, 3000);
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    document.querySelectorAll('section > div, section h2, .grid > div').forEach((el) => {
        el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });
});
