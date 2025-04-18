import supabase from "./supabase";

export const createAccount = async (account) => {
    console.log(account);

  const { data, error } = await supabase
    .from("account")
    .insert([account])
    .select()
    .single()

    if(error){
        console.log("error creating transaction",error);
        throw error;
    }

 
    return data;

}