import supabase from "./supabase";

export const createPlan = async (plan) => {
    console.log(plan);
    
    const { data, error } = await supabase
      .from("plans")
      .insert([plan])
      .select()
      .single();
  
    if (error) {
      console.log("error creating plan", error);
      throw error;
    }
    
    console.log("plan created successfully")
    return data;
  };




  //calculate the next subscription date based on the start date and interval
  function calculateNextSubscriptionDate(startDate, interval) {
    const date = new Date(startDate);
  
    switch (interval) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  
    return date;
  }


// get all plans 
export const getPlansForAccount = async (accountId)=>{
  const { data, error } = await supabase
  .from("plans")
  .select("*")
  .eq("accountId",accountId)

if (error) {
  console.log("error getting plans", error);
  throw error;
}

console.log(data)
return data;

}

// get plans by id
export const getPlanById = async (id)=>{
  const { data, error } = await supabase
  .from("plans")
  .select()
  .eq("id",id)
  .single()

if (error) {
  console.log("error getting update plan", error);
  throw error;
}

console.log(data)
return data;

}

// update plans
export const updatePlan = async (id, plan) => {
  const { data, error } = await supabase
    .from("plans")
    .update([plan])
    .eq("id", id)

    

  if (error) {
    console.error("Update error:", error);
    throw error;
  }


};