"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type GreenCardProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  withHover?: boolean;
};

export default function GreenCard({ title, subtitle, children, className = "", withHover = false }: GreenCardProps) {
  const common = `border border-green-700 rounded-xl p-4 shadow-sm bg-zinc-900 ${className}`;
  if (withHover) {
    return (
      <motion.div className={common} whileHover={{ scale: 1.06, boxShadow: "0 24px 48px rgba(34,197,94,0.28)" }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        {title ? (
          <h2 className="text-2xl font-semibold mb-3 text-green-300">{title}</h2>
        ) : null}
        {subtitle ? (
          <p className="text-lg text-green-200/80 mb-3">{subtitle}</p>
        ) : null}
        {children}
      </motion.div>
    );
  }
  return (
    <div className={common}>
      {title ? (
        <h2 className="text-2xl font-semibold mb-3 text-green-300">{title}</h2>
      ) : null}
      {subtitle ? (
        <p className="text-lg text-green-200/80 mb-3">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}


