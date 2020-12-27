import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, {Fragment, ReactEventHandler} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"


export default class Classes extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <h1> Cabinet and Exec Board</h1>
                <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status=="Y")).map(brother => (
                        <div className="grid-item"><BrotherCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                cabby_exec_status={brother.cabby_exec_status}
                                                                profile_url={brother.profile_url}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}



class BrotherCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, cabby_exec_status: string, profile_url:string}, {isOpen: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });

    render() {
        return (
            <div>
                <img className = "headshot" src={this.props.profile_url} onClick = {this.openModal} />
                <p className = "names" onClick = {this.openModal}> {this.props.name} </p>
                <p className = "descriptor" onClick = {this.openModal}> {this.props.major} </p>

                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><img className = "headshot" src={this.props.profile_url}/></Modal.Body>
                    <Modal.Footer>
                        <Button className = "close-button" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}





