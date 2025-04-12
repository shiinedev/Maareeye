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

export function LoginForm({
  className,
  ...props
  
}) {
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("submitted")
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input id="username" type="text" placeholder="Enter Username"  />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" placeholder="*********" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                </div>
                <Input id="ConfirmPassword" type="password" placeholder="*********" required />
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
