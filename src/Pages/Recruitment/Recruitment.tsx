import { Button, Modal } from "react-bootstrap";
import React, { Fragment } from "react";
import "./current_rush";
import "./faq";
import "./last_rush";
import CurrentRush from "./current_rush";

export default class Recruitment extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <CurrentRush />
                <section> Our Last Rush </section>
                <section> Frequently Asked Questions </section>
            </Fragment>
        );
    }
}