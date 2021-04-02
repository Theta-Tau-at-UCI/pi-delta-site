import React, {Fragment} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"
import OfficerProfileCard from "./ProfileCards/OfficerProfileCard";


export default class Officers extends React.Component<{}, {}> {


    render() {
        let cabinet = ["Brotherhood", "Fundraising", "Engineering", "Media", "Professional Development", "Public Relations", "Recruitment", "Service", "Website Development"]
        let exec = ["Regent", "Vice Regent", "Scribe", "Treasurer", "Corresponding Secretary", "Marshal"]


        return (
            <Fragment>
                <h1 className = "class-header"> Executive Board</h1>
                <div className="grid-container">
                    {(brotherInfo.filter(brother => (brother.active_status === "Y" && (brother.cabby_exec_position !== "NULL" && exec.includes(brother.cabby_exec_position)))).sort((a, b) => exec.indexOf(a.cabby_exec_position) - exec.indexOf(b.cabby_exec_position)
                        )).map(brother => (
                        <div className="grid-item"><OfficerProfileCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                cabby_exec_position = {brother.cabby_exec_position}
                                                                profile_url={brother.profile_url}
                                                                casual_photo = {brother.casual_photo}
                                                                blurb = {brother.blurb}/>
                        </div>
                    ))}
                </div>
                <h1 className = "class-header"> Cabinet </h1>
                <div className="grid-container">
                    {(brotherInfo.filter(brother => (brother.active_status === "Y" && (brother.cabby_exec_position !== undefined && cabinet.includes(brother.cabby_exec_position)))).sort(function(a, b){// @ts-ignore
                        if(a.cabby_exec_position.toLowerCase() < b.cabby_exec_position.toLowerCase()) return -1;
                        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;})).map(brother => (
                        <div className="grid-item"><OfficerProfileCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                linkedin_url={brother.linkedin_url}
                                                                major={brother.major}
                                                                cabby_exec_position = {brother.cabby_exec_position}
                                                                profile_url={brother.profile_url}
                                                                casual_photo = {brother.casual_photo}
                                                                blurb = {brother.blurb}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}









