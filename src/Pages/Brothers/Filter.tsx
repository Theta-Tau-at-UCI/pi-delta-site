import React, { useEffect } from "react";
import { DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

// @ts-ignore
function Filter({ brothers, setFiltered, activeFilter, setActiveFilter }) {
  useEffect(() => {
    if (activeFilter === 0) {
      // Filter out all non-actives
      const filtered = brothers.filter(
        (brother: { active_status: string | string[] }) =>
          brother.active_status.includes("Y")
      );
      setFiltered(filtered);
    }

    // Filter out only active cabby/exec
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
    // eslint-disable-next-line
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
      {/* Class Filter Button */}
      <DropdownButton
        title={"Classes"}
        className={activeFilter > 2 ? "active" : ""}
      >
        <DropdownItem
          className={activeFilter === 3 ? "active" : ""}
          onClick={() => setActiveFilter(3)}
        >
          Founding
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 4 ? "active" : ""}
          onClick={() => setActiveFilter(4)}
        >
          Alpha
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 5 ? "active" : ""}
          onClick={() => setActiveFilter(5)}
        >
          Beta
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 6 ? "active" : ""}
          onClick={() => setActiveFilter(6)}
        >
          Gamma
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 7 ? "active" : ""}
          onClick={() => setActiveFilter(7)}
        >
          Delta
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 8 ? "active" : ""}
          onClick={() => setActiveFilter(8)}
        >
          Epsilon
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 9 ? "active" : ""}
          onClick={() => setActiveFilter(9)}
        >
          Zeta
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 10 ? "active" : ""}
          onClick={() => setActiveFilter(10)}
        >
          Eta
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 11 ? "active" : ""}
          onClick={() => setActiveFilter(11)}
        >
          Theta
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 12 ? "active" : ""}
          onClick={() => setActiveFilter(12)}
        >
          Iota
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 13 ? "active" : ""}
          onClick={() => setActiveFilter(13)}
        >
          Kappa
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 14 ? "active" : ""}
          onClick={() => setActiveFilter(14)}
        >
          Lambda
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 15 ? "active" : ""}
          onClick={() => setActiveFilter(15)}
        >
          Mu
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 16 ? "active" : ""}
          onClick={() => setActiveFilter(16)}
        >
          Nu
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 17 ? "active" : ""}
          onClick={() => setActiveFilter(17)}
        >
          Xi
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 18 ? "active" : ""}
          onClick={() => setActiveFilter(18)}
        >
          Omicron
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 19 ? "active" : ""}
          onClick={() => setActiveFilter(19)}
        >
          Pi
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 20 ? "active" : ""}
          onClick={() => setActiveFilter(20)}
        >
          Rho
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 21 ? "active" : ""}
          onClick={() => setActiveFilter(21)}
        >
          Tau
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 22 ? "active" : ""}
          onClick={() => setActiveFilter(22)}
        >
          Upsilon
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 23 ? "active" : ""}
          onClick={() => setActiveFilter(23)}
        >
          Phi
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 24 ? "active" : ""}
          onClick={() => setActiveFilter(24)}
        >
          Chi
        </DropdownItem>
        <DropdownItem
          className={activeFilter === 25 ? "active" : ""}
          onClick={() => setActiveFilter(25)}
        >
          Psi
        </DropdownItem>
      </DropdownButton>
    </div>
  );
}

export default Filter;
