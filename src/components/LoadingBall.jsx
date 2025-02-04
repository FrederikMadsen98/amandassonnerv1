import React from "react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { motion } from "framer-motion";

const LoadingBall = () => {
  return (
    <motion.div
      initial={{ x: "-100vw" }}
      animate={{ x: "100vw" }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", top: "50%", left: 0, fontSize: 50 }}
    >
      <SportsSoccerIcon fontSize="large" style={{ color: "black" }} />
    </motion.div>
  );
};

export default LoadingBall;