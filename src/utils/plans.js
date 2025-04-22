import supabase from "./supabase";

export const createPlan = async (plan) => {
    console.log(plan);
  
    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .select("*")
      .eq("id", plan?.accountId)
      .single();
  
    if (accountError) {
      console.log("error fetching account", accountError);
      throw accountError;
    }
  
    console.log("selected account", accountData);
  
    const balance =
      accountData.balance +
      (plan.type === "income" ? plan.amount : -plan.amount);
    console.log("new balance", balance);
  
    if (balance < 0 && plan.type === "expense") {
      throw new Error(
        "You don’t have enough balance in this account for this expense."
      );
    } else if (balance < 0 && plan.type === "income") {
      throw new Error(
        "An income plan can't reduce your account balance below zero. Please check the amount and try again."
      );
    }
  
    console.log("valid plan");
  
    const { error: updateError } = await supabase
      .from("account")
      .update({ balance: balance })
      .eq("id", plan.accountId);
  
    if (updateError) {
      console.log("error updating account balance", updateError);
      throw updateError;
    }
  
    // Insert plan (with cleaned/serialized data)
    const preparedPlan = {
      ...plan,
      date: new Date(plan.date).toISOString(),
      next_time:plan.is_subscription && plan.subscription_time
      ? calculateNextSubscriptionDate(plan.date, plan.subscription_time)
      : null,
    };
  
    const { data, error } = await supabase
      .from("plans")
      .insert([preparedPlan])
      .select()
      .single();
  
    if (error) {
      console.log("error creating plan", error);
      throw error;
    }
  
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