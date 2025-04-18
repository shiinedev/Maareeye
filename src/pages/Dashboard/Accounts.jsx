import AccountForm from "@/components/AccountForm";

import React from "react";

const Accounts = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
     <AccountForm />
    </div>
  );
};

export default Accounts;
