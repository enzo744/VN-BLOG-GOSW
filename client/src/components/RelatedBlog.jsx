import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { RouteBlogDetails } from '@/helpers/RouteName'
import React from 'react'
import { Link } from 'react-router-dom'

const RelatedBlog = ({ props }) => {
    const { data, loading, error } = useFetch(
        `${getEnv("VITE_API_BASE_URL")}/blog/get-related-blog/${props.category}/${props.currentBlog}`,
        {
          method: "get",
          credentials: "include",
        }
      )
      
      if (loading) return <div>Loading...</div>
  return (
    <div>
      <h2 className='text-lg font-semibold italic mb-3'>Blogs coll. per categoria</h2>
      <div className="">
        {data && data.relatedBlog.length > 0
            ?
            data.relatedBlog.map(blog => {
                return (
                <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
                    <div className="flex items-center gap-2 mb-2">
                        <img className='w-[80px] h-[80px] object-scale-down rounded-md ' src={blog.featuredImage}  />
                        <h4 className='line-clamp-2 text-sm font-semibold'>{blog.title}</h4>
                    </div>
                </Link>
                )
            })
            :
            <div>No Related Blog</div>
        }
        </div>
    </div>
  )
}

export default RelatedBlog
