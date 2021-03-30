import React, {Fragment} from "react";
import './Pillar.css'
import tt_logo_placeholder from "../../Media/tt-wordmark-uci.png";
import Image from 'react-bootstrap/Image'

export default class Pillar extends React.Component<{img: string, value: string, description: string}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="pillar-row">

                <div className="col">
                    <div className="pillar-title"><h2>{this.props.value}</h2></div>
                    <div className="pillar-description"><p className = "pillar-description"> {this.props.description} </p></div>
                </div>
                <div className = "col">
                    <img className = "pillar-photo" src = {this.props.img}/>
                </div>
            </div>
        );
    }
}
