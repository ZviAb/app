import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Building2, CheckCircle, AlertCircle, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import LanguageToggle from './components/LanguageToggle';
import AuthPage from './components/AuthPage';
import BusinessHours from './components/BusinessHours';
import BookingFlow from './components/BookingFlow';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navigation = user ? [
    { name: t('nav.dashboard'), id: 'dashboard', icon: Building2 },
    { name: t('nav.bookAppointment'), id: 'booking', icon: Calendar },
    { name: t('nav.businessHours'), id: 'hours', icon: Clock },
  ] : [
    { name: t('nav.home'), id: 'home', icon: Building2 },
    { name: t('nav.login'), id: 'login', icon: User },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isRTL ? 'font-hebrew' : ''}`}>
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xl font-bold text-gray-900`}>
                {t('app.name')}
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              <LanguageToggle />
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <item.icon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {item.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={logout}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.logout')}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2">
                <LanguageToggle />
              </div>
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <item.icon className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {item.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <LogOut className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {t('nav.logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!user && currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
        {!user && currentPage === 'login' && <AuthPage onLogin={login} onRegister={register} />}
        {user && currentPage === 'dashboard' && <Dashboard user={user} />}
        {user && currentPage === 'booking' && <BookingFlow />}
        {currentPage === 'hours' && <BusinessHours businessId={1} />}
      </main>
    </div>
  );
}

// Home Page Component
const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className={`text-5xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('home.title')}
            <span className="block text-blue-600">{t('home.subtitle')}</span>
          </h1>
          <p className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('home.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('login')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {t('home.getStarted')}
            </button>
            <button
              onClick={() => onNavigate('hours')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {t('home.viewDemo')}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <Calendar className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
            <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.easyBooking')}
            </h3>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.easyBookingDesc')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <Clock className="h-12 w-12 text-green-600 mb-4 mx-auto" />
            <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.smartScheduling')}
            </h3>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.smartSchedulingDesc')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <CheckCircle className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
            <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.reliableService')}
            </h3>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('home.reliableServiceDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;