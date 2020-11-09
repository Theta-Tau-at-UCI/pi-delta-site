import React, { Fragment } from "react";
import "./Footer.css"

export default class Brothers extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <section className= "footer"> <h1 className = "footer-text"> Footer Placeholder</h1></section>
            </Fragment>

        );
    }
}

