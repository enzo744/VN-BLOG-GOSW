import React from 'react'
import Loading from '@/components/Loading'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import BlogCard from '@/components/BlogCard'

const Index = () => {
  // Home: Recupera tutte le blog dal database
  const {data: blogData, loading, error } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/blogs`, {
      method: "get",
      credentials: "include",
    })

    if (loading) return <Loading />
  return (
    // Mostra tutte le BlogCard.jsx
    <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-10">
      {blogData && blogData.blog.length > 0
      ? 
      blogData.blog.map((blog) => <BlogCard key={blog._id} props={blog} />)
      : 
      <div>Data not found</div>
      }
    </div>
  )
}

export default Index
