import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Building, Store, Utensils, Package, Briefcase } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import type { UserData, Approval } from '../contexts/AppContext';

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    companyName: '',
    address: '',
    sector: '',
    investment: '',
    foundersCount: 1,
  });

  const businessTypes = [
    {
      id: 'manufacturing',
      title: t('wizard.business.manufacturing'),
      description: t('wizard.business.manufacturingDesc'),
      icon: Building,
      approvals: ['Udyam Registration', 'DPCC NOC', 'Factory License', 'GST Registration', 'Fire NOC', 'Labor License'],
    },
    {
      id: 'service',
      title: t('wizard.business.service'),
      description: t('wizard.business.serviceDesc'),
      icon: Briefcase,
      approvals: ['Company Registration', 'GST Registration', 'DPIIT Recognition', 'Professional Tax', 'ESI/PF Registration'],
    },
    {
      id: 'food',
      title: t('wizard.business.food'),
      description: t('wizard.business.foodDesc'),
      icon: Utensils,
      approvals: ['FSSAI License', 'Trade License', 'GST Registration', 'Fire NOC', 'Health Permit', 'Water NOC'],
    },
    {
      id: 'export',
      title: t('wizard.business.export'),
      description: t('wizard.business.exportDesc'),
      icon: Package,
      approvals: ['IEC Code', 'GST Registration', 'Company Registration', 'RCMC Certificate', 'Bank Certificate'],
    },
    {
      id: 'retail',
      title: t('wizard.business.retail'),
      description: t('wizard.business.retailDesc'),
      icon: Store,
      approvals: ['Trade License', 'GST Registration', 'Shop & Establishment', 'Fire NOC', 'Signage Permit'],
    },
  ];

  const getApprovalsByBusinessType = (businessType: string): Approval[] => {
    const type = businessTypes.find(t => t.id === businessType);
    if (!type) return [];

    return type.approvals.map((approval, index) => ({
      id: `${businessType}-${index}`,
      name: approval,
      department: getDepartmentByApproval(approval),
      status: 'not-started' as const,
      timeline: getTimelineByApproval(approval),
      priority: index < 3 ? 'high' as const : 'medium' as const,
      requiredDocs: getDocsByApproval(approval),
      estimatedDays: getEstimatedDays(approval),
    }));
  };

  const getDepartmentByApproval = (approval: string): string => {
    const deptMap: Record<string, string> = {
      'Udyam Registration': 'MSME Ministry',
      'DPCC NOC': 'Delhi Pollution Control Committee',
      'Factory License': 'Directorate of Industries',
      'GST Registration': 'GST Department',
      'Fire NOC': 'Delhi Fire Service',
      'Labor License': 'Labor Department',
      'Company Registration': 'Ministry of Corporate Affairs',
      'DPIIT Recognition': 'DPIIT',
      'Professional Tax': 'Delhi Government',
      'ESI/PF Registration': 'EPFO',
      'FSSAI License': 'Food Safety Authority',
      'Trade License': 'Municipal Corporation',
      'Health Permit': 'Health Department',
      'Water NOC': 'DJB',
      'IEC Code': 'DGFT',
      'RCMC Certificate': 'Export Promotion Council',
      'Bank Certificate': 'RBI',
      'Shop & Establishment': 'Labor Department',
      'Signage Permit': 'Municipal Corporation',
    };
    return deptMap[approval] || 'Government Department';
  };

  const getTimelineByApproval = (approval: string): string => {
    const timelineMap: Record<string, string> = {
      'Udyam Registration': '1-2 days',
      'GST Registration': '3-7 days',
      'Company Registration': '10-15 days',
      'FSSAI License': '15-30 days',
      'Factory License': '30-45 days',
      'Fire NOC': '15-30 days',
      'Trade License': '7-15 days',
      'DPIIT Recognition': '45-60 days',
    };
    return timelineMap[approval] || '7-15 days';
  };

  const getDocsByApproval = (approval: string): string[] => {
    const docsMap: Record<string, string[]> = {
      'Udyam Registration': ['Aadhaar Card', 'PAN Card', 'Bank Statement'],
      'GST Registration': ['PAN Card', 'Aadhaar Card', 'Bank Certificate', 'Business Address Proof'],
      'Company Registration': ['PAN Card', 'Aadhaar Card', 'Address Proof', 'MOA/AOA'],
      'FSSAI License': ['Form B', 'ID Proof', 'Address Proof', 'NOC from Owner'],
    };
    return docsMap[approval] || ['Basic Documents Required'];
  };

  const getEstimatedDays = (approval: string): number => {
    const daysMap: Record<string, number> = {
      'Udyam Registration': 2,
      'GST Registration': 7,
      'Company Registration': 15,
      'FSSAI License': 30,
      'Factory License': 45,
      'Fire NOC': 21,
      'Trade License': 10,
      'DPIIT Recognition': 60,
    };
    return daysMap[approval] || 14;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const userData: UserData = {
      id: Date.now().toString(),
      name: 'Entrepreneur',
      email: 'user@example.com',
      company: formData.companyName,
      businessType: formData.businessType,
      sector: formData.sector,
      investment: formData.investment,
      foundersCount: formData.foundersCount,
      address: formData.address,
      setupComplete: true,
    };

    const approvals = getApprovalsByBusinessType(formData.businessType);

    dispatch({ type: 'SET_USER', payload: userData });
    dispatch({ type: 'SET_APPROVALS', payload: approvals });

    navigate('/tracker');
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {t('wizard.step1.title')}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFormData({ ...formData, businessType: type.id })}
            className="w-full text-left"
          >
            <Card
              hover
              className={`cursor-pointer transition-all h-full bg-white dark:bg-gray-800 ${
                formData.businessType === type.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`p-3 rounded-xl transition-colors ${
                    formData.businessType === type.id ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <type.icon className={`h-8 w-8 transition-colors ${
                      formData.businessType === type.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    }`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{type.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{type.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{type.approvals.length} {t('wizard.approvalsRequired')}</span>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {t('wizard.step2.title')}
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.form.companyName')} *
          </label>
          <input
            type="text"
            className="input-field"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder={t('wizard.form.enterCompanyName')}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.form.businessAddress')} *
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder={t('wizard.form.enterAddress')}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('wizard.form.businessSector')}
            </label>
            <select
              className="input-field"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            >
              <option value="">{t('wizard.form.selectSector')}</option>
              <option value="technology">{t('common.technology')}</option>
              <option value="healthcare">{t('common.healthcare')}</option>
              <option value="education">{t('common.education')}</option>
              <option value="finance">{t('common.finance')}</option>
              <option value="retail">{t('common.retail')}</option>
              <option value="manufacturing">{t('common.manufacturing')}</option>
              <option value="food">{t('common.food')}</option>
              <option value="other">{t('common.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('wizard.form.expectedInvestment')}
            </label>
            <select
              className="input-field"
              value={formData.investment}
              onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
            >
              <option value="">{t('wizard.form.selectRange')}</option>
              <option value="under-10l">{t('common.under10l')}</option>
              <option value="10l-1cr">{t('common.10lto1cr')}</option>
              <option value="1cr-5cr">{t('common.1crto5cr')}</option>
              <option value="above-5cr">{t('common.above5cr')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.form.numberOfFounders')}
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="input-field"
            value={formData.foundersCount}
            onChange={(e) => setFormData({ ...formData, foundersCount: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedType = businessTypes.find(t => t.id === formData.businessType);
    if (!selectedType) return null;

    return (
      <div className="animate-fade-in bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t('wizard.step3.title')} for {selectedType.title}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {selectedType.approvals.map((approval, index) => (
              <Card key={index} className="flex items-start space-x-4 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{approval}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {getDepartmentByApproval(approval)}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4">⏱️ {getTimelineByApproval(approval)}</span>
                    <span>📄 {getDocsByApproval(approval).length} docs</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {t('wizard.estimatedTimeline')}
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {t('wizard.timelineMonths')}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('wizard.timelineDescription')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="animate-fade-in text-center max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('wizard.step4.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('wizard.planReady')} {businessTypes.find(t => t.id === formData.businessType)?.title.toLowerCase()}.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="text-left bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('wizard.nextSteps')}:</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">1</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">{t('wizard.step1Description')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">{t('wizard.step2Description')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">3</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">{t('wizard.step3Description')}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleComplete} className="flex-1" icon={ArrowRight} iconPosition="right">
            {t('wizard.goToTracker')}
          </Button>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType !== '';
      case 2:
        return formData.companyName && formData.address;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <ProgressBar current={currentStep} total={4} className="max-w-md mx-auto" />
        </div>

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {currentStep < 4 && (
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              icon={ArrowLeft}
            >
              {t('common.previous')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              icon={ArrowRight}
              iconPosition="right"
            >
              {currentStep === 3 ? t('wizard.createPlan') : t('common.next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;