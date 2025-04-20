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

export const getTransactions = async () => {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error getting transactions", error);
    throw error;
  }

  return data;
}

export const deleteTransactions = async (ids) => {
  console.log(ids)
  const { data, error } = await supabase
    .from("transaction")
    .delete()
    .in("id", ids)
    .select()

  if (error) {
    console.log("error deleting transaction", error);
    throw error;
  }

  return data;
}
