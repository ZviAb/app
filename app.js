// Main application JavaScript
class AppointmentApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.isLogin = true;
        this.selectedDate = '';
        this.selectedSlot = '';
        this.bookingStep = 1;
        
        this.init();
    }
    
    init() {
        // Initialize language
        initializeLanguage();
        
        // Check authentication status
        this.checkAuthStatus();
        
        // Bind event listeners
        this.bindEvents();
        
        // Show initial page
        this.showPage(this.currentPage);
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
        }, 500);
    }
    
    bindEvents() {
        // Language toggle
        document.getElementById('languageToggle').addEventListener('click', () => {
            const currentLang = getCurrentLanguage();
            const newLang = currentLang === 'en' ? 'he' : 'en';
            setLanguage(newLang);
            document.getElementById('languageText').textContent = newLang === 'en' ? 'עב' : 'EN';
        });
        
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page') || e.target.closest('[data-page]').getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.getElementById('navMenu').classList.toggle('active');
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // Auth form events
        this.bindAuthEvents();
        
        // Booking events
        this.bindBookingEvents();
        
        // Dashboard events
        this.bindDashboardEvents();
    }
    
    bindAuthEvents() {
        const authForm = document.getElementById('authForm');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const passwordToggle = document.getElementById('passwordToggle');
        const roleSelect = document.getElementById('role');
        
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        authSwitchBtn.addEventListener('click', () => {
            this.toggleAuthMode();
        });
        
        passwordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
        
        roleSelect.addEventListener('change', (e) => {
            const businessNameField = document.getElementById('businessNameField');
            if (e.target.value === 'business') {
                businessNameField.classList.remove('hidden');
            } else {
                businessNameField.classList.add('hidden');
            }
        });
    }
    
    bindBookingEvents() {
        const dateInput = document.getElementById('dateInput');
        const backToDateBtn = document.getElementById('backToDateBtn');
        const backToTimeBtn = document.getElementById('backToTimeBtn');
        const confirmBookingBtn = document.getElementById('confirmBookingBtn');
        const bookAnotherBtn = document.getElementById('bookAnotherBtn');
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        dateInput.addEventListener('change', (e) => {
            this.selectedDate = e.target.value;
            if (this.selectedDate) {
                this.loadAvailableSlots();
                this.setBookingStep(2);
            }
        });
        
        backToDateBtn.addEventListener('click', () => {
            this.setBookingStep(1);
        });
        
        backToTimeBtn.addEventListener('click', () => {
            this.setBookingStep(2);
        });
        
        confirmBookingBtn.addEventListener('click', () => {
            this.bookAppointment();
        });
        
        bookAnotherBtn.addEventListener('click', () => {
            this.resetBooking();
        });
    }
    
    bindDashboardEvents() {
        // Dashboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.showDashboardTab(tabId);
            });
        });
    }
    
    checkAuthStatus() {
        const savedUser = localStorage.getItem('demo_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateNavigation();
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('demo_user');
            }
        }
    }
    
    updateNavigation() {
        const guestNav = document.getElementById('navLinks');
        const authNav = document.getElementById('authNavLinks');
        
        if (this.currentUser) {
            guestNav.classList.add('hidden');
            authNav.classList.remove('hidden');
            
            // Update dashboard subtitle based on user role
            const dashboardSubtitle = document.getElementById('dashboardSubtitle');
            if (dashboardSubtitle) {
                const key = this.currentUser.role === 'business' 
                    ? 'dashboard.manageBusinessDesc' 
                    : 'dashboard.manageAppointmentsDesc';
                dashboardSubtitle.setAttribute('data-key', key);
                dashboardSubtitle.textContent = t(key);
            }
        } else {
            guestNav.classList.remove('hidden');
            authNav.classList.add('hidden');
        }
    }
    
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.classList.add('hidden');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.classList.remove('hidden');
            this.currentPage = pageId;
            
            // Update navigation active state
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            document.querySelectorAll(`[data-page="${pageId}"]`).forEach(link => {
                if (link.classList.contains('nav-link')) {
                    link.classList.add('active');
                }
            });
            
            // Load page-specific data
            this.loadPageData(pageId);
        }
    }
    
    loadPageData(pageId) {
        switch (pageId) {
            case 'hours':
                this.loadBusinessHours();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'booking':
                this.resetBooking();
                break;
        }
    }
    
    toggleAuthMode() {
        this.isLogin = !this.isLogin;
        
        const authTitle = document.getElementById('authTitle');
        const authSubtitle = document.getElementById('authSubtitle');
        const authSwitchQuestion = document.getElementById('authSwitchQuestion');
        const authSwitchBtn = document.getElementById('authSwitchBtn');
        const authSubmitBtn = document.getElementById('authSubmitBtn');
        const nameFields = document.getElementById('nameFields');
        const roleField = document.getElementById('roleField');
        const businessNameField = document.getElementById('businessNameField');
        
        if (this.isLogin) {
            // Switch to login mode
            authTitle.setAttribute('data-key', 'auth.welcomeBack');
            authSubtitle.setAttribute('data-key', 'auth.signInToAccount');
            authSwitchQuestion.setAttribute('data-key', 'auth.noAccount');
            authSwitchBtn.setAttribute('data-key', 'auth.signUp');
            authSubmitBtn.querySelector('.btn-text').setAttribute('data-key', 'auth.signIn');
            
            nameFields.classList.add('hidden');
            roleField.classList.add('hidden');
            businessNameField.classList.add('hidden');
        } else {
            // Switch to register mode
            authTitle.setAttribute('data-key', 'auth.createAccount');
            authSubtitle.setAttribute('data-key', 'auth.joinPlatform');
            authSwitchQuestion.setAttribute('data-key', 'auth.haveAccount');
            authSwitchBtn.setAttribute('data-key', 'auth.signIn');
            authSubmitBtn.querySelector('.btn-text').setAttribute('data-key', 'auth.createAccount');
            
            nameFields.classList.remove('hidden');
            roleField.classList.remove('hidden');
        }
        
        // Update translations
        updatePageTranslations();
        
        // Clear form
        document.getElementById('authForm').reset();
        this.hideError();
    }
    
    async handleAuth() {
        const form = document.getElementById('authForm');
        const formData = new FormData(form);
        const submitBtn = document.getElementById('authSubmitBtn');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-spinner').style.display = 'flex';
        
        this.hideError();
        
        try {
            if (this.isLogin) {
                await this.login(formData.get('email'), formData.get('password'));
            } else {
                await this.register({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    role: formData.get('role'),
                    businessName: formData.get('businessName')
                });
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'block';
            submitBtn.querySelector('.btn-spinner').style.display = 'none';
        }
    }
    
    async login(email, password) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo login logic
        const demoUser = {
            id: 1,
            email,
            role: email.includes('business') ? 'business' : 'client',
            firstName: 'Demo',
            lastName: 'User',
            businessName: email.includes('business') ? 'Demo Business' : undefined
        };
        
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        this.currentUser = demoUser;
        this.updateNavigation();
        this.showPage('dashboard');
    }
    
    async register(data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo registration logic
        const newUser = {
            id: Date.now(),
            email: data.email,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            businessName: data.businessName
        };
        
        localStorage.setItem('demo_user', JSON.stringify(newUser));
        this.currentUser = newUser;
        this.updateNavigation();
        this.showPage('dashboard');
    }
    
    logout() {
        localStorage.removeItem('demo_user');
        this.currentUser = null;
        this.updateNavigation();
        this.showPage('home');
    }
    
    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }
    
    async loadBusinessHours() {
        try {
            const hoursLoading = document.getElementById('hoursLoading');
            const hoursError = document.getElementById('hoursError');
            const hoursContent = document.getElementById('hoursContent');
            
            // Show loading briefly for demo
            if (hoursLoading) hoursLoading.classList.remove('hidden');
            if (hoursError) hoursError.classList.add('hidden');
            if (hoursContent) hoursContent.classList.add('hidden');
            
            // Simulate brief loading
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock business hours data
            const mockHours = [
                {
                    day_of_week: 0,
                    available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
                    is_fragmented: false
                },
                {
                    day_of_week: 1,
                    available_ranges: [
                        { start_time: '09:00', end_time: '12:00' },
                        { start_time: '13:00', end_time: '17:00' }
                    ],
                    is_fragmented: true
                },
                {
                    day_of_week: 2,
                    available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
                    is_fragmented: false
                },
                {
                    day_of_week: 3,
                    available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
                    is_fragmented: false
                },
                {
                    day_of_week: 4,
                    available_ranges: [{ start_time: '09:00', end_time: '15:00' }],
                    is_fragmented: false
                },
                {
                    day_of_week: 5,
                    available_ranges: [],
                    is_fragmented: false
                },
                {
                    day_of_week: 6,
                    available_ranges: [],
                    is_fragmented: false
                }
            ];
            
            this.renderBusinessHours(mockHours);
            
            if (hoursLoading) hoursLoading.classList.add('hidden');
            if (hoursContent) hoursContent.classList.remove('hidden');
            
        } catch (error) {
            const hoursLoading = document.getElementById('hoursLoading');
            const hoursError = document.getElementById('hoursError');
            if (hoursLoading) hoursLoading.classList.add('hidden');
            if (hoursError) hoursError.classList.remove('hidden');
        }
    }
    
    renderBusinessHours(hours) {
        const hoursList = document.getElementById('hoursList');
        const dayNames = ['day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday', 'day.sunday'];
        
        hoursList.innerHTML = '';
        
        dayNames.forEach((dayKey, index) => {
            const dayHours = hours.find(h => h.day_of_week === index);
            const isOpen = dayHours && dayHours.available_ranges.length > 0;
            
            const hoursItem = document.createElement('div');
            hoursItem.className = 'hours-item';
            
            hoursItem.innerHTML = `
                <div class="hours-day">
                    <div class="hours-status ${isOpen ? 'open' : 'closed'}"></div>
                    <span>${t(dayKey)}</span>
                </div>
                <div class="hours-times">
                    ${isOpen 
                        ? dayHours.available_ranges.map(range => 
                            `<span class="hours-time">${range.start_time} - ${range.end_time}</span>`
                          ).join('')
                        : `<span class="hours-closed">${t('hours.closed')}</span>`
                    }
                </div>
            `;
            
            hoursList.appendChild(hoursItem);
        });
    }
    
    async loadAvailableSlots() {
        const slotsLoading = document.getElementById('slotsLoading');
        const slotsError = document.getElementById('slotsError');
        const timeSlots = document.getElementById('timeSlots');
        const selectedDateText = document.getElementById('selectedDateText');
        
        // Update selected date text
        const formattedDate = new Date(this.selectedDate).toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedDateText.textContent = `${t('booking.availableSlotsFor')} ${formattedDate}`;
        
        // Show loading
        slotsLoading.classList.remove('hidden');
        slotsError.classList.add('hidden');
        timeSlots.innerHTML = '';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Generate mock time slots
            const selectedDate = new Date(this.selectedDate);
            const dayOfWeek = selectedDate.getDay();
            
            // Don't show slots for weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                slotsLoading.classList.add('hidden');
                slotsError.classList.remove('hidden');
                document.getElementById('slotsErrorText').textContent = t('booking.noSlots');
                return;
            }
            
            // Generate time slots from 9 AM to 5 PM, every 30 minutes
            const mockSlots = [];
            for (let hour = 9; hour < 17; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const datetime = `${this.selectedDate}T${timeString}:00`;
                    
                    mockSlots.push({
                        time: timeString,
                        datetime: datetime
                    });
                }
            }
            
            // Remove some random slots to simulate bookings
            const availableSlots = mockSlots.filter(() => Math.random() > 0.3);
            
            this.renderTimeSlots(availableSlots);
            
            slotsLoading.classList.add('hidden');
            
        } catch (error) {
            slotsLoading.classList.add('hidden');
            slotsError.classList.remove('hidden');
            document.getElementById('slotsErrorText').textContent = t('booking.loadingTimes');
        }
    }
    
    renderTimeSlots(slots) {
        const timeSlots = document.getElementById('timeSlots');
        
        if (slots.length === 0) {
            timeSlots.innerHTML = `
                <div class="slots-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>${t('booking.noSlots')}</span>
                </div>
            `;
            return;
        }
        
        timeSlots.innerHTML = '';
        
        slots.forEach(slot => {
            const slotBtn = document.createElement('button');
            slotBtn.className = 'time-slot';
            slotBtn.textContent = slot.time;
            slotBtn.addEventListener('click', () => {
                this.selectTimeSlot(slot.datetime, slotBtn);
            });
            
            timeSlots.appendChild(slotBtn);
        });
    }
    
    selectTimeSlot(datetime, buttonElement) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select current slot
        buttonElement.classList.add('selected');
        this.selectedSlot = datetime;
        
        // Move to confirmation step
        setTimeout(() => {
            this.setBookingStep(3);
        }, 300);
    }
    
    setBookingStep(step) {
        this.bookingStep = step;
        
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            if (index + 1 < step) {
                stepEl.classList.add('completed');
                stepEl.classList.remove('active');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('completed');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });
        
        // Show/hide booking steps
        document.querySelectorAll('.booking-step').forEach((stepEl, index) => {
            if (index + 1 === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('hidden');
            } else {
                stepEl.classList.remove('active');
                stepEl.classList.add('hidden');
            }
        });
        
        // Update booking summary if on step 3
        if (step === 3) {
            this.updateBookingSummary();
        }
    }
    
    updateBookingSummary() {
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        
        const formattedDate = new Date(this.selectedDate).toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = new Date(this.selectedSlot).toLocaleTimeString('he-IL', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
        
        summaryDate.textContent = formattedDate;
        summaryTime.textContent = formattedTime;
    }
    
    async bookAppointment() {
        if (!this.selectedSlot) {
            this.showBookingError(t('booking.selectTimeSlot'));
            return;
        }
        
        const confirmBtn = document.getElementById('confirmBookingBtn');
        
        // Show loading state
        confirmBtn.disabled = true;
        confirmBtn.querySelector('.btn-text').style.display = 'none';
        confirmBtn.querySelector('.btn-spinner').style.display = 'flex';
        
        this.hideBookingError();
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success - move to step 4
            this.setBookingStep(4);
            this.updateSuccessMessage();
            
        } catch (error) {
            this.showBookingError('Failed to book appointment. Please try again.');
        } finally {
            // Hide loading state
            confirmBtn.disabled = false;
            confirmBtn.querySelector('.btn-text').style.display = 'block';
            confirmBtn.querySelector('.btn-spinner').style.display = 'none';
        }
    }
    
    updateSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        const formattedDate = new Date(this.selectedDate).toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = new Date(this.selectedSlot).toLocaleTimeString('he-IL', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
        
        successMessage.textContent = `${t('booking.successMessage')} ${formattedDate} ${t('common.at')} ${formattedTime}.`;
    }
    
    showBookingError(message) {
        const bookingError = document.getElementById('bookingError');
        const bookingErrorText = document.getElementById('bookingErrorText');
        
        bookingErrorText.textContent = message;
        bookingError.classList.remove('hidden');
    }
    
    hideBookingError() {
        document.getElementById('bookingError').classList.add('hidden');
    }
    
    resetBooking() {
        this.selectedDate = '';
        this.selectedSlot = '';
        this.setBookingStep(1);
        
        // Reset form
        document.getElementById('dateInput').value = '';
        document.getElementById('timeSlots').innerHTML = '';
        
        this.hideBookingError();
    }
    
    loadDashboard() {
        if (!this.currentUser) {
            // For demo purposes, create a demo user if none exists
            this.currentUser = {
                id: 1,
                email: 'demo@example.com',
                role: 'client',
                firstName: 'משתמש',
                lastName: 'דמו'
            };
            this.updateNavigation();
            return;
        }
        
        // Update user name
        const userName = document.getElementById('userName');
        userName.textContent = this.currentUser.firstName || this.currentUser.email;
        
        // Load recent appointments
        this.loadRecentAppointments();
        
        // Load appointments table
        this.loadAppointmentsTable();
    }
    
    loadRecentAppointments() {
        const recentAppointmentsList = document.getElementById('recentAppointmentsList');
        
        // Mock recent appointments
        const mockAppointments = [
            {
                id: 1,
                date: '2025-01-20',
                time: '09:00',
                clientName: 'John Doe',
                serviceName: 'Consultation',
                status: 'confirmed'
            },
            {
                id: 2,
                date: '2025-01-20',
                time: '10:30',
                clientName: 'Jane Smith',
                serviceName: 'Follow-up',
                status: 'pending'
            },
            {
                id: 3,
                date: '2025-01-21',
                time: '14:00',
                clientName: 'Mike Johnson',
                serviceName: 'Initial Meeting',
                status: 'confirmed'
            }
        ];
        
        recentAppointmentsList.innerHTML = '';
        
        mockAppointments.slice(0, 3).forEach(appointment => {
            const appointmentItem = document.createElement('div');
            appointmentItem.className = 'appointment-item';
            
            const formattedDate = new Date(appointment.date).toLocaleDateString('he-IL', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            appointmentItem.innerHTML = `
                <div class="appointment-info">
                    <div class="appointment-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="appointment-details">
                        <h4>${this.currentUser.role === 'business' ? appointment.clientName : appointment.serviceName}</h4>
                        <p>${formattedDate} ${t('common.at')} ${appointment.time}</p>
                    </div>
                </div>
                <span class="status-badge status-${appointment.status}">${t('status.' + appointment.status)}</span>
            `;
            
            recentAppointmentsList.appendChild(appointmentItem);
        });
    }
    
    loadAppointmentsTable() {
        const appointmentsTableBody = document.getElementById('appointmentsTableBody');
        
        // Mock appointments data
        const mockAppointments = [
            {
                id: 1,
                date: '2025-01-20',
                time: '09:00',
                clientName: 'John Doe',
                serviceName: 'Consultation',
                status: 'confirmed'
            },
            {
                id: 2,
                date: '2025-01-20',
                time: '10:30',
                clientName: 'Jane Smith',
                serviceName: 'Follow-up',
                status: 'pending'
            },
            {
                id: 3,
                date: '2025-01-21',
                time: '14:00',
                clientName: 'Mike Johnson',
                serviceName: 'Initial Meeting',
                status: 'confirmed'
            }
        ];
        
        appointmentsTableBody.innerHTML = '';
        
        mockAppointments.forEach(appointment => {
            const tableRow = document.createElement('div');
            tableRow.className = 'table-row';
            
            const formattedDate = new Date(appointment.date).toLocaleDateString('he-IL', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            tableRow.innerHTML = `
                <div class="table-cell" data-label="${t('booking.service')}">
                    ${this.currentUser.role === 'business' ? appointment.clientName : appointment.serviceName}
                </div>
                <div class="table-cell" data-label="${t('common.dateTime')}">
                    ${formattedDate} ${t('common.at')} ${appointment.time}
                </div>
                <div class="table-cell" data-label="${t('common.status')}">
                    <span class="status-badge status-${appointment.status}">${t('status.' + appointment.status)}</span>
                </div>
                <div class="table-cell" data-label="${t('common.actions')}">
                    <div class="table-actions">
                        <button class="action-btn edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            appointmentsTableBody.appendChild(tableRow);
        });
    }
    
    showDashboardTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        
        const targetTab = document.getElementById(tabId + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.classList.remove('hidden');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppointmentApp();
});