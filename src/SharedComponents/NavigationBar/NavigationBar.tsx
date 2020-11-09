import React from "react";
import tt_logo from "../../Media/tt-logo.png";
import { Nav, Navbar } from "react-bootstrap";
import "./NavigationBar.css"


class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar className="color-nav" expand="md" sticky="top">
                <Navbar.Brand href="/">
                    <img src={tt_logo} alt="theta-tau-logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/recruitment">Recruitment</Nav.Link>
                        <Nav.Link href="/brothers">Brothers</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;