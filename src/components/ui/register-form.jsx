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
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import signupSchema from "@/utils/signupSchema"
import { signUp } from "@/utils/auth"

export function LoginForm({
  className,
  ...props
  
}) {
  const {register,handleSubmit,formState:{errors}} = useForm({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit =  (data) =>{
    console.log(data)
    try {
       signUp(data.email,data.password)
    } catch (error) {
      console.log("error",error)
    }

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
                <Label htmlFor="email">Username</Label>
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
                <Button variant="purple" type="submit" className="w-full">
                  Register
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
