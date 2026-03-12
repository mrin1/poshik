"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentModalProps } from "@/typescript/interface/payment";


export function PaymentModal({ isOpen, onClose, onConfirm, total, isProcessing }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
        
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-10 space-y-8">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-emerald-600" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Secure Checkout</h3>
              <p className="text-slate-500 font-medium text-sm">You are about to pay</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter pt-2">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 py-3 rounded-xl">
               <ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-bit Encrypted Transaction
            </div>

            <Button 
              onClick={onConfirm}
              disabled={isProcessing}
              className="w-full h-16 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...</>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}