import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const ProfilePage = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Profile
          </h2>

          <div className="flex items-center space-x-3 text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">
            <span className="text-2xl">👋🏻 Hello</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {session?.user?.name || 'Guest'}
            </span>
          </div>

          <ProfileForm />
        </div>
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
