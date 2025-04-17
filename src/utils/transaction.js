import supabase from "./supabase";

export const createTransaction = async (transaction) => {
  console.log(transaction);

  const { data, error } = await supabase
    .from("transaction")
    .insert([transaction])
    .select()
    .single()

    if(error){
        console.log("error creating transaction",error);
        throw error;
    }

 
    return data;

};
