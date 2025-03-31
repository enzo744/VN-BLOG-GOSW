import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { BiCategory } from 'react-icons/bi'
import BlogCard from '@/components/BlogCard'

const SearchResult = () => {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const {data: blogData, loading, error } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/search?q=${q}`, {
          method: "get",
          credentials: "include",
        })


  return (
    <>
      <div className="flex items-center gap-3 text-2xl font-semibold italic text-violet-600 border-b pb-3 mb-5">
                <BiCategory />
                <h4 className=''>Search Result For: {q}</h4>
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
            {blogData && blogData.blog.length > 0
                ? 
                blogData.blog.map((blog) => <BlogCard key={blog._id} props={blog} />)
                : 
                <div className="flex flex-col">
                    <div>Nessun blog trovato per questa ricerca</div>
                </div>
            }
        </div>
    </>
  )
}

export default SearchResult
