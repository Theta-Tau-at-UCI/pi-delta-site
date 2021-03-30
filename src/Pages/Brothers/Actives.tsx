import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, {Fragment, ReactEventHandler} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"
import {FaLinkedin} from "react-icons/all";


export default class Actives extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <h1 className = "class-header"> Active Members</h1>
                <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "Y")).map(brother => (
                        <div className="grid-item"><ActiveCard  id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                profile_url={brother.profile_url}
                                                                blurb = {brother.blurb}
                                                                casual_photo = {brother.casual_photo}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}



class ActiveCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, profile_url:string, blurb: string, casual_photo: string}, {isOpen: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });

    render() {
        if (this.props.casual_photo == "NULL") {
            return (
                <div>
                    <img className="headshot" src={this.props.profile_url} onClick={this.openModal}/>
                    <p className="names" onClick={this.openModal}> {this.props.name} </p>
                    <p className="descriptor" onClick={this.openModal}> {this.props.major} </p>

                    <Modal show={this.state.isOpen} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.props.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="headshot-div">
                                <img className="headshot" src={this.props.profile_url}/>
                            </div>
                            <div>
                                <p className="blurb"> {this.props.blurb}</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>

                            <Button className="close-button" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        } else{
            return (
                <div>
                    <img className="headshot" src={this.props.profile_url} onClick={this.openModal}/>
                    <p className="names" onClick={this.openModal}> {this.props.name} </p>
                    <p className="descriptor" onClick={this.openModal}> {this.props.major} </p>

                    <Modal show={this.state.isOpen} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.props.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="headshot-div">
                                <img className="headshot" src={this.props.casual_photo}/>
                            </div>
                            <div>
                                <p className="blurb"> {this.props.blurb}</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>

                            <Button className="close-button" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
}





