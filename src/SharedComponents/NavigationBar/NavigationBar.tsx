import React from "react";
import navbar_brand from "../../Media/tt-graphics/navbar-brand.png"
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./NavigationBar.css"



class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar className="color-nav" expand="md" sticky="top">
                <Navbar.Brand href="/">
                    <img src={navbar_brand} alt="theta-tau-logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link id = "nav-about"  href="/about">About</Nav.Link>
                        <Nav.Link id = "nav-recruitment"  href="/recruitment">Recruitment</Nav.Link>
                        <NavDropdown id = "nav-brothers"  title = "Brothers">
                            <NavDropdown.Item href="/actives">Actives</NavDropdown.Item>
                            <NavDropdown.Item href="/officers">Officers</NavDropdown.Item>
                            <NavDropdown.Item href="/classes">Classes</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;