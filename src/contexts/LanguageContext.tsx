import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.bookAppointment': 'Book Appointment',
    'nav.businessHours': 'Business Hours',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.clients': 'Clients',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.myAppointments': 'My Appointments',
    
    // Home page
    'home.title': 'Schedule Your Appointments',
    'home.subtitle': 'With Ease',
    'home.description': 'Professional appointment booking system for businesses and clients. Manage your schedule, book services, and never miss an appointment.',
    'home.getStarted': 'Get Started',
    'home.viewDemo': 'View Demo',
    'home.easyBooking': 'Easy Booking',
    'home.easyBookingDesc': 'Simple and intuitive appointment booking with real-time availability.',
    'home.smartScheduling': 'Smart Scheduling',
    'home.smartSchedulingDesc': 'Automated scheduling with business hours and availability management.',
    'home.reliableService': 'Reliable Service',
    'home.reliableServiceDesc': 'Secure authentication and reliable appointment management.',
    
    // Authentication
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.signInToAccount': 'Sign in to your account',
    'auth.joinPlatform': 'Join our appointment platform',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.accountType': 'Account Type',
    'auth.client': 'Client',
    'auth.business': 'Business Owner',
    'auth.businessName': 'Business Name',
    'auth.signIn': 'Sign In',
    'auth.createAccount': 'Create Account',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.signUp': 'Sign up',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.enterBusinessName': 'Enter your business name',
    
    // Business Hours
    'hours.title': 'Business Hours',
    'hours.subtitle': "When we're available for appointments",
    'hours.loading': 'Loading business hours...',
    'hours.error': 'Error loading business hours',
    'hours.closed': 'Closed',
    'hours.notes': 'Important Notes:',
    'hours.timezone': 'All times shown are in local timezone (Asia/Jerusalem)',
    'hours.availability': 'Appointment slots are subject to availability',
    'hours.holidays': 'Holiday hours may vary from regular schedule',
    'hours.bookAdvance': 'Book in advance to secure your preferred time slot',
    
    // Days of week
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    
    // Booking Flow
    'booking.selectDate': 'Select Date',
    'booking.chooseTime': 'Choose Time',
    'booking.confirmBooking': 'Confirm Booking',
    'booking.bookingComplete': 'Booking Complete',
    'booking.selectDateTitle': 'Select a Date',
    'booking.selectDateDesc': 'Choose your preferred appointment date',
    'booking.availableTimes': 'Available Times',
    'booking.availableSlotsFor': 'Available slots for',
    'booking.loadingTimes': 'Loading available times...',
    'booking.noSlots': 'No available slots for this date',
    'booking.chooseDifferentDate': 'Choose a different date',
    'booking.backToDate': 'Back to Date Selection',
    'booking.confirmTitle': 'Confirm Your Appointment',
    'booking.reviewDetails': 'Please review your appointment details',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.service': 'Service',
    'booking.demoService': 'Demo Service',
    'booking.backToTime': 'Back to Time Selection',
    'booking.confirmButton': 'Confirm Booking',
    'booking.booking': 'Booking...',
    'booking.confirmed': 'Booking Confirmed!',
    'booking.successMessage': 'Your appointment has been successfully booked for',
    'booking.whatsNext': "What's next?",
    'booking.confirmationEmail': "You'll receive a confirmation email shortly",
    'booking.addToCalendar': 'Add this appointment to your calendar',
    'booking.manageDashboard': 'You can view and manage your appointments in your dashboard',
    'booking.bookAnother': 'Book Another Appointment',
    'booking.selectTimeSlot': 'Please select a time slot',
    
    // Dashboard
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.manageBusinessDesc': 'Manage your business appointments and clients',
    'dashboard.manageAppointmentsDesc': 'View and manage your upcoming appointments',
    'dashboard.overview': 'Overview',
    'dashboard.appointments': 'Appointments',
    'dashboard.totalAppointments': 'Total Appointments',
    'dashboard.today': 'Today',
    'dashboard.thisWeek': 'This Week',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.recentAppointments': 'Recent Appointments',
    'dashboard.allAppointments': 'All Appointments',
    'dashboard.bookNew': 'Book New',
    'dashboard.clientManagement': 'Client Management',
    'dashboard.addClient': 'Add Client',
    'dashboard.businessSettings': 'Business Settings',
    'dashboard.profileSettings': 'Profile Settings',
    'dashboard.settingsDesc': 'Settings panel would be implemented here with forms for:',
    'dashboard.profileInfo': 'Profile information',
    'dashboard.emailPrefs': 'Email preferences',
    'dashboard.notifications': 'Notification settings',
    'dashboard.businessHours': 'Business hours management',
    'dashboard.serviceConfig': 'Service configuration',
    'dashboard.googleCalendar': 'Google Calendar integration',
    'dashboard.totalAppointmentsCount': 'Total Appointments: 5',
    'dashboard.lastVisit': 'Last Visit: Jan 15, 2025',
    'dashboard.nextAppointment': 'Next Appointment: Jan 22, 2025',
    
    // Status
    'status.confirmed': 'Confirmed',
    'status.pending': 'Pending',
    'status.cancelled': 'Cancelled',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.actions': 'Actions',
    'common.client': 'Client',
    'common.dateTime': 'Date & Time',
    'common.status': 'Status',
    'common.at': 'at',
    
    // App name
    'app.name': 'AppointmentPro'
  },
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.dashboard': 'לוח בקרה',
    'nav.bookAppointment': 'קביעת תור',
    'nav.businessHours': 'שעות פעילות',
    'nav.login': 'התחברות',
    'nav.logout': 'התנתקות',
    'nav.clients': 'לקוחות',
    'nav.settings': 'הגדרות',
    'nav.profile': 'פרופיל',
    'nav.myAppointments': 'התורים שלי',
    
    // Home page
    'home.title': 'קבעו את התורים שלכם',
    'home.subtitle': 'בקלות',
    'home.description': 'מערכת קביעת תורים מקצועית לעסקים ולקוחות. נהלו את לוח הזמנים שלכם, קבעו שירותים ואל תפספסו תור.',
    'home.getStarted': 'התחילו כאן',
    'home.viewDemo': 'צפו בדמו',
    'home.easyBooking': 'קביעת תורים קלה',
    'home.easyBookingDesc': 'קביעת תורים פשוטה ואינטואיטיבית עם זמינות בזמן אמת.',
    'home.smartScheduling': 'תזמון חכם',
    'home.smartSchedulingDesc': 'תזמון אוטומטי עם ניהול שעות פעילות וזמינות.',
    'home.reliableService': 'שירות אמין',
    'home.reliableServiceDesc': 'אימות מאובטח וניהול תורים אמין.',
    
    // Authentication
    'auth.welcomeBack': 'ברוכים השבים',
    'auth.createAccount': 'יצירת חשבון',
    'auth.signInToAccount': 'התחברו לחשבון שלכם',
    'auth.joinPlatform': 'הצטרפו לפלטפורמת התורים שלנו',
    'auth.firstName': 'שם פרטי',
    'auth.lastName': 'שם משפחה',
    'auth.email': 'כתובת אימייל',
    'auth.password': 'סיסמה',
    'auth.accountType': 'סוג חשבון',
    'auth.client': 'לקוח',
    'auth.business': 'בעל עסק',
    'auth.businessName': 'שם העסק',
    'auth.signIn': 'התחברות',
    'auth.createAccount': 'יצירת חשבון',
    'auth.signingIn': 'מתחבר...',
    'auth.creatingAccount': 'יוצר חשבון...',
    'auth.noAccount': 'אין לכם חשבון?',
    'auth.haveAccount': 'יש לכם כבר חשבון?',
    'auth.signUp': 'הרשמה',
    'auth.enterEmail': 'הזינו את האימייל שלכם',
    'auth.enterPassword': 'הזינו את הסיסמה שלכם',
    'auth.enterBusinessName': 'הזינו את שם העסק שלכם',
    
    // Business Hours
    'hours.title': 'שעות פעילות',
    'hours.subtitle': 'מתי אנחנו זמינים לתורים',
    'hours.loading': 'טוען שעות פעילות...',
    'hours.error': 'שגיאה בטעינת שעות הפעילות',
    'hours.closed': 'סגור',
    'hours.notes': 'הערות חשובות:',
    'hours.timezone': 'כל הזמנים מוצגים באזור הזמן המקומי (אסיה/ירושלים)',
    'hours.availability': 'משבצות התורים כפופות לזמינות',
    'hours.holidays': 'שעות החגים עלולות להיות שונות מהלוח הרגיל',
    'hours.bookAdvance': 'קבעו מראש כדי להבטיח את משבצת הזמן המועדפת עליכם',
    
    // Days of week
    'day.monday': 'יום שני',
    'day.tuesday': 'יום שלישי',
    'day.wednesday': 'יום רביעי',
    'day.thursday': 'יום חמישי',
    'day.friday': 'יום שישי',
    'day.saturday': 'יום שבת',
    'day.sunday': 'יום ראשון',
    
    // Booking Flow
    'booking.selectDate': 'בחירת תאריך',
    'booking.chooseTime': 'בחירת שעה',
    'booking.confirmBooking': 'אישור התור',
    'booking.bookingComplete': 'התור נקבע',
    'booking.selectDateTitle': 'בחרו תאריך',
    'booking.selectDateDesc': 'בחרו את התאריך המועדף עליכם לתור',
    'booking.availableTimes': 'שעות זמינות',
    'booking.availableSlotsFor': 'משבצות זמינות עבור',
    'booking.loadingTimes': 'טוען שעות זמינות...',
    'booking.noSlots': 'אין משבצות זמינות לתאריך זה',
    'booking.chooseDifferentDate': 'בחרו תאריך אחר',
    'booking.backToDate': 'חזרה לבחירת תאריך',
    'booking.confirmTitle': 'אשרו את התור שלכם',
    'booking.reviewDetails': 'אנא בדקו את פרטי התור שלכם',
    'booking.date': 'תאריך',
    'booking.time': 'שעה',
    'booking.service': 'שירות',
    'booking.demoService': 'שירות דמו',
    'booking.backToTime': 'חזרה לבחירת שעה',
    'booking.confirmButton': 'אישור התור',
    'booking.booking': 'קובע תור...',
    'booking.confirmed': 'התור אושר!',
    'booking.successMessage': 'התור שלכם נקבע בהצלחה ל',
    'booking.whatsNext': 'מה הלאה?',
    'booking.confirmationEmail': 'תקבלו אימייל אישור בקרוב',
    'booking.addToCalendar': 'הוסיפו את התור הזה ליומן שלכם',
    'booking.manageDashboard': 'תוכלו לצפות ולנהל את התורים שלכם בלוח הבקרה',
    'booking.bookAnother': 'קביעת תור נוסף',
    'booking.selectTimeSlot': 'אנא בחרו משבצת זמן',
    
    // Dashboard
    'dashboard.welcomeBack': 'ברוכים השבים',
    'dashboard.manageBusinessDesc': 'נהלו את תורי העסק והלקוחות שלכם',
    'dashboard.manageAppointmentsDesc': 'צפו ונהלו את התורים הקרובים שלכם',
    'dashboard.overview': 'סקירה כללית',
    'dashboard.appointments': 'תורים',
    'dashboard.totalAppointments': 'סך התורים',
    'dashboard.today': 'היום',
    'dashboard.thisWeek': 'השבוע',
    'dashboard.totalClients': 'סך הלקוחות',
    'dashboard.recentAppointments': 'תורים אחרונים',
    'dashboard.allAppointments': 'כל התורים',
    'dashboard.bookNew': 'קביעת תור חדש',
    'dashboard.clientManagement': 'ניהול לקוחות',
    'dashboard.addClient': 'הוספת לקוח',
    'dashboard.businessSettings': 'הגדרות עסק',
    'dashboard.profileSettings': 'הגדרות פרופיל',
    'dashboard.settingsDesc': 'פאנל ההגדרות יכלול טפסים עבור:',
    'dashboard.profileInfo': 'מידע פרופיל',
    'dashboard.emailPrefs': 'העדפות אימייל',
    'dashboard.notifications': 'הגדרות התראות',
    'dashboard.businessHours': 'ניהול שעות פעילות',
    'dashboard.serviceConfig': 'הגדרת שירותים',
    'dashboard.googleCalendar': 'אינטגרציה עם יומן גוגל',
    'dashboard.totalAppointmentsCount': 'סך התורים: 5',
    'dashboard.lastVisit': 'ביקור אחרון: 15 בינואר, 2025',
    'dashboard.nextAppointment': 'התור הבא: 22 בינואר, 2025',
    
    // Status
    'status.confirmed': 'מאושר',
    'status.pending': 'ממתין',
    'status.cancelled': 'מבוטל',
    
    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
    'common.cancel': 'ביטול',
    'common.save': 'שמירה',
    'common.edit': 'עריכה',
    'common.delete': 'מחיקה',
    'common.actions': 'פעולות',
    'common.client': 'לקוח',
    'common.dateTime': 'תאריך ושעה',
    'common.status': 'סטטוס',
    'common.at': 'ב',
    
    // App name
    'app.name': 'AppointmentPro'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'he')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language);
    
    // Update document direction and language
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};