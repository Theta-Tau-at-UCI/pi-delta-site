import React, { Fragment } from "react";
import "./Footer.css"
import tt_logo_placeholder from "../../Media/tt-graphics/tt-wordmark-uci.png";
import {FaInstagram, FaFacebook} from 'react-icons/fa';
import {HiOutlineMail} from "react-icons/all";
// icons sourced from https://react-icons.github.io/search

export default class Footer extends React.Component<{}, { windowWidth: any }> {
    constructor(props: {}) {
        super(props);
        this.state = { windowWidth: window.innerWidth };
    }

    handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }
    render() {
        if (this.state.windowWidth > 375){
            return (
                <Fragment>
                    <section className= "footer">
                        <div className="row main-content">
                            <div className="col sm-3 md-3 logo-column">
                                <img className = "logo" src = {tt_logo_placeholder}/>
                                <p> <strong>Engineering Leaders</strong> <i> for Service, Professionalism, and Brotherhood. </i></p>
                            </div>

                            <div className="col sm-3 md-3 about-column">
                                <div className="sm-3 md-3"><strong> About</strong></div>
                                <div><a href = "/about#our-chapter"> Our Chapter </a></div>
                                <div><a href = "/about#our-values">Our Values</a></div>
                                <div><a href = "/actives">Brothers</a></div>
                                <div><a href = "https://thetatau.org/">Theta Tau</a></div>
                            </div>

                            <div className="col sm-3 md-3 recruitment-column">
                                <div className="sm-3 md-3"><strong> Recruitment</strong></div>
                                <div><a href = "recruitment#rush-header"> Info </a></div>
                                <div><a href = "/recruitment#faq"> FAQ</a></div>
                                <div><a href = "/recruitment#events"> Events </a></div>
                            </div>

                            <div className="col sm-3 md-3 contact-column">
                                <div className="sm-3 md-3"><strong> Contact</strong></div>
                                <div className = "email"><HiOutlineMail/> ucithetatau@gmail.com</div>
                                <div> <a href = "https://www.instagram.com/thetatauuci/"><FaInstagram/> @thetatauuci </a> </div>
                                <div> <a href = "https://www.facebook.com/thetatauuci/"> <FaFacebook/> @thetatauuci</a></div>
                            </div>

                        </div>

                        <div className="row credits">
                            <div className="col">Site Developed by 2020-21 Web Dev Committee</div>
                        </div>
                    </section>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <section className= "footer">

                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div><strong> About</strong></div>
                                    <div><a href = "/about#our-chapter"> Our Chapter </a></div>
                                    <div><a href = "/about#our-values">Our Values</a></div>
                                    <div><a href = "/actives">Brothers</a></div>
                                    <div><a href = "https://thetatau.org/">Theta Tau</a></div>
                                </div>
                                <div className="col">
                                    <div><strong> Recruitment</strong></div>
                                    <div><a href = "recruitment#rush-header"> Info </a></div>
                                    <div><a href = "/recruitment#faq"> FAQ</a></div>
                                    <div><a href = "/recruitment#events"> Events </a></div>
                                </div>
                                <div className="col">
                                    <div><strong> Contact</strong></div>
                                    <div><HiOutlineMail/> ucithetatau@gmail.com</div>
                                    <div> <a href = "https://www.instagram.com/thetatauuci/"><FaInstagram/> @thetatauuci </a> </div>
                                    <div> <a href = "https://www.facebook.com/thetatauuci/"> <FaFacebook/> @thetatauuci</a></div>
                                </div>
                            </div>
                        </div>


                        <div className="row main-content">
                            <div className="col sm-12 md-12 logo-column">
                                <img className = "logo" src = {tt_logo_placeholder}/>
                                <p> <strong>Engineering Leaders</strong> <i> for Service, Professionalism, and Brotherhood. </i></p>
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
}

