import Comment from '@/components/Comment'
import CommentCount from '@/components/CommentCount'
import CommentList from '@/components/CommentList'
import LikeCount from '@/components/LikeCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getEnv } from '@/helpers/getEnv'
import { RouteIndex, RouteSignIn } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const SingleBlogDetails = () => {
    const user = useSelector((state) => state.user)
    const { blog, category } = useParams()

      // Se l'utente non è loggato, mostra un messaggio
  if (!user.isLoggedIn) {
    return (
      <div className="max-w-screen-sm border  border-red-400 p-3 rounded-md bg-slate-100 text-center">
        <p className="text-red-700 font-semibold">Devi effettuare l’accesso per visualizzare il blog!</p>
        
        <Button asChild className="mt-5 m-5">
          <Link to={RouteIndex}>Blogs</Link>
        </Button>
        <Button asChild className="mt-3">
          <Link to={RouteSignIn}>Accedi</Link>
        </Button>
      </div>

    );
  }

    const {data, loading, error} = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`, {
        method: "get",
        credentials: "include",
    }, [blog, category])

    if (loading) return <Loading />
  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
        {data && data.blog &&
            <>
                <div className='border rounded md:w-[70%] w-full p-5'>
                    <h1 className="text-center p-3  text-red-500  sm:text-blue-500 xl:text-2xl xl:text-black font-bold italic">
                        Dettaglio del singolo blog 
                    </h1>
                    <h1 className='text-xl font-bold mb-3'>{data.blog.title}</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex justify-between items-center gap-5">
                            <Avatar>
                                <AvatarImage 
                                    src={data.blog.author.avatar }
                                />
                            </Avatar>
                            <div className="">                                <p className=''>{data.blog.author.name}</p>
                                <p>Date: {moment(data.blog?.createdAt).format("DD-MM-YYYY")}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-5">
                            <LikeCount props={{ blogid: data.blog._id }} />
                            <CommentCount props={{ blogid: data.blog._id }} />
                        </div>
                    </div>
                    <div className="my-5">
                        <img src={data.blog.featuredImage} className='rounded' />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: decode(data.blog.blogContent) || '' }} >

                    </div>

                    <div className="border-t mt-5 pt-3">
                        <Comment props={{ blogid: data.blog._id }} />
                    </div>
                </div>
            </>
        }
      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  )
}

export default SingleBlogDetails
