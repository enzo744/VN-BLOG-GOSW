import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import Loading from "@/components/Loading";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { deleteData } from "@/helpers/handleDelete";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from "moment";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);
  const { data: blogData, loading, error } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/get-all`, {
    method: "get",
    credentials: "include",
  }, [refreshData])

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
    if (response) {
        setRefreshData(!refreshData)
        showToast('success', 'Data deleted.')
    } else {
        showToast('error', 'Data not deleted.')
    }
}

  if (loading) return <Loading />
  return (
<div>
      <Card className="bg-red-50">
        <h3 className="text-center p-3  text-red-500  sm:text-blue-500 lg:text-3xl lg:text-black font-semibold">
            Blogs List 
        </h3>
        <CardHeader>
          <div className="">
            <Button asChild>
              <Link to={RouteBlogAdd}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData && blogData.blog.length > 0 ? (
                blogData.blog.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>{blog?.author?.name}</TableCell>
                    <TableCell>{blog?.category?.name}</TableCell>
                    <TableCell>{blog?.title}</TableCell>
                    <TableCell>{blog?.slug}</TableCell>
                    <TableCell>{moment(blog?.createdAt).format('DD/MM/YYYY')}</TableCell>

                      
                    <TableCell className="flex gap-3">
                        <Button
                          variant="outline"
                          className="hover:bg-violet-500 hover:text-white"
                          asChild
                        >
                          <Link to={RouteBlogEdit(blog._id)}>
                            <FiEdit />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDelete(blog._id)}
                          variant="outline"
                          className="hover:bg-violet-500 hover:text-white"
                          asChild
                        >
                          <Link>
                            <FaRegTrashAlt />
                          </Link>
                        </Button>
                    </TableCell>
                      
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>Nessun Blog Presente</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails
