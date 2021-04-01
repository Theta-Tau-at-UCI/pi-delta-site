import React from "react";
import "./Pillar.css"
import {Card} from "react-bootstrap";

export default class Pillar extends React.Component<{img: string, value: string, description: string}, {}> {
    render() {
        return (
            <Card className={"pillar"}>
                <Card.Body>
                    <Card.Title>
                        {this.props.value}
                    </Card.Title>
                    <Card.Text className={"pillar-text"}>
                        {this.props.description}
                    </Card.Text>

                </Card.Body>
            </Card>


        );
    }
}
