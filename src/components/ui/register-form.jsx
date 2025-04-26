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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/utils/schema"
import { signUp } from "@/utils/auth"
import { useState } from "react"
import toast from "react-hot-toast"


export function RegisterForm({
  className,
  ...props
  
}) {

  const [success,setSuccess] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {register,handleSubmit,formState:{errors}} = useForm({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async(data) =>{
    console.log(data)
    try {

        setIsLoading(true);      
      await signUp(data.email,data.password,data.username);
      toast.success("Account created successfully")

       setSuccess(true);
       setTimeout(()=>{
        navigate("/login");
       
      },3000)
    } catch (error) {
      console.log("error",error)
      toast.error("Error creating account");
    }

  }


    

if (success) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md text-center">
        <Card className="p-8">
          <CardContent className="space-y-4">
            <div className="text-green-500 text-5xl">✓</div>
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p className="text-muted-foreground">
              Your account has been created successfully. Please check your email for verification.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to sign in page in a few seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card >
        <CardHeader>
          <CardTitle className="gradient-title text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className='text-center'>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input {...register("username")}  id="username" type="text" placeholder="Enter Username"  />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} id="email" type="email" placeholder="m@example.com" required />
                {errors.email && <p className="text-red-500 text-sm" >{errors.email.message}</p>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register("password")} id="password" type="password" placeholder="*********" required />
                {errors.password && <p className="text-red-500 text-sm" >{errors.password.message}</p>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                </div>
                <Input {...register("confirmPassword")} id="ConfirmPassword" type="password" placeholder="*********" required />
                {errors.confirmPassword && <p className="text-red-500 text-sm" >{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="purple" type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have  an account? 
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
