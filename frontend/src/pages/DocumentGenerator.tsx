import React, { useState } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, Copy, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';

const DocumentGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: '',
    directorName: '',
    directorPan: '',
    directorAadhaar: '',
    registeredAddress: '',
    paidUpCapital: '',
    authorizedCapital: '',
    businessActivity: '',
    email: '',
    phone: '',
  });

  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);

  const documents = [
    {
      id: 'spice',
      name: 'SPICe+ Form (Company Registration)',
      description: 'Integrated form for company incorporation',
      requiredFields: ['companyName', 'directorName', 'directorPan', 'registeredAddress', 'paidUpCapital', 'authorizedCapital'],
      estimatedTime: '5 minutes',
    },
    {
      id: 'gst',
      name: 'GST Registration Application',
      description: 'Form for Goods and Services Tax registration',
      requiredFields: ['companyName', 'registeredAddress', 'directorPan', 'businessActivity'],
      estimatedTime: '3 minutes',
    },
    {
      id: 'udyam',
      name: 'Udyam Registration Form',
      description: 'MSME registration for manufacturing/service businesses',
      requiredFields: ['companyName', 'directorName', 'directorAadhaar', 'businessActivity'],
      estimatedTime: '4 minutes',
    },
    {
      id: 'dpiit',
      name: 'DPIIT Recognition Application',
      description: 'Department for Promotion of Industry and Internal Trade recognition',
      requiredFields: ['companyName', 'directorName', 'registeredAddress', 'businessActivity'],
      estimatedTime: '7 minutes',
    },
  ];

  const requiredFields = [
    { key: 'companyName', label: 'Company Name *', type: 'text', placeholder: 'Enter company name' },
    { key: 'directorName', label: 'Director Name *', type: 'text', placeholder: 'Enter director full name' },
    { key: 'directorPan', label: 'Director PAN *', type: 'text', placeholder: 'ABCDE1234F' },
    { key: 'directorAadhaar', label: 'Director Aadhaar *', type: 'text', placeholder: '1234 5678 9012' },
    { key: 'registeredAddress', label: 'Registered Address *', type: 'textarea', placeholder: 'Enter complete address' },
    { key: 'paidUpCapital', label: 'Paid Up Capital', type: 'number', placeholder: '100000' },
    { key: 'authorizedCapital', label: 'Authorized Capital', type: 'number', placeholder: '100000' },
    { key: 'businessActivity', label: 'Business Activity *', type: 'text', placeholder: 'Describe main business activity' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'contact@company.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9876543210' },
  ];

  const getCompletionPercentage = () => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const getMissingFieldsCount = () => {
    return Object.values(formData).filter(value => value.trim() === '').length;
  };

  const canGenerateDocument = (doc: any) => {
    return doc.requiredFields.every((field: string) => formData[field as keyof typeof formData].trim() !== '');
  };

  const generateDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc || !canGenerateDocument(doc)) return;

    setGeneratedDocs([...generatedDocs, docId]);
    setActiveDocument(docId);
  };

  const getDocumentTemplate = (docId: string) => {
    const templates = {
      spice: `
SPICe+ FORM
(Simplified Proforma for Incorporating Company electronically Plus)

PART A - COMPANY DETAILS
Company Name: ${formData.companyName}
Registered Office Address: ${formData.registeredAddress}
Authorized Capital: ₹${formData.authorizedCapital}
Paid-up Capital: ₹${formData.paidUpCapital}

PART B - DIRECTOR DETAILS
Name: ${formData.directorName}
PAN: ${formData.directorPan}
Email: ${formData.email}
Phone: ${formData.phone}

PART C - BUSINESS ACTIVITY
Main Business Activity: ${formData.businessActivity}

Declaration: I hereby declare that all the information provided is true and correct.

Date: ${new Date().toLocaleDateString()}
Place: Delhi

Signature of Director: _________________
${formData.directorName}
      `,
      gst: `
GST REGISTRATION APPLICATION
Form GST REG-01

APPLICANT DETAILS
Legal Name: ${formData.companyName}
Trade Name: ${formData.companyName}
PAN: ${formData.directorPan}

PRINCIPAL PLACE OF BUSINESS
Address: ${formData.registeredAddress}
State: Delhi
Email: ${formData.email}
Mobile: ${formData.phone}

BUSINESS DETAILS
Constitution of Business: Private Limited Company
Nature of Business Activity: ${formData.businessActivity}
Reason for Registration: Liable to register
Date of Liability: ${new Date().toLocaleDateString()}

AUTHORIZED SIGNATORY
Name: ${formData.directorName}
Designation: Director
PAN: ${formData.directorPan}

Declaration: I solemnly affirm that the information given above is true and correct.

Date: ${new Date().toLocaleDateString()}
Place: Delhi

Signature: _________________
${formData.directorName}
      `,
      udyam: `
UDYAM REGISTRATION
Ministry of Micro, Small and Medium Enterprises

ENTREPRENEUR INFORMATION
Name: ${formData.directorName}
Aadhaar Number: ${formData.directorAadhaar}
Gender: [To be filled]
Category: [To be filled]

ENTERPRISE INFORMATION
Name of Enterprise: ${formData.companyName}
Type of Organization: Private Limited Company
Location of Plant/Office: ${formData.registeredAddress}
District: [Delhi District]
State: Delhi

ACTIVITY & INVESTMENT
Major Activity: ${formData.businessActivity}
NIC Code: [To be determined based on activity]
Date of Commencement: [To be filled]

BANK DETAILS
Bank Name: [To be filled]
Branch: [To be filled]
Account Number: [To be filled]
IFSC Code: [To be filled]

Declaration: I hereby declare that the information furnished above is true and correct.

Date: ${new Date().toLocaleDateString()}

Signature: _________________
${formData.directorName}
      `,
      dpiit: `
APPLICATION FOR DPIIT RECOGNITION
Department for Promotion of Industry and Internal Trade

ENTITY INFORMATION
Entity Name: ${formData.companyName}
Entity Type: Private Limited Company
Date of Incorporation: [To be filled]
Company Identification Number: [To be obtained after incorporation]

REGISTERED OFFICE
Address: ${formData.registeredAddress}
State: Delhi
District: [Delhi District]
Pin Code: [To be filled]

DIRECTOR/FOUNDER DETAILS
Name: ${formData.directorName}
Designation: Director & Founder
PAN: ${formData.directorPan}
Email: ${formData.email}
Mobile: ${formData.phone}

BUSINESS DETAILS
Business Description: ${formData.businessActivity}
Sector: [To be selected based on activity]
Innovation Type: [Product/Process/Service]

SCALABILITY
Scalable Business Model: [Yes/No - To be filled]
Job Creation Potential: [To be described]

FUNDING INFORMATION
Total Investment: ₹${formData.paidUpCapital || 'To be filled'}
Funding Sources: [To be detailed]

Declaration: I hereby declare that the information provided is accurate and the entity meets all eligibility criteria for startup recognition.

Date: ${new Date().toLocaleDateString()}
Place: Delhi

Signature: _________________
${formData.directorName}
Director
      `
    };

    return templates[docId as keyof typeof templates] || 'Document template not found.';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    const content = getDocumentTemplate(docId);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc?.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Document Generator</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Auto-fill government forms and applications with your business details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getCompletionPercentage()}% Complete
                </div>
              </div>
              
              <ProgressBar 
                current={Object.keys(formData).length - getMissingFieldsCount()} 
                total={Object.keys(formData).length} 
                className="mb-6"
              />

              {getMissingFieldsCount() > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      {getMissingFieldsCount()} {t('documents.fieldsComplete')}
                    </span>
                  </div>
                </div>
              )}

              <form className="space-y-6">
                {requiredFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        className="input-field resize-none"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="input-field"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </form>
            </Card>

            {/* Document Preview */}
            {activeDocument && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Document Preview: {documents.find(d => d.id === activeDocument)?.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Copy}
                      onClick={() => copyToClipboard(getDocumentTemplate(activeDocument))}
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      icon={Download}
                      onClick={() => downloadDocument(activeDocument)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                    {getDocumentTemplate(activeDocument)}
                  </pre>
                </div>
              </Card>
            )}
          </div>

          {/* Documents Sidebar */}
          <div className="space-y-6">
            {/* Available Documents */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('documents.availableDocuments')}</h3>
              <div className="space-y-4">
                {documents.map((doc) => {
                  const canGenerate = canGenerateDocument(doc);
                  const isGenerated = generatedDocs.includes(doc.id);
                  
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        canGenerate ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {isGenerated ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : canGenerate ? (
                            <FileText className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{doc.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ⏱️ {doc.estimatedTime}
                            </span>
                            {canGenerate ? (
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto"
                                  icon={Eye}
                                  onClick={() => setActiveDocument(doc.id)}
                                >
                                  {t('documents.preview')}
                                </Button>
                                <Button
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto"
                                  icon={isGenerated ? Download : FileText}
                                  onClick={() => generateDocument(doc.id)}
                                >
                                  {isGenerated ? t('documents.download') : t('documents.generate')}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {t('documents.missingFields')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Legal Language Simplifier */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('documents.legalSimplifier') || 'Legal Language Simplifier'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('documents.legalSimplifierDesc') || 'Convert complex legal jargon into plain English for better understanding.'}
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Complex:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">"Authorized Share Capital"</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2">Simple:</p>
                  <p className="text-xs text-green-700 dark:text-green-400">"Maximum money you can raise by selling shares"</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Complex:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">"Memorandum of Association"</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2">Simple:</p>
                  <p className="text-xs text-green-700 dark:text-green-400">"Document defining your company's purpose and scope"</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Learn More Legal Terms
              </Button>
            </Card>

            {/* Help & Tips */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('documents.tips')}</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>{t('documents.tip1') || 'Keep your PAN and Aadhaar details handy for quick form filling'}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>{t('documents.tip2') || 'Use your registered office address consistently across all documents'}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>{t('documents.tip3') || 'Review generated documents before submitting to authorities'}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>{t('documents.tip4') || 'Save generated documents for future reference and modifications'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;