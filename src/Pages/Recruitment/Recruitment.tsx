// import { Button, Modal } from "react-bootstrap";
import React, { Fragment } from "react";
import "./faq";
import "./last_rush";
import CurrentRush from "./current_rush";
import Footer from "../../SharedComponents/Footer/Footer"

export default class Recruitment extends React.Component<{}, {}> {

    render() {
        return (
            <Fragment>
                <CurrentRush />
                <section> Our Last Rush </section>
                <section> Frequently Asked Questions </section>
                <Footer />
            </Fragment>
        );
    }
}