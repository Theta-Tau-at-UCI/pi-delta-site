import React from "react";
import { Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";

export default class OfficerProfileCard extends React.Component<
  {
    id: number;
    name: string;
    class: string;
    linkedin_url: string;
    major: string;
    cabby_exec_position: string | undefined;
    profile_url: string;
    casual_photo: string;
    blurb: string;
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
    if (this.props.casual_photo != "NULL") {
      return (
        <motion.div
          layout
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          <img
            className="headshot"
            src={this.props.profile_url}
            onClick={this.openModal}
          />
          <p className="names" onClick={this.openModal}>
            {" "}
            {this.props.name}{" "}
          </p>
          <p className="descriptor" onClick={this.openModal}>
            {" "}
            {this.props.cabby_exec_position}{" "}
          </p>

          <Modal show={this.state.isOpen} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="headshot-div">
                <img className="headshot" src={this.props.casual_photo} />
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
        </motion.div>
      );
    } else {
      return (
        <motion.div
          layout
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          <img
            className="headshot"
            src={this.props.profile_url}
            onClick={this.openModal}
          />
          <p className="names" onClick={this.openModal}>
            {" "}
            {this.props.name}{" "}
          </p>
          <p className="descriptor" onClick={this.openModal}>
            {" "}
            {this.props.cabby_exec_position}{" "}
          </p>

          <Modal show={this.state.isOpen} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="headshot-div">
                <img className="headshot" src={this.props.profile_url} />
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
        </motion.div>
      );
    }
  }
}
