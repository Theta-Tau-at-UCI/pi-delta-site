import React, {Fragment} from "react";
import "./Brothers.css"
import Filter from "./Filter"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"
import BrotherProfileCard from "./ProfileCards/BrotherProfileCard";


export default class Actives extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Filter />
                <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "Y")).map(brother => (
                        <div className="grid-item"><BrotherProfileCard  id={brother.id} name={brother.name}
                                                                        class={brother.class}
                                                                        linkedin_url={brother.linkedin_url}
                                                                        major={brother.major}
                                                                        profile_url={brother.profile_url}
                                                                        blurb = {brother.blurb}
                                                                        casual_photo = {brother.casual_photo}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}