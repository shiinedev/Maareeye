import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import supabase from "@/utils/supabase";
import { uploadImage } from "@/utils/storage";

export default function Profile() {
  const { user, profile ,isLoading} = useAuth();

  const [username, setUsername] = useState("");
  const [Loading,setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, user]);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      let updates={username};
      setLoading(true);
      if(avatar ){
        const {path,imageUrl} = await uploadImage(avatar,user.id,"avatars");
        console.log(imageUrl);

        updates ={
          ...updates,
          avatar_url:imageUrl
        }
        console.log(updates)
      }

        const { data:updatedData, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id',user.id)
        .select()
        .single()
  
      
        
        console.log(updatedData)
        if(error) throw error;

        if(updatedData){
          console.log(updatedData)
          setAvatarUrl(updatedData.avatar_url);
          setUsername(updatedData.username);
        

        toast.success(" profile updated successfully")

      }
    } catch (error) {
      console.log("error uploading avatar",error);
    }finally{
      setLoading(false);
    }
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB");
        return;
      }
      setAvatar(file);

      const previewUrl = URL.createObjectURL(file);

      setAvatarUrl(previewUrl);
    }
  };

  if(isLoading){
    return(
    <div className='min-h-screen flex justify-center items-center'>
        <div className='animate-spin w-12 h-12 rounded-full border-y-2 border-purple-500'>

        </div>
    </div>
    )
}
 

  return (
    <div className="min-h-[90vh] flex items-center justify-center  px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl md:mx-auto space-y-8 p-6  backdrop-blur-xs rounded-xl border  shadow-xs">
        <div  className="flex items-center justify-center gap-6">
          <Avatar className="h-24 w-24 rounded-full border-2  shadow-xs">
            <AvatarImage
              src={avatarUrl}
              className="rounded-full object-cover"
            />
            <AvatarFallback>
              <User size={30} />
            </AvatarFallback>
          </Avatar>
          <Label
            htmlFor="avatar"
            className=" flex justify-center h-24 w-24 rounded-full border-2 border-dashed border-zinc-200/80 dark:border-zinc-800/80 
                             hover:border-zinc-300  hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                             transition-colors shadow-sm">
            <Camera className="h-6 w-6 tex " />
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="@username"
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled
              id="email"
              placeholder="email"
              autoComplete="off"
              defaultValue={user?.email}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit"  disabled={Loading} variant="purple">
           { Loading ? "saving...": "Save Changes"}
            </Button>
        </div>
      </form>
    </div>
  );
}
