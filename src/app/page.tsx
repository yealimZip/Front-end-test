'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { isAxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    localStorage.removeItem('accessToken');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('accessToken');

    try {
      const res = await api.post('/auth/signin', formData);
      
      console.log('로그인 성공:', res.data);

      const token = res.data.accessToken || res.data.token;
      
      if (!token) {
        alert('로그인 성공했으나 토큰이 없습니다.');
        console.dir(res.data);
        return;
      }

      login(res.data.user || { username: formData.username }, token);
      
      alert('로그인 성공!');
      router.push('/posts'); 

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.dir(error.response.data);
        const errorData = error.response.data;
        const message = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
        
        alert(`로그인 실패: ${message}`);
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-2">Welcome Back! 👋</h1>
          <p className="text-sm text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">아이디</label>
            <input 
              type="text" 
              placeholder="아이디 (Username)" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400"
              required
            />
          </div>

          <button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-900">
            로그인
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm font-medium text-blue-900 hover:text-blue-800 hover:underline transition-colors">
            아직 계정이 없으신가요? 회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}