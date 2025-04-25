import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@/utils/auth"
import { signinSchema } from "@/utils/schema"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}) {

  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(false);

  const navigate = useNavigate();
  const {register,handleSubmit,formState:{errors}} = useForm({
    resolver: zodResolver(signinSchema)
  })

  const onSubmit =async  (data) =>{
    setIsLoading(true); 
    try {
           
       await signIn(data.email,data.password);
       setIsLoading(false); 
       toast.success("user signin successfully")
        navigate("/dashboard");
    } catch (error) {
      console.log("error",error);
      setError(error.message);
      toast.error("Invalid Credentials please try again!");
    
    }finally{
      setIsLoading(false);
    }

  }





  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className={"text-center"}>
          Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
       
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                {...register("password")}
                id="password" 
                type="password"
                 placeholder="* * * * * * * *" required 
                 />
              </div>
              <Button type="submit" variant={"purple"} disabled={isLoading} className="w-full ">
               {isLoading ? "login..." :"Login"} 
              </Button>
              
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
