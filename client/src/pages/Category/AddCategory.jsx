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

const AddCategory = () => {
  const formSchema = z.object({
    name: z.string().min(3, "Il nome deve contenere almeno 3 caratteri!"),
    slug: z.string().min(3, "Slug deve contenere almeno 3 caratteri!"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        slug: '',
    },
})

  const categoryName = form.watch("name")

  useEffect(() => {
    if(categoryName ){
        const slug = slugify(categoryName, { lower: true })
        form.setValue("slug", slug)
    }
  }, [categoryName])

  async function onSubmit(values) {
    try {
        const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/add`, {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(values)
        })
        const data = await response.json();
        if (!response.ok) {
            return showToast('error', data.message);
        }
        form.reset()
        showToast('success', data.message);
    } catch (error) {
        showToast('error', error.message);
    }
  }

  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
          <h3 className="text-sm text-red-500 sm:text-sm md:text-blue-500 xl:text-3xl xl:text-black font-semibold">
            Crea Categoria
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome della categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome  categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* -------------- Slug --------------- */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (solo lettura)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Slug (solo lettura)" {...field} 
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

              <Button type="submit" className="w-full">
                Salva Categoria
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
