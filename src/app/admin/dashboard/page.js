'use client'

import Script from 'next/script'
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'

const Page = () => {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', category: '' })
  const [editPostId, setEditPostId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/news')
      setPosts(res.data)
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟')) return
    try {
      await axios.delete('/api/news', { data: { id } })
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
      alert('خطا در حذف خبر')
    }
  }

  const handleEdit = (post) => {
    setEditPostId(post.id)
    setNewPost({ title: post.title, content: post.content, author: post.author, category: post.category || '' })
    setShowModal(true)
  }

  const toggleModal = () => {
    setShowModal(!showModal)
    if (showModal) {
      setNewPost({ title: '', content: '', author: '', category: '' })
      setEditPostId(null)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (newPost.title && newPost.content && newPost.author && newPost.category) {
      try {
        if (editPostId) {
          const response = await axios.put('/api/news', { id: editPostId, ...newPost })
          setPosts(posts.map(post => (post.id === editPostId ? response.data : post)))
        } else {
          const response = await axios.post('/api/news', newPost)
          setPosts(prev => [...prev, response.data])
        }
        toggleModal()
      } catch (err) {
        console.error('Save error:', err)
        alert('خطا در ذخیره خبر')
      }
    } else {
      alert('لطفا همه فیلدها را پر کنید')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleString('fa-IR', { hour12: false })
  }

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(post => categoryFilter === 'all' || (post.category && post.category === categoryFilter))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
  }, [posts, searchTerm, categoryFilter, sortOrder])

  return (
    <>
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" onLoad={() => console.log('✅ jQuery loaded')} />
      <Script src="https://cdn.jsdelivr.net/npm/apexcharts" strategy="beforeInteractive" onLoad={() => console.log('✅ ApexCharts loaded')} />
      <Script src="/assets/js/dashboard1.js" strategy="afterInteractive" onLoad={() => console.log('✅ dashboard1.js loaded')} />

      <div className="min-h-screen bg-gradient-to-r from-purple-600 to-purple-400 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">News Dashboard</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex gap-2 items-center">
              <label htmlFor="search" className="text-purple-700 font-medium">جستجو:</label>
              <input
                id="search"
                type="text"
                placeholder="جستجو بر اساس عنوان"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border border-purple-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <label htmlFor="category" className="text-purple-700 font-medium">دسته‌بندی:</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border border-purple-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">همه</option>
                <option value="علمی">علمی</option>
                <option value="ورزشی">ورزشی</option>
                <option value="اجتماعی">اجتماعی</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <label htmlFor="sortOrder" className="text-purple-700 font-medium">مرتب‌سازی:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="border border-purple-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="desc">جدیدترین‌ها</option>
                <option value="asc">قدیمی‌ترین‌ها</option>
              </select>
            </div>

            <button
              onClick={toggleModal}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md shadow-md transition whitespace-nowrap"
            >
              ایجاد خبر جدید
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead className="bg-purple-100 text-purple-800 font-semibold">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">عنوان</th>
                  <th className="border border-gray-300 px-4 py-2">دسته‌بندی</th>
                  <th className="border border-gray-300 px-4 py-2">نویسنده</th>
                  <th className="border border-gray-300 px-4 py-2">تاریخ ایجاد</th>
                  <th className="border border-gray-300 px-4 py-2">تاریخ بروزرسانی</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => (
                  <tr key={post.id ?? index} className="hover:bg-purple-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">{post.id ?? '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                    <Link href={`/news/${post.id ?? ''}`} className="text-purple-700 hover:underline">
                     {post.title}
                    </Link>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{post.category || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{post.author}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{formatDate(post.createdAt)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{formatDate(post.updatedAt)}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-purple-700 hover:text-purple-900 transition"
                        aria-label="ویرایش"
                        title="ویرایش"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        aria-label="حذف"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">خبری یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={toggleModal}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold text-purple-700 mb-4">
                  {editPostId ? 'ویرایش خبر' : 'ایجاد خبر جدید'}
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-purple-700 font-medium mb-1">
                      عنوان
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newPost.title}
                      onChange={handleChange}
                      required
                      className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-purple-700 font-medium mb-1">
                      محتوا
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="4"
                      value={newPost.content}
                      onChange={handleChange}
                      required
                      className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="author" className="block text-purple-700 font-medium mb-1">
                      نویسنده
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={newPost.author}
                      onChange={handleChange}
                      required
                      className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-purple-700 font-medium mb-1">
                      دسته‌بندی
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={newPost.category}
                      onChange={handleChange}
                      required
                      className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      <option value="علمی">علمی</option>
                      <option value="ورزشی">ورزشی</option>
                      <option value="اجتماعی">اجتماعی</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="px-4 py-2 rounded-md border border-purple-400 text-purple-600 hover:bg-purple-100 transition"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition"
                    >
                      ذخیره
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Page
