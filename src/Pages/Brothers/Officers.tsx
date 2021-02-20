import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, {Fragment, ReactEventHandler} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"


export default class Officers extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        let cabinet = ["Brotherhood", "Fundraising", "Engineering", "Media", "Professional Development", "Public Relations", "Recruitment", "Service", "Website Development"]
        let exec = ["Regent", "Vice Regent", "Scribe", "Treasurer", "Corresponding Secretary", "Marshal"]


        return (
            <Fragment>
                <h1 className = "class-header"> Executive Board</h1>
                <div className="grid-container">
                    {(brotherInfo.filter(brother => (brother.active_status === "Y" && (brother.cabby_exec_position !== "NULL" && exec.includes(brother.cabby_exec_position)))).sort((a, b) => exec.indexOf(a.cabby_exec_position) - exec.indexOf(b.cabby_exec_position)
                        )).map(brother => (
                        <div className="grid-item"><OfficerCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                cabby_exec_position = {brother.cabby_exec_position}
                                                                profile_url={brother.profile_url}/>
                        </div>
                    ))}
                </div>
                <h1> Cabinet </h1>
                <div className="grid-container">
                    {(brotherInfo.filter(brother => (brother.active_status === "Y" && (brother.cabby_exec_position !== undefined && cabinet.includes(brother.cabby_exec_position)))).sort(function(a, b){// @ts-ignore
                        if(a.cabby_exec_position.toLowerCase() < b.cabby_exec_position.toLowerCase()) return -1;
                        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;})).map(brother => (
                        <div className="grid-item"><OfficerCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                cabby_exec_position = {brother.cabby_exec_position}
                                                                profile_url={brother.profile_url}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}



class OfficerCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, cabby_exec_position: string | undefined , profile_url:string}, {isOpen: boolean}> {
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
                <p className = "descriptor" onClick = {this.openModal}> {this.props.cabby_exec_position} </p>

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





