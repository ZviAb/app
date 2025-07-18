import React, { useState } from 'react';
import { Calendar, Clock, User, Building2, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
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

  const mockStats = {
    totalAppointments: 24,
    todayAppointments: 3,
    thisWeekAppointments: 12,
    totalClients: 18
  };

  const isBusinessUser = user.role === 'business';

  const tabs = isBusinessUser ? [
    { id: 'overview', name: t('dashboard.overview'), icon: Building2 },
    { id: 'appointments', name: t('nav.appointments'), icon: Calendar },
    { id: 'clients', name: t('nav.clients'), icon: Users },
    { id: 'settings', name: t('nav.settings'), icon: Edit }
  ] : [
    { id: 'overview', name: t('dashboard.overview'), icon: User },
    { id: 'appointments', name: t('nav.myAppointments'), icon: Calendar },
    { id: 'settings', name: t('nav.profile'), icon: Edit }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('dashboard.welcomeBack')}, {user.firstName || user.email}!
        </h1>
        <p className={`text-gray-600 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isBusinessUser 
            ? t('dashboard.manageBusinessDesc')
            : t('dashboard.manageAppointmentsDesc')
          }
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className={`flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'} px-6`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <tab.icon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div className={isRTL ? 'mr-4' : 'ml-4'}>
                      <p className={`text-sm font-medium text-blue-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('dashboard.totalAppointments')}
                      </p>
                      <p className="text-2xl font-bold text-blue-900">{mockStats.totalAppointments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className={isRTL ? 'mr-4' : 'ml-4'}>
                      <p className={`text-sm font-medium text-green-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('dashboard.today')}
                      </p>
                      <p className="text-2xl font-bold text-green-900">{mockStats.todayAppointments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div className={isRTL ? 'mr-4' : 'ml-4'}>
                      <p className={`text-sm font-medium text-purple-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('dashboard.thisWeek')}
                      </p>
                      <p className="text-2xl font-bold text-purple-900">{mockStats.thisWeekAppointments}</p>
                    </div>
                  </div>
                </div>

                {isBusinessUser && (
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-8 w-8 text-orange-600" />
                      <div className={isRTL ? 'mr-4' : 'ml-4'}>
                        <p className={`text-sm font-medium text-orange-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('dashboard.totalClients')}
                        </p>
                        <p className="text-2xl font-bold text-orange-900">{mockStats.totalClients}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Appointments */}
              <div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.recentAppointments')}
                </h3>
                <div className="space-y-3">
                  {mockAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`bg-blue-100 p-2 rounded-lg ${isRTL ? 'ml-4' : 'mr-4'}`}>
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className={`font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isBusinessUser ? appointment.clientName : appointment.serviceName}
                          </p>
                          <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {formatDate(appointment.date)} {t('common.at')} {appointment.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {t(`status.${appointment.status}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isBusinessUser ? t('dashboard.allAppointments') : t('nav.myAppointments')}
                </h3>
                {!isBusinessUser && (
                  <button className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}>
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('dashboard.bookNew')}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {isBusinessUser ? t('common.client') : t('booking.service')}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {t('common.dateTime')}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {t('common.status')}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isBusinessUser ? appointment.clientName : appointment.serviceName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {formatDate(appointment.date)} {t('common.at')} {appointment.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {t(`status.${appointment.status}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <button className="text-blue-600 hover:text-blue-900 p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients Tab (Business Only) */}
          {activeTab === 'clients' && isBusinessUser && (
            <div className="space-y-6">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.clientManagement')}
                </h3>
                <button className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}>
                  <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('dashboard.addClient')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['John Doe', 'Jane Smith', 'Mike Johnson'].map((clientName, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`bg-blue-100 p-3 rounded-full ${isRTL ? 'ml-4' : 'mr-4'}`}>
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className={`font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {clientName}
                        </h4>
                        <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                          client@example.com
                        </p>
                      </div>
                    </div>
                    <div className={`space-y-2 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p>{t('dashboard.totalAppointmentsCount')}</p>
                      <p>{t('dashboard.lastVisit')}</p>
                      <p>{t('dashboard.nextAppointment')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isBusinessUser ? t('dashboard.businessSettings') : t('dashboard.profileSettings')}
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dashboard.settingsDesc')}
                </p>
                <ul className={`mt-3 space-y-1 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <li>• {t('dashboard.profileInfo')}</li>
                  <li>• {t('dashboard.emailPrefs')}</li>
                  <li>• {t('dashboard.notifications')}</li>
                  {isBusinessUser && (
                    <>
                      <li>• {t('dashboard.businessHours')}</li>
                      <li>• {t('dashboard.serviceConfig')}</li>
                      <li>• {t('dashboard.googleCalendar')}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;