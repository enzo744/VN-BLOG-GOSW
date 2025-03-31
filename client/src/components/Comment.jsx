import React, { useState } from 'react'
import { FaRegComments } from "react-icons/fa";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteSignIn } from '@/helpers/RouteName';
import CommentList from './CommentList';

// Componente  visibile dal link sul blog dalla home. Interno al SingleBlogDetails.jsx
const Comment = (props) => { // definisce il componente Comment, che accetta props come parametro
    const [newComment, setNewComment] = useState()
    const user = useSelector((state) => state.user);
    const formSchema = z.object({
        comment: z.string().min(3, "Commento deve contenere almeno 3 caratteri!"),
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          comment: "",
        },
      });

      async function onSubmit(values) {
          try {
                //Questi props vengono usati per ottenere l'id del blog a cui il commento appartiene:
                // props.props.blogid: È l'ID del blog che viene passato come prop al componente.
                const newValues = { ...values,blogid: props.props.blogid, user: user.user._id, }
              const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                  method: 'post',
                  credentials: 'include',
                  headers: { 'Content-type': 'application/json' },
                  body: JSON.stringify(newValues)
              })
              const data = await response.json();
              if (!response.ok) {
                  return showToast('error', data.message);
              }
              setNewComment(data.comment)
              form.reset()
              showToast('success', data.message);
          } catch (error) {
              showToast('error', error.message);
          }
        }
  return (
    <div>
      <h4 className='flex items-center gap-2 text-2xl font-bold'>
        <FaRegComments 
        className='text-violet-500' /> Commento
      </h4>

      {
        user && user.isLoggedIn
        ?
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-1">
                    <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commento</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Il tuo commento..."  {...field} />
                                </FormControl>
                                <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        :
        <Button asChild>
            <Link to={RouteSignIn}>Accedi</Link> per commentare
        </Button>        
        }

        <div className="mt-5">
            <CommentList props={{ blogid: props.props.blogid, newComment}} />
        </div>
    </div>
  )
}

export default Comment
