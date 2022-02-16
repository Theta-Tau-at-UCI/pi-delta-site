import React, { Fragment, useEffect, useState } from "react";
import "./Brothers.css";
import { brotherInfo } from "./brother_info";
import Filter from "./Filter";
import Footer from "../../SharedComponents/Footer/Footer";
import BrotherProfileCard from "./ProfileCards/BrotherProfileCard";
import { AnimatePresence, motion } from "framer-motion";

function BroDev() {
  const [brothers, setBrothers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    const bros = JSON.parse(JSON.stringify(brotherInfo));
    const active_bros = bros.filter(
      (brother: { active_status: string | string[] }) =>
        brother.active_status.includes("Y")
    );
    setBrothers(active_bros);
    setFiltered(active_bros);
  }, []);

  return (
    <Fragment>
      <Filter
        brothers={brothers}
        setFiltered={setFiltered}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <motion.div layout className="grid-container">
        <AnimatePresence>
          {filtered.map((brother) => {
            return (
              <div className="grid-item">
                <BrotherProfileCard
                  id={brother["id"]}
                  name={brother["name"]}
                  class={brother["class"]}
                  linkedin_url={brother["linkedin_url"]}
                  major={brother["major"]}
                  profile_url={brother["profile_url"]}
                  blurb={brother["blurb"]}
                  casual_photo={brother["casual_photo"]}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </Fragment>
  );
}

export default BroDev;
