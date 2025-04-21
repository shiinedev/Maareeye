import supabase from "./supabase";

export const createTransaction = async (transaction) => {
  console.log(transaction);


  const { data:accountDat, error:accountError } = await supabase
  .from("account")
  .select("*")
  .eq("id", transaction.accountId)
  .single()

if (accountError) {
  console.log("error fetching accounts", accountError);
  throw accountError;
}

console.log("selected account",accountDat)

const balance = accountDat.balance + (transaction.type === "income" ? transaction.amount : -transaction.amount);
console.log("new balance",balance)


if(balance < 0 && transaction.type === "expense"){
  throw new Error("You don’t have enough balance in this account for this expense.");

}else if (balance < 0 && transaction.type === "income"){
    throw new Error("An income transaction can't reduce your account balance below zero. Please check the amount and try again.");
   
}

  console.log("valid transaction");

  const { error:updateError } = await supabase
.from("account")  
.update({ balance: balance })
.eq("id", transaction.accountId)

if (updateError) {  
  console.log("error updating account balance", updateError);
  throw updateError;
}

// Insert transaction (with cleaned/serialized data)
const preparedTransaction = {
  ...transaction,
  date: new Date(transaction.date).toISOString(),
};

  const { data, error } = await supabase
    .from("transaction")
    .insert([preparedTransaction])
    .select()
    .single()

    if(error){
        console.log("error creating transaction",error);
        throw error;
    }

 
    return data;

};



// get All transactions
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

export const getTransactionById = async (id) => {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.log("error getting transaction by id", error);
    throw error;
  }

  return data;
}


// update transaction
export const updateTransaction = async (id, transaction) => {

  console.log("updating transaction",transaction);
  const { data:accountDat, error:accountError } = await supabase
  .from("account")
  .select("*")
  .eq("id", transaction.accountId)
  .single()

  if(accountError) {
    console.log("error fetching accounts", accountError);
    throw accountError;
  }
  
  console.log("selected account",accountDat)

  const balance = accountDat.balance + (transaction.type === "income" ? transaction.amount : -transaction.amount);
  console.log("new balance",balance)

  if(balance < 0 && transaction.type === "expense"){
    throw new Error("You don’t have enough balance in this account for this expense.");
  }else if(balance < 0 && transaction.type === "income"){
    throw new Error("An income transaction can't reduce your account balance below zero. Please check the amount and try again.");
  }
  
  const { error:updateError } = await supabase
  .from("account")  
  .update({ balance: balance })
  .eq("id", transaction.accountId)

  if(updateError) {  
    console.log("error updating account balance", updateError);
    throw updateError;
  }

  const preparedTransaction = {
    ...transaction,
    date: new Date(transaction.date).toISOString(),
  };
  console.log("prepared transaction",preparedTransaction)

const { data, error } = await supabase
.from('transaction')
.update([preparedTransaction ])
.eq('id', id)
.select()
  
    if (error) {
      console.log("error updating transaction", error);
      throw error;
    }
  
    return data;
}

// delete transaction
export const deleteTransactions = async (ids) => {
  console.log("Deleting transactions:", ids);

  // 1. Fetch the transactions first
  const { data: transactions, error: fetchError } = await supabase
    .from("transaction")
    .select("*")
    .in("id", ids);

  if (fetchError) {
    console.log("Error fetching transactions before deletion", fetchError);
    throw fetchError;
  }

  // 2. Group transactions by account
  const accountChanges = {};

  for (const txn of transactions) {
    const change = txn.type === "income" ? -txn.amount : txn.amount;

    if (!accountChanges[txn.accountId]) {
      accountChanges[txn.accountId] = 0;
    }

    accountChanges[txn.accountId] += change;
  }

  // 3. Update each affected account balance
  for (const accountId in accountChanges) {
    const { data: account, error: accountError } = await supabase
      .from("account")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError) {
      console.log("Error fetching account", accountError);
      throw accountError;
    }

    const newBalance = account.balance + accountChanges[accountId];

    const { error: updateError } = await supabase
      .from("account")
      .update({ balance: newBalance })
      .eq("id", accountId);

    if (updateError) {
      console.log("Error updating account balance", updateError);
      throw updateError;
    }
  }

  // 4. Finally, delete the transactions
  const { data: deleted, error: deleteError } = await supabase
    .from("transaction")
    .delete()
    .in("id", ids)
    .select();

  if (deleteError) {
    console.log("Error deleting transactions", deleteError);
    throw deleteError;
  }

  return deleted;
};


// getTransactionsForAccount
export const getTransactionsForAccount = async (accountId) => {
  const { data, error } = await supabase
    .from('transaction')
    .select('*')
    .eq('accountId', accountId) // Filter by the accountId
    .order('date', { ascending: false }); // Sort by date, descending

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data; // Return transactions for the account within the date range
};


//report Data
export const generateReport = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  
  const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const monthlyTrends = transactions.reduce((acc, t) => {
    const month = new Date(t.date).getMonth(); // Group by month
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {});

  return { income, expense, categories, monthlyTrends };
};
