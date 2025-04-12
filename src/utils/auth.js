
import supabase from "./supabase"

export const signUp = async (email,password,username)=>{

    let { data, error } =  supabase.auth.signUp({
         email,
        password,
        username
      })
   
    if(data?.user){
        const {data:sessionData} = await supabase.auth.getSession();

        if(!sessionData?.session){
            console.log("we don`t have session data profile creating after login ");
            return data
        }

        const {data:profileData,error:profileError} = await supabase
        .from("users")
        .insert({
            id:sessionData.user.id,
            username:sessionData.user.username,
            avatar_url:null
        })
        .select()
        .single()

        if(profileError){
            console.log("profile creating error",error);
            return;
        }

        console.log("profile creation successfully ",profileData);

    }

    return data;
}