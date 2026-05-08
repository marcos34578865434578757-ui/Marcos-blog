"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function MotionReveal({
  children,
  delay = 0,
  className,
}: MotionRevealProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
