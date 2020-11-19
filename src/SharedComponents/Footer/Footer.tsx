import React, { Fragment } from "react";
import "./Footer.css"
import tt_logo_placeholder from "../../Media/tt-logo.png";
import {FaInstagram, FaFacebook} from 'react-icons/fa';
import {HiOutlineMail} from "react-icons/all";
import {Navbar} from "react-bootstrap";
// icons sourced from https://react-icons.github.io/search

export default class Footer extends React.Component<{}, { selected: string }> {
    render() {
        return (
            <Fragment>
                <section className= "footer">
                    <div className="row">
                        <div className="col">Theta Tau </div>
                        <div className="col">About</div>
                        <div className="col">Recruitment</div>
                        <div className="col">Contact</div>
                        <div className="w-100"></div>
                        <div className="col first-column"/>
                        <div className="col about-column">
                            <div> Our Chapter</div>
                            <div>Our Values</div>
                            <div>Theta Tau</div>
                        </div>
                        <div className="col recruitment-column">
                            <div>Info</div>
                            <div>FAQ</div>
                            <div>Events</div>

                        </div>
                        <div className="col contact-column">
                            <div><HiOutlineMail/></div>
                            <div> <a href = "https://www.instagram.com/thetatauuci/"><FaInstagram/> @thetatauuci </a> </div>
                            <div><FaFacebook/> Facebook</div>
                        </div>

                    </div>
                    <div className="row credits">
                        <div className="col">Site Developed by 2020-21 Web Dev Committee</div>
                    </div>

                </section>
            </Fragment>

        );
    }
}

