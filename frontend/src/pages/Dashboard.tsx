import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, FileText, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { t } = useLanguage();

  const completedApprovals = state.approvals.filter(a => a.status === 'approved').length;
  const pendingApprovals = state.approvals.filter(a => a.status !== 'approved').length;
  const totalApprovals = state.approvals.length;

  const getComplianceHealthScore = () => {
    if (totalApprovals === 0) return 0;
    const completionRate = (completedApprovals / totalApprovals) * 100;
    
    if (completionRate >= 80) return 'Excellent';
    if (completionRate >= 60) return 'Good';
    if (completionRate >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getHealthScoreColor = (score: string) => {
    switch (score) {
      case 'Excellent': return 'text-green-600 bg-green-50';
      case 'Good': return 'text-blue-600 bg-blue-50';
      case 'Fair': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const upcomingEvents = state.events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= oneWeek && !event.completed;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentActivity = [
    { action: 'Updated GST Registration status to Submitted', time: '2 hours ago', type: 'approval' },
    { action: 'Added Fire NOC Renewal to calendar', time: '1 day ago', type: 'calendar' },
    { action: 'Saved PMEGP scheme for review', time: '2 days ago', type: 'scheme' },
    { action: 'Completed Company Registration documents', time: '3 days ago', type: 'document' },
  ];

  const quickActions = [
    {
      title: t('dashboard.continueSetup'),
      description: t('dashboard.continueSetupDesc'),
      icon: Zap,
      link: '/wizard',
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.trackApprovals'),
      description: t('dashboard.trackApprovalsDesc'),
      icon: CheckCircle,
      link: '/tracker',
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.findSchemes'),
      description: t('dashboard.findSchemesDesc'),
      icon: TrendingUp,
      link: '/schemes',
      color: 'bg-purple-500',
    },
    {
      title: t('dashboard.viewCalendar'),
      description: t('dashboard.viewCalendarDesc'),
      icon: Calendar,
      link: '/calendar',
      color: 'bg-orange-500',
    },
  ];

  const renderWelcomeSection = () => {
    if (!state.user) {
      return (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">{t('dashboard.welcomeNew')}</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('dashboard.welcomeNewDesc')}
            </p>
            <Link to="/wizard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                {t('landing.hero.cta')}
              </Button>
            </Link>
          </div>
        </Card>
      );
    }

    const healthScore = getComplianceHealthScore();
    const healthScoreClass = getHealthScoreColor(healthScore);

    return (
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('dashboard.welcome')}, {state.user.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {state.user.company} • {state.user.businessType}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${healthScoreClass}`}>
            {t('dashboard.complianceHealth')}: {healthScore}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{completedApprovals}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.completed')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{pendingApprovals}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.pending')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{state.schemes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.savedSchemes')}</div>
          </div>
        </div>

        {totalApprovals > 0 && (
          <div className="mt-6">
            <ProgressBar current={completedApprovals} total={totalApprovals} />
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container">
        {/* Welcome Section */}
        <div className="mb-8">
          {renderWelcomeSection()}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card hover className="text-center h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <div className={`inline-flex p-3 rounded-xl ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.recentActivity')}</h3>
                <Link to="/tracker" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                  {t('tracker.viewAll')}
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'approval' ? 'bg-green-500' :
                      activity.type === 'calendar' ? 'bg-blue-500' :
                      activity.type === 'scheme' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progress Overview */}
            {totalApprovals > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.approvalProgress')}</h3>
                <div className="space-y-4">
                  {state.approvals.slice(0, 5).map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {approval.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{approval.department}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {approval.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : approval.status === 'under-review' ? (
                          <Clock className="h-5 w-5 text-orange-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          approval.status === 'approved' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          approval.status === 'under-review' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {approval.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                  {state.approvals.length > 5 && (
                    <Link to="/tracker" className="block text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium pt-2">
                      {t('tracker.viewAll')} {state.approvals.length} approvals →
                    </Link>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.upcomingDeadlines')}</h3>
                <Link to="/calendar" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <Calendar className="h-5 w-5" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.noUpcomingDeadlines')}</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.priority === 'high' ? 'bg-red-500' :
                        event.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {upcomingEvents.length > 0 && (
                <Link to="/calendar">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    {t('dashboard.viewCalendar')}
                  </Button>
                </Link>
              )}
            </Card>

            {/* Saved Schemes */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.savedSchemes')}</h3>
                <Link to="/schemes" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <TrendingUp className="h-5 w-5" />
                </Link>
              </div>
              <div className="space-y-3">
                {state.schemes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.noSavedSchemes')}</p>
                ) : (
                  state.schemes.slice(0, 3).map((scheme) => (
                    <div key={scheme.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                        {scheme.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{scheme.loanAmount}</p>
                    </div>
                  ))
                )}
              </div>
              <Link to="/schemes">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  {t('dashboard.exploreSchemes')}
                </Button>
              </Link>
            </Card>

            {/* Help & Support */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.needHelp')}</h3>
              <div className="space-y-3">
                <Link to="/chat">
                  <Button variant="outline" size="sm" className="w-full justify-start" icon={FileText}>
                    {t('dashboard.aiAssistant')}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={FileText}>
                  {t('dashboard.helpCenter')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={FileText}>
                  {t('dashboard.contactSupport')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;