import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import Card from '../components/UI/Card';

const Contact: React.FC = () => {
  const teamMembers = [
    {
      name: 'Team Member 1',
      instagram: '@member1_insta',
      discord: 'member1#1234',
      instagramUrl: 'https://instagram.com/member1_insta',
      discordUrl: 'https://discord.com/users/member1'
    },
    {
      name: 'Team Member 2',
      instagram: '@member2_insta',
      discord: 'member2#5678',
      instagramUrl: 'https://instagram.com/member2_insta',
      discordUrl: 'https://discord.com/users/member2'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get in touch with our team members
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
              </div>

              <div className="space-y-4">
                <a
                  href={member.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="font-medium">{member.instagram}</span>
                </a>

                <a
                  href={member.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{member.discord}</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 text-center bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Need Quick Help?
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            For immediate assistance, reach out to us on Discord or Instagram. We typically respond within a few hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-blue-600 dark:text-blue-400">
            <span>• Business inquiries: Instagram DM</span>
            <span>• Technical support: Discord</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;