import "./Credits.css";
import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";

export default class Credits extends React.Component<{}, { isOpen: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { isOpen: false };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <Fragment>
        <div className="row">
          <h3 id="credits-blurb" className="col" onClick={this.openModal}>
            Click to See the Devs!
          </h3>
        </div>

        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton onClick={this.closeModal}>
            <h5>Developed with Love By:</h5>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ul>
                <li>Cameron Sherry - 2021-2022 WebDev Director</li>
                <li>Aaron Liang - 2020-2021 WebDev Director</li>
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
