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
                <Image src={this.props.img} alt="Picture of Pillar" fluid />
                <div className="col">
                    <div className="pillar-title">{this.props.value}</div>
                    <div className="pillar-description">{this.props.description}</div>
                </div>
            </div>
        );
    }
}
