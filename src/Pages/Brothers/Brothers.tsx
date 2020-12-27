import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, {Fragment, ReactEventHandler} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"


export default class Brothers extends React.Component<{}, {selected: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selected: "Actives"
        }
    }

    toggle_actives = () => {
        this.setState({selected: "Actives"});
    };
    toggle_alumni = () => {
        this.setState({selected: "Alumni"});
    };
    toggle_class = (class_name: string) => {
        this.setState({selected: class_name})
    }

    render() {
        if (this.state.selected === "Actives") {
            return (
                <Fragment>
                    <div className = "buttonBar"><ActiveOrAlumniButton toggle_class={this.toggle_class} toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <h1> Cabinet and Exec Board</h1>

                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "Y")).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />

                            </div>
                        ))}
                    </div>

                    <h1> Actives</h1>
                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "N")).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            </div>
                        ))}
                    </div>
                    <Footer/>
                </Fragment>
            );
        }
        else if (this.state.selected === "Alumni"){
            return(
                <Fragment>
                    <div className = "buttonBar"><ActiveOrAlumniButton toggle_class={this.toggle_class}  toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <h1> Alumni</h1>
                    <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "N")).map(brother =>(
                            <div className="grid-item"> <AlumniCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            </div>
                    ))}
                    </div>
                    <Footer/>
                </Fragment>
            );
        }
        else{
            return(
                <Fragment>
                    <div className = "buttonBar"><ActiveOrAlumniButton  toggle_class = {this.toggle_class} toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <div><h1> {this.state.selected} Class </h1></div>
                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.class == this.state.selected)).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            </div>
                        ))}
                    </div>
                    <Footer/>
                </Fragment>
            );
        }

    }
}


class ActiveOrAlumniButton extends React.Component <{toggle_class: any, toggle_actives: ReactEventHandler, toggle_alumni: ReactEventHandler}, {}>{
    render() {

        let classes = ["Founding", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
            "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Tau"]

        return (
                <div className = "text-right">
                    <button type="button" id = "actives-button" className="btn" onClick = {this.props.toggle_actives}>Actives</button>
                    <button type="button" id = "alumni-button" className="btn" onClick = {this.props.toggle_alumni}>Alumni</button>
                    <DropdownButton className = "d-inline-block" id="class-button" title="Class"  >
                        {classes.map((class_name) =>  <Dropdown.Item  onClick = {() => this.props.toggle_class(class_name)}>{class_name}</Dropdown.Item>)}
                    </DropdownButton>
                </div>
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
                <p className = "majors" onClick = {this.openModal}> {this.props.major} </p>

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

class AlumniCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, cabby_exec_status: string, profile_url:string}, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <a href={this.props.profile_url}> <p className = "brother-text"> {this.props.name}</p> </a>
            </div>
        );
    }
}




