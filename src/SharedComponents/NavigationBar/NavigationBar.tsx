import React from "react";
import navbar_brand from "../../Media/tt-graphics/navbar-brand.png";
import { Nav, Navbar } from "react-bootstrap";
import "./NavigationBar.css";

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
            <Nav.Link id="nav-brothers-dev" href="/brothers">
              Brothers
            </Nav.Link>
            <Nav.Link id="nav-recruitment" href="/recruitment">
              Recruitment
            </Nav.Link>
            <Nav.Link id="nav-about" href="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
