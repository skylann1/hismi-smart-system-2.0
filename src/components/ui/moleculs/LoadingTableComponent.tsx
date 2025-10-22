import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const LoadingTableComponent = () => {
  return (
    <div className="w-full bg-white h-[75vh] flex flex-col justify-center items-center gap-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <Image
          src="/assets/undraw/on-the-way.svg"
          alt="Loading illustration"
          width={300}
          height={300}
          className="w-[60%] lg:w-[40%] animate-pulse"
        />
        <motion.div
          className="mt-6 text-gray-600 text-lg font-semibold tracking-wide"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading data, please wait...
        </motion.div>
        <motion.div
          className="mt-4 flex gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full delay-150"></div>
          <div className="w-3 h-3 bg-primary rounded-full delay-300"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingTableComponent;
