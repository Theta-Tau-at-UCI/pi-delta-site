import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, {Fragment, ReactEventHandler} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"



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
                    <div className = "buttonBar"><SelectClass toggle_class = {this.toggle_class}/><ActiveOrAlumniButton toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <h1> Cabinet and Exec Board</h1>

                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "Y")).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            <p className = "names"> {brother.name}</p>
                            </div>
                        ))}
                    </div>

                    <h1> Actives</h1>
                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "N")).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            <p className = "names"> {brother.name}</p>
                            </div>
                        ))}
                    </div>

                </Fragment>
            );
        }
        else if (this.state.selected === "Alumni"){
            return(
                <Fragment>
                    <div className = "buttonBar"><SelectClass toggle_class = {this.toggle_class}/><ActiveOrAlumniButton  toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "N")).map(brother =>(
                            <div className="grid-item"> <AlumniCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            </div>
                    ))}
                    </div>
                </Fragment>
            );
        }
        else{
            return(
                <Fragment>
                    <div className = "buttonBar"><SelectClass toggle_class = {this.toggle_class}/><ActiveOrAlumniButton  toggle_actives={this.toggle_actives} toggle_alumni={this.toggle_alumni}/></div>
                    <div><h1> {this.state.selected} Class </h1></div>
                    <div className="grid-container">
                        {brotherInfo.filter(brother => (brother.class == this.state.selected)).map(brother =>(
                            <div className="grid-item"> <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                            <p className = "names"> {brother.name}</p>
                            </div>
                        ))}
                    </div>

                </Fragment>
            );
        }

    }
}

class SelectClass extends React.Component<{toggle_class: any}, {}> {
    render() {

        let classes = ["Founding", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
        "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Tau"]
        return (
            <DropdownButton id="button" title="Class"  >
                {classes.map((class_name) =>  <Dropdown.Item  onClick = {() => this.props.toggle_class(class_name)}>{class_name}</Dropdown.Item>)}
            </DropdownButton>
        );
    }
}

class ActiveOrAlumniButton extends React.Component <{toggle_actives: ReactEventHandler, toggle_alumni: ReactEventHandler}, {}>{
    render() {
        return (
            <div>
                <div>
                    <button type="button" id = "button" className="btn" onClick = {this.props.toggle_actives}>Actives</button>
                    <button type="button" id = "button" className="btn" onClick = {this.props.toggle_alumni}>Alumni</button>
                </div>
            </div>
        );
    }
}

class BrotherCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, cabby_exec_status: string, profile_url:string}, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <img className = "headshot" src={this.props.profile_url}  />
                <p> {this.props.name}</p>
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




