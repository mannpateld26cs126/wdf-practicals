document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');

    if (nav) {
        const navToggle = nav.querySelector('.nav-toggle');
        const navLinks = nav.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('is-open');
                navToggle.setAttribute('aria-expanded', String(isOpen));
                navToggle.classList.toggle('is-open', isOpen);
            });
        }
    }

    const loginForm = document.querySelector('.login-form');
    const registrationForm = document.querySelector('.registration-form');

    const getErrorMessageEl = (field) => {
        const formGroup = field.closest('.form-group');

        if (!formGroup) {
            return null;
        }

        return formGroup.querySelector('.error-message');
    };

    const setFieldError = (field, message) => {
        const errorMessageEl = getErrorMessageEl(field);

        if (errorMessageEl) {
            errorMessageEl.textContent = message;
        }

        field.classList.add('input-error');
        field.setAttribute('aria-invalid', 'true');
    };

    const clearFieldError = (field) => {
        const errorMessageEl = getErrorMessageEl(field);

        if (errorMessageEl) {
            errorMessageEl.textContent = '';
        }

        field.classList.remove('input-error');
        field.setAttribute('aria-invalid', 'false');
    };

    const isEmailValid = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    };

    const isDateValid = (value) => {
        const date = new Date(value);
        return value && !Number.isNaN(date.getTime());
    };

    const isFutureDate = (value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    };

    const validateLoginForm = () => {
        const enrollmentInput = loginForm.querySelector('#enrollment');
        const passwordInput = loginForm.querySelector('#password');
        let isValid = true;

        if (!enrollmentInput.value.trim()) {
            setFieldError(enrollmentInput, 'Enrollment number is required.');
            isValid = false;
        } else if (!/^\d{10}$/.test(enrollmentInput.value.trim())) {
            setFieldError(enrollmentInput, 'Enter a valid 10-digit enrollment number.');
            isValid = false;
        } else {
            clearFieldError(enrollmentInput);
        }

        if (!passwordInput.value.trim()) {
            setFieldError(passwordInput, 'Password is required.');
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            setFieldError(passwordInput, 'Password must be at least 6 characters.');
            isValid = false;
        } else {
            clearFieldError(passwordInput);
        }

        return isValid;
    };

    const validateRegistrationForm = () => {
        const fullNameInput = registrationForm.querySelector('#full-name');
        const enrollmentInput = registrationForm.querySelector('#enrollment');
        const emailInput = registrationForm.querySelector('#email');
        const phoneInput = registrationForm.querySelector('#phone');
        const birthdayInput = registrationForm.querySelector('#birthday');
        const passwordInput = registrationForm.querySelector('#password');
        const confirmPasswordInput = registrationForm.querySelector('#confirm-password');

        let isValid = true;

        if (!fullNameInput.value.trim()) {
            setFieldError(fullNameInput, 'Full name is required.');
            isValid = false;
        } else if (fullNameInput.value.trim().length < 3) {
            setFieldError(fullNameInput, 'Enter a valid name with at least 3 characters.');
            isValid = false;
        } else {
            clearFieldError(fullNameInput);
        }

        if (!enrollmentInput.value.trim()) {
            setFieldError(enrollmentInput, 'Enrollment number is required.');
            isValid = false;
        } else if (!/^\d{10}$/.test(enrollmentInput.value.trim())) {
            setFieldError(enrollmentInput, 'Enter a valid 10-digit enrollment number.');
            isValid = false;
        } else {
            clearFieldError(enrollmentInput);
        }

        if (!emailInput.value.trim()) {
            setFieldError(emailInput, 'Email address is required.');
            isValid = false;
        } else if (!isEmailValid(emailInput.value)) {
            setFieldError(emailInput, 'Enter a valid email address.');
            isValid = false;
        } else {
            clearFieldError(emailInput);
        }

        if (!phoneInput.value.trim()) {
            setFieldError(phoneInput, 'Phone number is required.');
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneInput.value.trim())) {
            setFieldError(phoneInput, 'Phone number must be exactly 10 digits.');
            isValid = false;
        } else {
            clearFieldError(phoneInput);
        }

        if (!birthdayInput.value.trim()) {
            setFieldError(birthdayInput, 'Birthday is required.');
            isValid = false;
        } else if (!isDateValid(birthdayInput.value)) {
            setFieldError(birthdayInput, 'Enter a valid date for your birthday.');
            isValid = false;
        } else if (isFutureDate(birthdayInput.value)) {
            setFieldError(birthdayInput, 'Birthday cannot be in the future.');
            isValid = false;
        } else {
            clearFieldError(birthdayInput);
        }

        if (!passwordInput.value.trim()) {
            setFieldError(passwordInput, 'Password is required.');
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            setFieldError(passwordInput, 'Password must be at least 6 characters.');
            isValid = false;
        } else {
            clearFieldError(passwordInput);
        }

        if (!confirmPasswordInput.value.trim()) {
            setFieldError(confirmPasswordInput, 'Please confirm your password.');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            setFieldError(confirmPasswordInput, 'Passwords do not match.');
            isValid = false;
        } else {
            clearFieldError(confirmPasswordInput);
        }

        return isValid;
    };

    if (loginForm) {
        const enrollmentInput = loginForm.querySelector('#enrollment');
        const passwordInput = loginForm.querySelector('#password');

        enrollmentInput.addEventListener('input', () => {
            if (enrollmentInput.value.trim()) {
                clearFieldError(enrollmentInput);
            }
        });

        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.trim()) {
                clearFieldError(passwordInput);
            }
        });

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!validateLoginForm()) {
                return;
            }

            loginForm.submit();
        });
    }

    if (registrationForm) {
        const fullNameInput = registrationForm.querySelector('#full-name');
        const enrollmentInput = registrationForm.querySelector('#enrollment');
        const emailInput = registrationForm.querySelector('#email');
        const phoneInput = registrationForm.querySelector('#phone');
        const birthdayInput = registrationForm.querySelector('#birthday');
        const passwordInput = registrationForm.querySelector('#password');
        const confirmPasswordInput = registrationForm.querySelector('#confirm-password');

        [fullNameInput, enrollmentInput, emailInput, phoneInput, birthdayInput, passwordInput, confirmPasswordInput].forEach((field) => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    clearFieldError(field);
                }
            });
        });

        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!validateRegistrationForm()) {
                return;
            }

            registrationForm.submit();
        });
    }
});
