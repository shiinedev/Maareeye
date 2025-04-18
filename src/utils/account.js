import supabase from "./supabase";

const serializeDecimal = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
      serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
      serialized.amount = obj.amount.toNumber();
    }
    return serialized;
  };

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


