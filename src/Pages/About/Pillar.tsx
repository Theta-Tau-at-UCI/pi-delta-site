import React, {Fragment} from "react";
import './Pillar.css'
import tt_logo_placeholder from "../../Media/tt-wordmark-uci.png";

export default class Pillar extends React.Component<{img: string, value: string, description: string}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <img src={this.props.img} alt="Picture of Pillar"></img>
                <div className="col">
                    <h2>{this.props.value}</h2>
                    <div className="description">{this.props.description}</div>
                </div>
            </div>
        );
    }
}
