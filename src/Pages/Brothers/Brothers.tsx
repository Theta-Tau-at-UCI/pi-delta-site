import { Button, Modal, Dropdown, DropdownButton } from "react-bootstrap";
import React, { Fragment } from "react";
import "./Brothers.css"

export default class Brothers extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Fragment>
               <div><SelectPage/> </div>
            </Fragment>
        );
    }
}

class SelectPage extends React.Component {
    classes = ["Founding", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda",
                "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Tau"]

    render() {
        return (
            <DropdownButton id="button" title="Class">
                {this.classes.reverse().map((class_name) =>  <Dropdown.Item href="#/action-1">{class_name}</Dropdown.Item>)}
            </DropdownButton>
        );
    }
}


