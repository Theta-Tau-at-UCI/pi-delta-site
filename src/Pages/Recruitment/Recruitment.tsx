
import React, { Fragment } from "react";
import Faq from "./faq";
import CurrentRush from "./current_rush";
import Footer from "../../SharedComponents/Footer/Footer"

export default class Recruitment extends React.Component<{}, {}> {

    render() {
        return (
            <Fragment>
                <CurrentRush />
                <div className = "container">
                    <Faq/>
                </div>
                <Footer />
            </Fragment>

        );
    }
}