import React from "react";
import tt_logo_placeholder from "../../Media/tt-logo.png";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./NavigationBar.css"



class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar className="color-nav" expand="md" sticky="top">
                <Navbar.Brand href="/">
                    <img src={tt_logo_placeholder} alt="theta-tau-logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link id = "nav-about" className = "mx-5" href="/about">About</Nav.Link>
                        <Nav.Link id = "nav-recruitment" className = "mx-5" href="/recruitment">Recruitment</Nav.Link>
                        <NavDropdown id = "nav-brothers" className = "mx-5" title = "Brothers"></NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;