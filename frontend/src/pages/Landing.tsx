import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Shield, Award, TrendingUp, Zap, Calendar, FileText, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Landing: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('features.setup.title'),
      description: t('features.setup.desc'),
    },
    {
      icon: CheckCircle,
      title: t('features.tracker.title'),
      description: t('features.tracker.desc'),
    },
    {
      icon: TrendingUp,
      title: t('features.schemes.title'),
      description: t('features.schemes.desc'),
    },
    {
      icon: Calendar,
      title: t('features.calendar.title'),
      description: t('features.calendar.desc'),
    },
  ];

  const stats = [
    { number: '10,000+', label: t('landing.hero.heroStats.startups') },
    { number: '₹2.5L', label: t('landing.hero.heroStats.savings') },
    { number: '15+', label: t('landing.hero.heroStats.departments') },
    { number: '60%', label: t('landing.hero.heroStats.faster') },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 transition-colors">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/wizard">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                  {t('landing.hero.cta')}
                </Button>
              </Link>
              <a href="https://drive.google.com/file/d/1234567890/view" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-gray-900 border-gray-300 hover:bg-gray-100 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
                  {t('landing.hero.demo')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 transition-colors">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                    <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-green-100 dark:bg-green-900 rounded-2xl">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('landing.benefits.trusted')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('landing.benefits.trustedDesc')}
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">50K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('landing.benefits.users')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    <Award className="h-6 w-6 mx-auto" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('landing.benefits.certified')}</div>
                </div>
              </div>
            </Card>

            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900 rounded-2xl">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Expert Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get guidance from compliance experts and successful entrepreneurs
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            </Card>

            <Card className="text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-orange-100 dark:bg-orange-900 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Growth Focused
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Tools and insights to help your startup scale beyond compliance
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹10Cr+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Funding Enabled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">500+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Schemes</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-800 dark:to-blue-800 transition-colors">
          <div className="container">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('landing.benefits.ready')}
              </h2>
              <p className="text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('landing.benefits.readyDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/wizard">
                  <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                    {t('landing.benefits.getStarted')}
                  </Button>
                </Link>
                <Link to="/schemes">
                  <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900">
                    {t('landing.benefits.explore')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default Landing;