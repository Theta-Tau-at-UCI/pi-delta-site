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
    company?: string;
    company_logo?: string;
    experience?: string[];
    hobbies?: string[];
    fun_fact?: string;
    hometown?: string;
    year?: string;
    linkedin?: string;
    testimonial?: string;

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
          <div className="headshot-wrapper" onClick={this.openModal}>
              <LazyLoadImage
                  className={"headshot"}
                  alt={"profile-pic"}
                  src={this.props.profile_url}
                  effect={"blur"}
              />
              <div className="hover-overlay">
                  {this.props.company_logo && this.props.company_logo !== "NULL" ? (
                      <img
                          src={this.props.company_logo}
                          alt={this.props.company}
                          className="company-logo"
                      />
                  ) : (
                      <span className="company-text">
                        {this.props.company || "N/A"}
                      </span>
                  )}
              </div>

          </div>
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


          <Modal show={this.state.isOpen} onHide={this.closeModal} className="profile-modal">
              <Modal.Header>
                  <Modal.Title>
                      {this.props.position && this.props.position !== "N" && this.props.position !== "NULL"
                          ? this.props.position
                          : "Brother Profile"}
                  </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                  <div className="profile-modal-layout">

                      {/* Left Column: Image + LinkedIn */}
                      <div className="profile-left">
                          <LazyLoadImage
                              id="modal-pic"
                              alt="profile-pic"
                              effect="blur"
                              src={this.props.casual_photo === "NULL" ? this.props.profile_url : this.props.casual_photo}
                          />
                          {this.props.linkedin && (
                              <a
                                  href={this.props.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="linkedin-button"
                              >
                                  View LinkedIn
                              </a>
                          )}
                      </div>

                      {/* Middle Column: Basic Info */}
                      <div className="profile-middle">
                          <h2 className="profile-name">{this.props.name}</h2>
                          <div className="info-box">
                              {this.props.major && <p><strong>Major:</strong> {this.props.major}</p>}
                              {this.props.class && <p><strong>Class:</strong> {this.props.class}</p>}
                              {this.props.year && <p><strong>Graduating Year:</strong> {this.props.year}</p>}
                              {this.props.hometown && <p><strong>Hometown:</strong> {this.props.hometown}</p>}
                          </div>
                      </div>

                      {/* Right Column: Experience + Hobbies */}
                      <div className="profile-right">
                          {this.props.experience && this.props.experience.length > 0 && (
                              <div className="profile-section box-section">
                                  <h6 className="profile-right-heading">Experience</h6>
                                  <ul className="no-bullets">
                                      {this.props.experience.map((e, i) => (
                                          <li key={i}>{e}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}

                          {this.props.hobbies && this.props.hobbies.length > 0 && (
                              <div className="profile-section box-section">
                                  <h6 className="profile-right-heading">Hobbies</h6>
                                  <ul className="no-bullets">
                                      {this.props.hobbies.map((h, i) => (
                                          <li key={i}>{h}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>

                  </div>

                  {/* Testimonial Section */}
                  {this.props.testimonial && (
                      <div className="testimonial-section">
                          <h6>Testimonial</h6>
                          <blockquote>“{this.props.testimonial}”</blockquote>
                      </div>
                  )}
              </Modal.Body>

              <Modal.Footer>
                  <Button className="close-button" onClick={this.closeModal}>Close</Button>
              </Modal.Footer>
          </Modal>

      </div>
    );
  }
}
