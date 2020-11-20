import React from "react";
import tt_logo_placeholder from "../../Media/tt-logo.png";
import { Nav, Navbar } from "react-bootstrap";
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
                        <Nav.Link className = "mx-5" href="/about"><strong>About</strong></Nav.Link>
                        <Nav.Link className = "mx-5" href="/recruitment"><strong>Recruitment</strong></Nav.Link>
                        <Nav.Link className = "mx-5" href="/brothers"><strong>Brothers</strong></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;