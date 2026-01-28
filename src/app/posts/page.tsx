'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  category: string;
  createdAt: string; 
  writer?: {
     username: string;
  }
}

export default function PostsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore(); 
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoading(true);
  
      const res = await api.get(`/boards?page=${pageNumber}&size=10`);
      
      console.log('게시글 목록:', res.data);
      
      if (res.data && res.data.content) {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      } else if (Array.isArray(res.data)) {
        setPosts(res.data);
      }
      
    } catch (error) {
      console.error('불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">게시판 📋</h1>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm text-gray-600">
              안녕하세요, <strong className="text-gray-900 font-bold">{user?.username || '사용자'}</strong>님!
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors font-bold"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Link 
            href="/posts/write" 
            className="inline-flex items-center justify-center bg-blue-800 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all hover:-translate-y-0.5"
          >
            게시글 쓰기
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {posts.length === 0 ? (
                <li className="p-12 text-center flex flex-col items-center text-gray-500">
                  <p className="text-lg">아직 작성된 게시글이 없습니다.</p>
                </li>
              ) : (
                posts.map((post) => (
                  <li key={post.id} className="hover:bg-blue-50/40 transition duration-150 group">
                    <Link href={`/posts/${post.id}`} className="block p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-end sm:items-center">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 sm:mb-0 truncate pr-4">
                          {post.title}
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row gap-1 sm:gap-4 shrink-0 text-right">
                          <span>작성자: <span className="font-medium text-gray-700">{post.writer?.username || '알 수 없음'}</span></span>
                          <span className="text-gray-400">|</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            이전
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-transparent">
            {page + 1} / {totalPages === 0 ? 1 : totalPages} 페이지
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}