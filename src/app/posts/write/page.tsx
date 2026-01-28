'use client';

import { useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';

const CATEGORIES = [
  { value: 'FREE', label: '자유게시판' },
  { value: 'QNA', label: '질문게시판' },
  { value: 'NOTICE', label: '공지사항' },
  { value: 'ETC', label: '기타' },
];

export default function WritePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'FREE',
  });
  
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      
      const jsonBody = JSON.stringify({
        title: formData.title,
        content: formData.content,
        category: formData.category,
      });

      const blob = new Blob([jsonBody], { type: 'application/json' });
      data.append('request', blob); 

      if (file) {
        data.append('file', file); 
      }

      console.log('FormData 전송 (request + file)');

      await api.post('/boards', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      alert('게시글이 등록되었습니다!');
      router.push('/posts');
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.dir(error.response.data);
        const errorData = error.response.data;
        const message = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);

        alert(`글 작성 실패: ${message}`);
      } else {
        console.error(error);
        alert('서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">새 게시글 작성</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 rounded-lg shadow">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
          <input 
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
          <textarea 
            name="content"
            className="w-full p-4 border rounded h-60 resize-none" 
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">이미지 (선택)</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-bold"
          >
            취소
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}