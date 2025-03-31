import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";
import logo from "@/assets/images/logo-white.png";

const SignUp = () => {
    const navigate = useNavigate();

    const formSchema = z.object({
        name: z.string().min(3, "Il nome deve contenere almeno 3 caratteri!"),
        email: z.string().email("Inserisci un'email valida"),
        password: z.string()
          .min(3, "La password deve contenere almeno 3 caratteri!")
          .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
          .regex(/[0-9]/, "La password deve contenere almeno un numero"),
    
          confirmPassword: z.string(),
          }).refine(data => data.password === data.confirmPassword, {
            message: "Le password non corrispondono!",
            path: ["confirmPassword"], // Specifica il campo per l'errore
        });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      });
    
      async function onSubmit(values) {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            const data = await response.json();
            if (!response.ok) {
                return showToast('error', data.message);
            }

            navigate(RouteSignIn);
            showToast('success', data.message);
        } catch (error) {
            showToast('error', error.message);
        }
      }

      const [open, setOpen] = useState(false);
      const toggle = () => {
        setOpen(!open);
      };
      const [open1, setOpen1] = useState(false);
      const toggle1 = () => {
        setOpen1(!open1);
      };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5 ">
      <div className="flex justify-center items-center">
        <Link to={RouteIndex}>
          <img src={logo}  />
        </Link>
      </div>
        <h1 className="text-2xl font-bold text-center">
          Registra il tuo account
        </h1>
        <div className="">
            <GoogleLogin />
            <div className="border my-5 flex justify-center items-center">
                <span className="absolute bg-white text-sm">Or</span>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Immetti il tuo nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* -------------- Email --------------- */}
            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Immetti la tua email" {...field} />
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
                        placeholder="Immetti la tua password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="absolute top-11  right-3">
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
            {/* -------------- Confirm Password --------------- */}
            <div className="mb-3 relative">
              <FormField
                control={form.control}
                name="confirmPassword"                
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conferma Password</FormLabel>
                    <FormControl>
                      <Input
                        type={open1 === false ? "password" : "text"}
                        placeholder="Conferma la password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="absolute top-11  right-3">
                    {open1 === false ? (
                        <AiFillEye
                        onClick={toggle1}
                        className="cursor-pointer w-5 h-5 text-blue-800"
                        />
                    ) : (
                        <AiFillEyeInvisible
                        onClick={toggle1}
                        className="cursor-pointer w-5 h-5 text-blue-800"
                        />
                    )}
                </div>
            </div>

            <div>
              <Button type="submit"  className="w-full">
                Registrati
              </Button>
              <div className="mt-2 text-sm flex justify-center items-center gap-2">
                <p>
                  Hai già un account?
                </p>
                <Link to={RouteSignIn} className="text-blue-700 hover:underline">
                  Accedi
                </Link>
              </div>

            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp
