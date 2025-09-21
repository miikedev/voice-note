// components/mails/expire-warning.tsx
import React from "react";

interface ExpireWarningProps {
  daysLeft: number;
  name?: string;
}

const ExpireWarning: React.FC<ExpireWarningProps> = ({ daysLeft, name }) => {
  let message = "";

  if (daysLeft <= 0) {
    message = "Your account has expired. Please renew to continue.";
  } else if (daysLeft <= 3) {
    message = `Your account will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please renew soon.`;
  } else if (daysLeft <= 7) {
    message = `Your account will expire in ${daysLeft} days. Don’t forget to renew.`;
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h2>Hello {name || "User"},</h2>
      <p>{message}</p>
      <a
        href="https://yourapp.com/renew"
        style={{
          background: "#2563eb",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Renew Now
      </a>
    </div>
  );
};

export default ExpireWarning;
