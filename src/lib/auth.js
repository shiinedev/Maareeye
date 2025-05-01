
import supabase from "./supabase"

export const signUp = async (email,password)=>{

  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

      if(error) throw error;
   
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


    }

    return data;
}

export const signIn = async (email,password) =>{
    
let { data, error } = await supabase.auth.signInWithPassword({
    email:email,
    password:password
  })

  if(error) throw error;
  console.log(data)

  if(data?.user){
    try {
        const profile = await getUserProfile(data?.user.id);
      
    } catch (profileError) {
        throw profileError
    }
  }

  return data;
}


export async function getUserProfile(userId) {
 
    
    // Debug: Check if we have a valid session
    const { data: sessionData } = await supabase.auth.getSession()
  
    
    // First, try to get the existing profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    // If no profile exists, create one
    if (error && error.code === 'PGRST116') {
      console.log('No profile found, attempting to create one for user:', userId)
      
      // Get user email to derive username if needed
      const { data: userData } = await supabase.auth.getUser()

      
      const email = userData?.user?.email || ''
      const defaultUsername = email ? email.split('@')[0] : `user_${Date.now()}`
      
      // Create a new profile
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          username:defaultUsername,
          avatar_url: null
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Profile creation error:', insertError)
        throw insertError
      }
      
      return newProfile
    }
    
    if (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
    
    return data
  }
  
export const onAuthChange =  (callback)=>{
    const{data } = supabase.auth.onAuthStateChange((event,session)=>{
        callback(session?.user || null ,event)
    })

    return ()=> data.subscription.unsubscribe();
}

export const singOut = async ()=>{
    await supabase.auth.signOut();
}

