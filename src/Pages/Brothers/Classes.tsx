import React, {Fragment} from "react";
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"
import {Button, Dropdown, DropdownButton, Modal} from "react-bootstrap";
import "./Brothers.css"

export default class Classes extends React.Component<{}, {selected: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selected: "Founding"
        }
    }

    classes = ["Founding", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
        "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Tau"]

    toggle_class = (class_name: string) => {
        this.setState({selected: class_name})
    }

    render() {

        return (
            <Fragment>
                <div>
                    <h1 className = "class-header"> {this.state.selected} Class</h1>
                    <div className = "text-right">
                    <DropdownButton className = "d-inline-block" id="class-button" title="Class"  >
                        {this.classes.map((class_name) =>  <Dropdown.Item  onClick = {() => this.toggle_class(class_name)}>{class_name}</Dropdown.Item>)}
                    </DropdownButton>
                    </div>
                </div>
                <div className=" grid-container">
                    {brotherInfo.filter(brother => (brother.class === this.state.selected)).map(brother => (
                        <div className="grid-item"><BrotherCard  id={brother.id} name={brother.name}
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

class BrotherCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, profile_url:string, blurb: string, casual_photo: string}, {isOpen: boolean}> {
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







