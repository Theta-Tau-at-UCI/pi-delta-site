/*import { Button, Modal } from "react-bootstrap"; */
import React, { Fragment } from "react";
import "./About.scss"


export default class About extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <section className = "section-header"> Our Chapter</section>

                <section className = "section-header"> Our Pillars</section>

                <section className = "section-header"> Theta Tau </section>

                <section className = "section-header"> The Theta Tau Brotherhood </section>
            </Fragment>
        );
    }
}