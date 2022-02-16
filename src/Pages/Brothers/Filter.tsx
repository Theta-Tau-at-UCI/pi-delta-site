import React, { useEffect } from "react";

// @ts-ignore
function Filter({ brothers, setFiltered, activeFilter, setActiveFilter }) {
  useEffect(() => {
    if (activeFilter === 0) {
      const filtered = brothers.filter(
        (brother: { active_status: string | string[] }) =>
          brother.active_status.includes("Y")
      );
      setFiltered(filtered);
    }

    if (activeFilter === 1) {
      const filtered = brothers.filter(
        (brother: {
          active_status: string | string[];
          cabby_exec_status: string | string[];
        }) =>
          brother.active_status.includes("Y") &&
          brother.cabby_exec_status.includes("Y")
      );
      setFiltered(filtered);
    }

    if (activeFilter === 2) {
      setActiveFilter(brothers);
      return;
    }
  }, [activeFilter]);

  return (
    <div className="filter-container">
      <button
        className={activeFilter === 0 ? "active" : ""}
        onClick={() => setActiveFilter(0)}
      >
        Actives
      </button>

      <button
        className={activeFilter === 1 ? "active" : ""}
        onClick={() => setActiveFilter(1)}
      >
        Officers
      </button>

      <button
        className={activeFilter === 2 ? "active" : ""}
        onClick={() => setActiveFilter(2)}
      >
        Classes
      </button>
    </div>
  );
}

export default Filter;
