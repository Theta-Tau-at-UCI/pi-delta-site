
import React, {Fragment} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"


export default class Alumni extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <h1> Alumni</h1>
                <div className="grid-container">
                    {brotherInfo.filter(brother => (brother.active_status === "N")).map(brother => (
                        <div className="grid-item"><AlumniCard id={brother.id} name={brother.name}
                                                                class={brother.class}
                                                                profile_url={brother.profile_url}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}



class AlumniCard extends React.Component<{id: number, name: string, class: string, profile_url:string}, {isOpen: boolean}> {
    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            <div>
                <img className = "headshot" src={this.props.profile_url} />
                <p className = "names"> {this.props.name} </p>
                <p className= "descriptor"> {this.props.class} Class </p>
            </div>
        );
    }
}





