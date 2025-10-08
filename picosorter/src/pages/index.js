import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import verifyUser from '../utils/utils';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  }

  useEffect(() => {
    var userResult = JSON.parse(verifyUser());
    if(userResult.username){
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>picosorter</title>
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to picosorter</h1>
        <h3 className="text-xl font-medium mb-8 text-gray-600">Picosorter is an input/output management system.</h3>
        <div className="inline-flex">
          {isLogin ? (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleLoginClick}
            >
              Log in
            </button>
          )}
          <div className="w-2"></div>
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            disabled
          >
            Pair with simplescanner
          </button>
        </div>
      </main>
    </div>
  );
}