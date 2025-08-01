import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../UI/Button';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Thanks for subscribing! 🎉', type: 'success' }
      });
      window.dispatchEvent(event);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-2 rounded-xl">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LaunchMate</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Simplifying startup compliance in Delhi. Your one-stop solution for licenses, approvals, and government schemes.
            </p>
            <p className="text-xs text-gray-500">
              {t('footer.made_by')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.links.home')}
              </Link>
              <Link to="/wizard" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('nav.wizard')}
              </Link>
              <Link to="/schemes" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('nav.schemes')}
              </Link>
              <Link to="/chat" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('nav.chat')}
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">{t('footer.legal') || 'Legal'}</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.links.privacy')}
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.links.terms')}
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.links.contact')}
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.links.support')}
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletter.subtitle')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.placeholder')}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                {t('footer.newsletter.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;