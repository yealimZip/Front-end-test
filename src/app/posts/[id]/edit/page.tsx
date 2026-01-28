'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/useAuthStore'; 

const CATEGORIES = [
  { value: 'NOTICE', label: '공지' },
  { value: 'FREE', label: '자유' },
  { value: 'QNA', label: 'Q&A' },
  { value: 'ETC', label: '기타' },
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore(); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'FREE',
  });
  
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/boards/${params.id}`);
        const targetData = res.data.data || res.data;
        
        setFormData({
          title: targetData.title || '',
          content: targetData.content || '',
          category: targetData.category || 'FREE',
        });
      } catch (error) {
        console.error(error);
        alert('게시글 정보를 불러오지 못했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPost();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm('게시글을 수정하시겠습니까?')) return;
    
    try {
      const data = new FormData();
      
      const jsonBody = JSON.stringify({
        id: params.id,             
        title: formData.title,
        content: formData.content,
        category: formData.category,
        writer: {                 
             username: user?.username || ''
        }
      });

      const blob = new Blob([jsonBody], { type: 'application/json' });
      data.append('request', blob);
      
      if (file) {
        data.append('file', file); 
      }

      console.log('전송 데이터 확인:', jsonBody);

      await api.patch(`/boards/${params.id}`, data, {
        headers: {
          'Content-Type': undefined 
        }
      });
      
      alert('게시글이 수정되었습니다!');
      router.push(`/posts/${params.id}`); 
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.error('에러 상세:', error.response.data);
        const errorData = error.response.data;
        const message = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
        alert(`수정 실패: ${message}`);
      } else {
        console.error(error);
        alert('서버 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">게시글 수정</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 bg-white outline-none transition-all"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
            <textarea 
              name="content"
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-900 outline-none resize-none transition-all"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">새 이미지 (선택)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <input 
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
                />
            </div>
            <p className="text-xs text-gray-400 mt-1 pl-1">* 이미지를 선택하면 기존 이미지가 변경됩니다.</p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-colors"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}