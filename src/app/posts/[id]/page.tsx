'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import Link from 'next/link';

interface PostDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  writer?: {
    username: string;
  };
  imageUrl?: string;
  filePath?: string;
  fileUrl?: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/boards/${params.id}`);
        console.log('게시글 상세 데이터:', res.data);
        setPost(res.data);
      } catch (error) {
        console.error(error);
        alert('게시글을 불러오지 못했습니다.');
        router.push('/posts');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/boards/${params.id}`);
      alert('삭제되었습니다.');
      router.push('/posts');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
         alert(`삭제 실패: ${error.response.data.message || '권한이 없습니다.'}`);
      } else {
         alert('오류가 발생했습니다.');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
    </div>
  );
  
  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">게시글이 존재하지 않습니다.</div>
    </div>
  );

  const writerName = post.writer?.username || '알 수 없음';
  const displayImage = post.imageUrl || post.filePath || post.fileUrl;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6">
          <Link 
            href="/posts" 
            className="inline-flex items-center text-gray-500 hover:text-blue-900 font-bold transition-colors"
          >
            <span className="mr-2">←</span> 목록으로 돌아가기
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  post.category === 'NOTICE' ? 'bg-red-50 text-red-600' : 
                  post.category === 'QNA' ? 'bg-green-50 text-green-600' :
                  'bg-blue-50 text-blue-600'
              }`}>
                {post.category}
              </span>
              <span className="text-sm text-gray-400 font-medium">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  {writerName}
                </span>
                <span className="text-xs text-gray-500">작성자</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {displayImage && (
               <div className="mb-8 relative w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                 <Image 
                   src={displayImage} 
                   alt="게시글 이미지" 
                   width={800} 
                   height={600}
                   className="w-full h-auto object-contain"
                   unoptimized 
                 />
               </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap min-h-50">
              {post.content}
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end gap-3">
            <button 
                onClick={() => router.push(`/posts/${post.id}/edit`)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              수정
            </button>
            <button 
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 font-bold rounded-lg hover:bg-red-100 hover:border-red-200 transition-all shadow-sm"
            >
              삭제
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}