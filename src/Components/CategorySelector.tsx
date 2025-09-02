"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";

type Category = 'lending' | 'liquid' | 'yield';

type Props = {
  selected: Category;
  onChange: (c: Category) => void;
};

export default function CategorySelector({ selected, onChange }: Props) {
  const {isConnected} = useAccount();
  const base = "px-4 md:px-6 py-2 md:py-3 rounded-full font-medium font-poppins border-2 text-sm md:text-base";
  const active = "bg-transparent border-green-500 text-green-500 shadow-lg scale-105";
  const inactive = "bg-transparent border-green-600 text-green-400 hover:border-green-500 hover:text-green-300";

  return (
    <div className="bg-black border-b border-gray-700 p-3 md:p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className={`${base} ${selected==='lending'?active:inactive}`} onClick={() => onChange('lending')}>
          Lending Pool
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className={`${base} ${selected==='liquid'?active:inactive}`} onClick={() => onChange('liquid')}>
          Liquid Staking
        </motion.button>
        {isConnected ? <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className={`${base} ${selected==='yield'?active:inactive}`} onClick={() => onChange('yield')}>
          Yield Aggregator
        </motion.button> : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className={` border-green-600 text-green-400 hover:border-green-500 hover:text-green-300 bg-gray-400 px-4 md:px-6 py-2 md:py-3 rounded-full font-medium font-poppins border-2 text-sm md:text-base`} >
          Yield Aggregator
        </motion.button>}
      </div>
    </div>
  );
}



