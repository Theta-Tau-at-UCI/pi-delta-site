import React from "react";
import { Button, Modal } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default class BrotherProfileCard extends React.Component<
  {
    id: number;
    name: string;
    class: string;
    linkedin_url: string;
    major: string;
    profile_url: string;
    blurb: string;
    casual_photo: string;
    position: string;
    cabby_exec_status: string;
  },
  { isOpen: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <div className="grid-item">
        <LazyLoadImage
          className={"headshot"}
          alt={"profile-pic"}
          src={this.props.profile_url}
          effect={"blur"}
          onClick={this.openModal}
        />
        <p className="names" onClick={this.openModal}>
            {/*{this.props.name}*/}
            {/*{this.props.linkedin_url !== "NULL" ? (*/}
            {/*    <span className={"position"}>*/}
            {/*        <a href={this.props.linkedin_url}*/}
            {/*           rel={"noreferrer"}*/}
            {/*           target={"_blank"}> */}
                        {this.props.name}
                {/*    </a>*/}
                {/*</span>): (this.props.name)}*/}
            {this.props.cabby_exec_status !== "N" ? (
            <span className={"position"}> | {this.props.position}</span>
          ) : null}

        </p>
        <p className="descriptor" onClick={this.openModal}>
          {this.props.major}
            {this.props.linkedin_url !== "NULL" ? (
                <span className={"position"}> |
                    <a href={this.props.linkedin_url}
                       rel={"noreferrer"}
                       target={"_blank"}>  LinkedIn
                    </a>
                </span>): null}
        </p>


        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header>
            <Modal.Title>{this.props.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="headshot-div">
              <LazyLoadImage
                id={"modal-pic"}
                alt={"casual-pic"}
                effect={"blur"}
                src={
                  this.props.casual_photo === "NULL"
                    ? this.props.profile_url
                    : this.props.casual_photo
                }
              />
            </div>
            <div>
              <p className="blurb"> {this.props.blurb}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="close-button" onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
