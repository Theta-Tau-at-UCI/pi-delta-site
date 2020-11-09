import { Button, Modal } from "react-bootstrap";
import React, { Fragment } from "react";


export default class Recruitment extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <section> Spring Rush 2021 </section>
                <section> Our Last Rush </section>
                <section> Frequently Asked Questions </section>
            </Fragment>
        );
    }
}