import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import { RouteBlog } from "@/helpers/RouteName";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EncryptDecrypt from "@/components/EncryptDecrypt";
import Loading from "@/components/Loading";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const EditBlog = () => {
  const { blogid } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { data: categoryData } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });

  const { data: blogData, loading: blogLoading } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/edit/${blogid}`, {
    method: "get",
    credentials: "include",
  }, [blogid])

  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();

  const formSchema = z.object({
    category: z.string().min(3, "Category deve contenere almeno 3 caratteri!"),
    title: z.string().min(3, "Title deve contenere almeno 3 caratteri!"),
    slug: z.string().min(3, "Slug deve contenere almeno 3 caratteri!"),
    emailBlog: z.string(),
    pswBlog: z.string(),
    // featuredImage: z.string(),
    blogContent: z
      .string()
      .min(3, "Blog Content deve contenere almeno 3 caratteri!"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      emailBlog: "",
      pswBlog: "",
      blogContent: "",
    },
  });

  useEffect(() => {
    if(blogData) {
      setPreview(blogData.blog.featuredImage)
      form.setValue("category", blogData.blog.category._id)
      form.setValue("title", blogData.blog.title)
      form.setValue("slug", blogData.blog.slug)
      form.setValue("emailBlog", blogData.blog.emailBlog)
      form.setValue("pswBlog", blogData.blog.pswBlog)
      form.setValue("blogContent", blogData.blog.blogContent)
    }
  }, [blogData])

  const handleEditorData = (event) => {
    // 1. Ottieni il valore inserito nel Textarea
    const { value } = event.target;
    form.setValue("blogContent", value);

  };

  const blogTitle = form.watch("title");

  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/update/${blogid}`, {
        method: "put",
        credentials: "include",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      form.reset();
      setFile();
      setPreview();
      navigate(RouteBlog);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const [open, setOpen] = useState(false);
    const toggle = () => {
      setOpen(!open);
    };

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };

  if(blogLoading) return <Loading />

  return (
    <div>
      <Card className="pt-5">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* ----------------- Categoria ---------------------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ---------------------------- title --------------------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* --------------------------------- slug ---------------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder="Slug (solo lettura)" 
                            {...field} 
                            readOnly    // Evita modifiche dirette all'input.
                            tabIndex="-1"   //  Esclude l'input dalla navigazione con il tab, impedendo il focus.
                            onKeyDown={(e) => e.preventDefault()} // Evita che l'utente possa modificare il valore con la tastiera.
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ------------------------- image -------------------------- */}
              <div className="mb-3 flex justify-center items-center gap-4">
                <div>
                  <span className="">Image </span>
                </div>
                <div className="flex justify-center items-center w-40 h-40 border-2 border-gray-200 border-dashed rounded overflow-hidden cursor-pointer ">
                  <Dropzone
                    onDrop={(acceptedFiles) =>
                      handleFileSelection(acceptedFiles)
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className="w-full h-full flex justify-center items-center">
                        <input {...getInputProps()} />
                        
                        {/* Immagine con dimensioni fisse */}
                        {filePreview && (
                            <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain" 
                            />
                        )}
                      </div>
                    )}
                  </Dropzone>
                </div>
              </div>
              {/* ------------------------- emailBlog -------------------------- */}
              <div className="mb-1 ">
                <FormField
                  control={form.control}
                  name="emailBlog"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter blog email"
                          {...field}
                          className="text-sm text-red-500 sm:text-sm sm:text-blue-500 lg:text-base lg:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ------------------------- pswBlog -------------------------- */}
              <div className=" relative gap-3 ">
                <FormField
                  control={form.control}
                  name="pswBlog"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Password</FormLabel>
                      <FormControl>
                        <Input
                          type={open === false ? "password" : "text"}
                          placeholder="Enter blog password"
                          {...field}
                          className="text-sm text-red-500 sm:text-sm sm:text-blue-500 lg:text-base lg:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="absolute top-11 right-4">
                  {open === false ? (
                    <AiFillEye
                      onClick={toggle}
                      className="cursor-pointer w-6 h-6 text-blue-800"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={toggle}
                      className="cursor-pointer w-6 h-6 text-blue-800"
                    />
                  )}
                </div>
              </div>
              {/* ------------------------- blogContent -------------------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5} // Imposta almeno 5 righe visibili
                          // placeholder="blogContent - Scrivi il contenuto del blog..."
                          onChange={(event) => {
                            handleEditorData(event); // Applica la logica personalizzata
                            field.onChange(event); // Mantiene il controllo di react-hook-form
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                  
              <Button type="submit" className="w-full mt-5">
                Aggiorna Blog
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
            <EncryptDecrypt />
    </div>
  );
};

export default EditBlog;
