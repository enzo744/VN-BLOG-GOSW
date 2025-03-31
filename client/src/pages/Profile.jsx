import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState }  from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { setUser } from "@/redux/user/user.slice";
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from "react-dropzone";

const Profile = () => {

  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();
 
  const user = useSelector((state) => state.user)

  const { data: userData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-user/${user.user._id}`,
    { method: 'get', credentials: 'include' },

)

  
  const dispatch = useDispatch();

  const formSchema = z.object({
    name: z.string().min(3, "Il nome deve contenere almeno 3 caratteri"),
    email: z.string().email(),
    bio: z.string().min(3, "La biografia deve contenere almeno 3 caratteri"),
    // password: z.string()
      
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if(userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
      })
    }
  }, [userData])
  

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData.user._id}`,
        {
          method: "put",
          credentials: "include",
          body: formData
        });

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      dispatch(setUser(data.user));
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
    }

    
    if(loading) return <Loading />
  return (
    <Card className="max-w-screen-md mx-auto">
    
      <CardContent>
        <div className="flex justify-center items-center mt-10">

        <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage src={filePreview ? filePreview : userData?.user?.avatar} />
                  <div className="absolute z-30 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  
                        justify-center items-center bg-black bg-opacity-50 border-2 border-violet-500 rounded-full group group-hover:flex hidden cursor-pointer">
                    <IoCameraOutline color="#7c3aed" className="" />
                  </div>
                </Avatar>
              </div>
          )}
        </Dropzone>
          
        </div>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* ----------------- Name ---------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Immetti il tuo nome/username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ----------------- Email ---------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="la tua email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* -------------- Biografia --------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="biografia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* -------------- Password --------------- */}
              <div className="mb-3 relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={open === false ? "password" : "text"}
                          placeholder="la tua password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="absolute top-10  right-3">
                  {open === false ? (
                    <AiFillEye
                      onClick={toggle}
                      className="cursor-pointer w-5 h-5 text-blue-800"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={toggle}
                      className="cursor-pointer w-5 h-5 text-blue-800"
                    />
                  )}
                </div>
              </div>

              <div className="mt-5">
                <Button type="submit" className="w-full">
                  Salva modifiche
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
