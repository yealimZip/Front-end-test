'use client';

import { useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '', 
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const requestBody = {
        email: formData.email,
        username: formData.username, 
        password: formData.password,
        confirmPassword: formData.passwordConfirm,
        name: formData.username
      };

      console.log('전송 데이터:', requestBody); 

      await api.post('/auth/signup', requestBody);
      
      alert('회원가입 성공! 로그인해주세요.');
      router.push('/');
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.log('--- 에러 데이터 상세 ---');
        console.dir(error.response.data); 

        const errorData = error.response.data;
        let message = '회원가입 실패';

        if (typeof errorData === 'string') {
          message = errorData;
        } else if (errorData && typeof errorData === 'object') {
          message = JSON.stringify(errorData);
        }

        alert(`오류(${error.response.status}): ${message}`);
      } else {
        console.error(error);
        alert('서버와 연결할 수 없거나 알 수 없는 오류입니다.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            회원가입 🚀
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            서비스 이용을 위해 계정을 생성해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">이메일</label>
            <input 
              name="email" 
              type="email" 
              placeholder="example@email.com" 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">이름/아이디</label>
            <input 
              name="username" 
              type="text" 
              placeholder="사용하실 이름을 입력하세요" 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">비밀번호</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">비밀번호 확인</label>
            <input 
              name="passwordConfirm" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 focus:border-blue-800 outline-none transition-all placeholder-gray-400" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-900"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}