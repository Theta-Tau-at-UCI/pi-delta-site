import React, { Fragment } from "react";
import "./Brothers.css";
import BrotherProfileCard from "./BrotherProfileCard";
import { LazyLoadComponent } from "react-lazy-load-image-component";

export default class Classes extends React.Component<
  {
    brothers: any;
    selected: number;
  },
  {}
> {
  classes = [
    "Founding",
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Gamma Beta",
    "Delta Beta",
    "Epsilon Beta",
    "Zeta Beta",
    "Eta Beta",
    "Theta Beta",
  ];

  render() {
    return (
      <Fragment>
        <h1 className="class-header">
          {this.classes[this.props.selected]} Class
        </h1>
        {this.props.brothers
          .filter(
            (brother: { class: string }) =>
              brother.class === this.classes[this.props.selected]
          )
          .map(
            (brother: {
              id: number;
              name: string;
              class: string;
              linkedin_url: string;
              major: string;
              profile_url: string;
              blurb: string;
              casual_photo: string;
              cabby_exec_position: string;
              cabby_exec_status: string;
            }) => (
              <LazyLoadComponent>
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
                  cabby_exec_status={brother.cabby_exec_status}
                />
              </LazyLoadComponent>
            )
          )}
      </Fragment>
    );
  }
}
