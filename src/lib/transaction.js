import supabase from "./supabase";

import { startOfDay, format } from "date-fns";

import { GoogleGenerativeAI } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)

export const createTransaction = async (transaction) => {
  console.log(transaction);

  const { data: accountDat, error: accountError } = await supabase
    .from("account")
    .select("*")
    .eq("id", transaction.accountId)
    .single();

  if (accountError) {
    console.log("error fetching accounts", accountError);
    throw accountError;
  }

  console.log("selected account", accountDat);

  const balance =
    accountDat.balance +
    (transaction.type === "income" ? transaction.amount : -transaction.amount);
  console.log("new balance", balance);

  if (balance < 0 && transaction.type === "expense") {
    throw new Error(
      "You don’t have enough balance in this account for this expense."
    );
  } else if (balance < 0 && transaction.type === "income") {
    throw new Error(
      "An income transaction can't reduce your account balance below zero. Please check the amount and try again."
    );
  }

  console.log("valid transaction");

  const { error: updateError } = await supabase
    .from("account")
    .update({ balance: balance })
    .eq("id", transaction.accountId);

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
    .single();

  if (error) {
    console.log("error creating transaction", error);
    throw error;
  }

  return data;
};

// getTransactionsForAccount
export const getTransactionsForAccountWithPagination = async (accountId,{ offset = 0 , limit = 10} = {}) => {
  const { data,count, error } = await supabase
    .from("transaction")
    .select("*",{ count: "exact" })
    .eq("accountId", accountId) 
    .order("date", { ascending: false })
    .range(offset , offset +limit  -1)

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }



  return {data,count}; 
};


//get transactions for account
export const getTransactionsForAccount = async (accountId) => {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("accountId", accountId) 
    .order("date", { ascending: false })
  if (error) {
    console.error("Error fetching transactions:", error);
    return ;
  }



  return data; 
};

export const getTransactionById = async (id) => {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("error getting transaction by id", error);
    throw error;
  }

  return data;
};

// update transaction
export const updateTransaction = async (id, transaction) => {
 // 1. Fetch the original transaction
const { data: originalTxn, error: txnError } = await supabase
.from("transaction")
.select("*")
.eq("id", id)
.single();

if (txnError) {
console.log("Error fetching original transaction", txnError);
throw txnError;
}

// 2. Fetch account
const { data: accountDat, error: accountError } = await supabase
.from("account")
.select("*")
.eq("id", transaction.accountId)
.single();

if (accountError) {
console.log("error fetching account", accountError);
throw accountError;
}

// 3. Reverse original transaction
let balance = accountDat.balance;
balance += originalTxn.type === "income" ? -originalTxn.amount : originalTxn.amount;

// 4. Apply new transaction
balance += transaction.type === "income" ? transaction.amount : -transaction.amount;

// 5. Validation
if (balance < 0 && transaction.type === "expense") {
throw new Error("You don’t have enough balance in this account for this expense.");
} else if (balance < 0 && transaction.type === "income") {
throw new Error("An income transaction can't reduce your account balance below zero.");
}

// 6. Update balance
const { error: updateError } = await supabase
.from("account")
.update({ balance })
.eq("id", transaction.accountId);

if (updateError) {
console.log("error updating account balance", updateError);
throw updateError;
}

// 7. Update transaction
const preparedTransaction = {
...transaction,
date: new Date(transaction.date).toISOString(),
};

const { data, error } = await supabase
.from("transaction")
.update([preparedTransaction])
.eq("id", id)
.select();

if (error) {
console.log("error updating transaction", error);
throw error;
}

return data;

};

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



//summary of transactions by date

export const getSummaryData = async (transactions = []) => {

  const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((acc, t) => acc + t.amount, 0);
const totalExpense = transactions
  .filter((t) => t.type === "expense")
  .reduce((acc, t) => acc + t.amount, 0);


  // Group by date
  const summaryMap = {};

  transactions.forEach((txn) => {
    const date = format(startOfDay(new Date(txn.date)), "yyyy-MM-dd");

    if (!summaryMap[date]) {
      summaryMap[date] = { date, income: 0, expense: 0 };
    }

    if (txn.type === "income") {
      summaryMap[date].income += txn.amount;
    } else {
      summaryMap[date].expense += txn.amount;
    }
  });

  // Filter out days where both income and expense are zero
  const chartData = Object.values(summaryMap)
    .filter((day) => day.income !== 0 || day.expense !== 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    chartData,  
    totalIncome,
    totalExpense
  };
};


// Function to convert a file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
}


//scan receipt
export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

 
    // Convert ArrayBuffer to Base64
    const base64String = await fileToBase64(file);

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      console.log("response: ",data);
      
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}


