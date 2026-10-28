"use client";

import { useState } from "react";
import AuthInput from "./AuthInput";

export default function PasswordInput(props) {
  const [show, setShow] = useState(false);

  return (
    <AuthInput
      icon="fa-solid fa-lock"
      type={show ? "text" : "password"}
      rightSlot={
        <button
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          onClick={() => setShow((s) => !s)}
          type="button"
        >
          <i className={`fa-regular ${show ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
        </button>
      }
      {...props}
    />
  );
}