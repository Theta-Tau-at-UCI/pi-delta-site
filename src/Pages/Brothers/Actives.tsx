import React, { Fragment } from "react";
import "./Brothers.css";
import { brotherInfo } from "./brother_info.js";
import Footer from "../../SharedComponents/Footer/Footer";
import BrotherProfileCard from "./ProfileCards/BrotherProfileCard";
import { FaLinkedin } from "react-icons/all";

export default class Actives extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <h1 className="class-header"> Active Members</h1>
        <div className="grid-container">
          {brotherInfo
            .filter((brother) => brother.active_status === "Y")
            .map((brother) => (
              <div className="grid-item">
                <BrotherProfileCard
                  id={brother.id}
                  name={brother.name}
                  class={brother.class}
                  linkedin_url={brother.linkedin_url}
                  major={brother.major}
                  profile_url={brother.profile_url}
                  blurb={brother.blurb}
                  casual_photo={brother.casual_photo}
                  position={brother.cabby_exec_position}
                />
              </div>
            ))}
        </div>
        <Footer />
      </Fragment>
    );
  }
}
