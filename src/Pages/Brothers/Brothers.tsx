import React, { Fragment, useEffect, useState } from "react";
import "./Brothers.css";
import { brotherInfo } from "./brother_info";
import Filter from "./Filter";
import Footer from "../../SharedComponents/Footer/Footer";
import BrotherProfileCard from "./BrotherProfileCard";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import Classes from "./Classes";

function BroDev() {
  const [brothers, setBrothers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    const bros = JSON.parse(JSON.stringify(brotherInfo));
    setBrothers(bros);
    const filtered = bros.filter(
      (brother: { active_status: string | string[] }) =>
        brother.active_status.includes("Y")
    );
    setFiltered(filtered);
  }, []);

  return (
    <Fragment>
      <Filter
        brothers={brothers}
        setFiltered={setFiltered}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="grid-container">
        {activeFilter < 3 ? (
          filtered.map((brother) => {
            return (
              <LazyLoadComponent>
                <BrotherProfileCard
                  key={brother["id"]}
                  id={brother["id"]}
                  name={brother["name"]}
                  class={brother["class"]}
                  linkedin_url={brother["linkedin_url"]}
                  major={brother["major"]}
                  profile_url={brother["profile_url"]}
                  blurb={brother["blurb"]}
                  casual_photo={brother["casual_photo"]}
                  position={brother["cabby_exec_position"]}
                />
              </LazyLoadComponent>
            );
          })
        ) : (
          <Classes brothers={brothers} selected={activeFilter - 3} />
        )}
      </div>
      <Footer />
    </Fragment>
  );
}

export default BroDev;
