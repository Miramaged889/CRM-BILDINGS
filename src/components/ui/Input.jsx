import React, { forwardRef } from "react";
import { motion } from "framer-motion";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        whileFocus={{ scale: 1.02 }}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-md
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          focus:shadow-lg hover:shadow-lg
          transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
