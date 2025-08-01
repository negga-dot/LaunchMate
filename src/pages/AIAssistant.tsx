import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Calculator, Search, CheckCircle, HelpCircle, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import type { ChatMessage } from '../contexts/AppContext';

const AIAssistant: React.FC = () => {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  const popularQuestions = [
    'What documents do I need for GST registration?',
    'How long does company registration take?',
    'What are the fees for FSSAI license?',
    'Which schemes am I eligible for?',
    'How to get DPIIT recognition?',
    'What is the process for trade license?',
  ];

  const quickActions = [
    {
      icon: Calculator,
      title: t('chat.calculateFees'),
      description: 'Get fee estimates for licenses',
      action: () => handleQuickMessage('Calculate fees for my business type'),
    },
    {
      icon: Search,
      title: t('chat.findSchemes'),
      description: 'Discover funding opportunities',
      action: () => handleQuickMessage('Show me eligible schemes'),
    },
    {
      icon: CheckCircle,
      title: t('chat.checkStatus'),
      description: 'Check application status',
      action: () => handleQuickMessage('What is the status of my applications?'),
    },
  ];

  const helpTopics = [
    'Company Registration',
    'GST & Tax Compliance',
    'MSME Registration',
    'Food License (FSSAI)',
    'Import Export Code',
    'Labor Compliance',
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: generateBotResponse(userMessage.message),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botResponse });
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickMessage = (quickMessage: string) => {
    setMessage(quickMessage);
    setTimeout(() => handleSendMessage(), 100);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('gst') || lowerMessage.includes('tax')) {
      return `For GST registration, you'll need:
      
1. PAN Card of the business
2. Aadhaar Card of authorized signatory
3. Business registration certificate
4. Bank account details
5. Business address proof

The process typically takes 3-7 working days and costs ₹0 (free) for most businesses. You can apply online through the GST portal.

Would you like me to help you with the application process?`;
    }
    
    if (lowerMessage.includes('company registration') || lowerMessage.includes('incorporation')) {
      return `Company registration in Delhi involves these steps:

1. **Name Reservation** (1-2 days) - ₹1,000
2. **SPICe+ Filing** (10-15 days) - ₹4,000-6,000
3. **PAN & TAN** (included in SPICe+)
4. **Bank Account Opening** (2-3 days)

Total timeline: 15-20 days
Total cost: ₹5,000-8,000 (including professional fees)

Required documents:
- Director's PAN & Aadhaar
- Address proof
- Passport size photos
- Registered office proof

Need help with the application?`;
    }
    
    if (lowerMessage.includes('scheme') || lowerMessage.includes('funding')) {
      return `Based on your business profile, here are some schemes you might be eligible for:

🎯 **Highly Recommended:**
• PMEGP - Up to ₹25L with 25-35% subsidy
• Mudra Loan - Up to ₹10L collateral-free
• Delhi Startup Policy - ₹20L grant

💡 **Also Consider:**
• Stand-Up India (if SC/ST/Women)
• SIDBI Fund of Funds
• Credit Guarantee Scheme

Would you like detailed information about any specific scheme?`;
    }
    
    if (lowerMessage.includes('fssai') || lowerMessage.includes('food')) {
      return `FSSAI License requirements depend on your business type:

**Basic Registration** (Turnover < ₹12L): ₹100
**State License** (₹12L - ₹20Cr): ₹2,500-7,500
**Central License** (> ₹20Cr): ₹7,500-10,000

📋 **Documents needed:**
• Form B application
• ID & address proof
• Business premises proof
• NOC from owner/rent agreement
• Water test report (if applicable)

⏱️ **Timeline:** 15-30 days

The process is online through FSSAI portal. Need help with the application?`;
    }
    
    if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('calculate')) {
      return `Here's a quick fee breakdown for common licenses:

💰 **Registration Fees:**
• Company Registration: ₹5,000-8,000
• GST Registration: Free
• FSSAI Basic: ₹100
• Trade License: ₹2,000-5,000
• MSME/Udyam: Free

🏛️ **Professional Fees:**
• CA/CS charges: ₹2,000-5,000 per license
• Documentation: ₹500-1,000

📊 **Total estimated cost for a typical startup:** ₹15,000-25,000

Want a detailed estimate for your specific business type?`;
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('track')) {
      return `To check your application status:

🔍 **Online Tracking:**
• GST: GST Portal → Track Application Status
• Company: MCA Portal → View Company/LLP Master Data
• FSSAI: FSSAI Portal → Track Your Application
• Trade License: Municipal Corporation website

📱 **Alternative Methods:**
• Call helpline numbers
• Visit respective offices
• Use our tracking feature in the Approval Tracker

Would you like me to help you track a specific application?`;
    }
    
    return `I understand you're asking about "${userMessage}". 

I'm here to help with:
• License applications and requirements
• Government scheme eligibility
• Fee calculations and timelines
• Document preparation
• Application status tracking

Could you please be more specific about what you'd like to know? For example:
- "What documents do I need for GST registration?"
- "Which schemes am I eligible for?"
- "How much does company registration cost?"

You can also use the quick action buttons below for common queries!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors overflow-x-hidden">
      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-2xl">
              <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('chat.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('chat.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.quickActions')}</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{action.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Help Topics */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.helpTopics')}</h3>
              <div className="space-y-2">
                {helpTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(`Tell me about ${topic}`)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>

            {/* Human Support */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('chat.needHumanHelp')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Need personalized assistance? Connect with our compliance experts.
              </p>
              <Button variant="outline" size="sm" icon={Phone} className="w-full">
                {t('chat.contactSupport')}
              </Button>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                      <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">LaunchMate Assistant</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">Online • Ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[500px] max-h-[600px]">
                  {state.chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Welcome! How can I help you today?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Ask me anything about startup compliance, licenses, or government schemes.
                      </p>
                      
                      {/* Popular Questions */}
                      <div className="text-left max-w-md mx-auto">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">{t('chat.popularQuestions')}:</h5>
                        <div className="space-y-2">
                          {popularQuestions.slice(0, 4).map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickMessage(question)}
                              className="w-full text-left p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              • {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {state.chatHistory.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              msg.sender === 'user' 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                              {msg.sender === 'user' ? (
                                <User className="h-4 w-4 text-white" />
                              ) : (
                                <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              )}
                            </div>
                            <div className={`px-4 py-2 rounded-2xl text-sm ${
                              msg.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}>
                              <div className="whitespace-pre-wrap break-words">{msg.message}</div>
                              <div className={`text-xs mt-1 ${
                                msg.sender === 'user' 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('chat.placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        rows={2}
                        disabled={isTyping}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      icon={Send}
                      className="self-end"
                    >
                      {t('chat.send')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;