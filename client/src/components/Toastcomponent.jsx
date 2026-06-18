import react, { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all ${
      toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {toast.msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={15} /></button>
    </div>
  );
};