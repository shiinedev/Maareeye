import supabase from "./supabase";


export const createAccount = async (account) => {
    console.log(account);

    try {
        const { data: newAccount, error } = await supabase
          .from("account")
          .insert([account])
          .select()
          .single();
    
        if (error) throw error;
    
        console.log("Account created successfully:", newAccount);
    
        if (newAccount.is_default) {
          // Reset all other accounts' default status
          const { error: resetError } = await supabase
            .from("account")
            .update({ is_default: false })
            .neq("id", newAccount.id);
    
          if (resetError) throw resetError;
    
          // Ensure the new account remains default
          const { data: updatedAccount, error: updateError } = await supabase
            .from("account")
            .update({ is_default: true })
            .eq("id", newAccount.id);
    
          if (updateError) throw updateError;
    
          console.log("Default status updated:", updatedAccount);
          return updatedAccount;
        }
    
        return newAccount;
      } catch (error) {
        console.error("Error creating account:", error);
        throw error;
      }
  

}


// get all accounts by user id
export const getAccountsByUserId = async (userId) => {
    const { data, error } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", userId)
      .order( 'is_default', { ascending :  false });

    if (error) {
      console.log("error fetching accounts", error);
      throw error;
    }
  
    return data;
  }



// get default account by user id
export const getDefaultAccountByUserId = async (userId) => {
    const { data, error } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single();
  
    if (error) {
      console.log("error fetching default account", error);
      throw error;
    }
  
    return data;
  }


  // update default account by accountId
export const updateDefaultAccount = async (accountId) =>{
        try {
          // Step 1: Set all accounts to false
          const { error: resetError } = await supabase
            .from("account")
            .update({ is_default: false })
            .neq("id", accountId);
      
          if (resetError) throw resetError;
      
          // Step 2: Set selected account to true
          const {data, error: updateError } = await supabase
            .from("account")
            .update({ is_default: true })
            .eq("id", accountId);
      
          if (updateError) throw updateError;
      
          return data;
        } catch (error) {
          console.error("Failed to set default account:", error);
          throw error
        }
      };
      
export const deleteAccountById = async(id) =>{
  const {data,error} = await supabase
  .from("account")
  .delete()
  .eq("id",id)
  .select()
  .single()

  if(error){
    console.log("error deleting account");
    throw error;
  }

  console.log("successfully deleting account",data);
}