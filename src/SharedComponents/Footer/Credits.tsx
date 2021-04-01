import "./Credits.css"
import React, {Fragment, ReactEventHandler} from "react";
import {Modal} from "react-bootstrap";




export default class Credits extends React.Component<{}, { windowWidth: any, isOpen: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {windowWidth: window.innerWidth, isOpen: false};
    }


    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });


handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    render(){
        return (
            <Fragment>
                <div className="row">
                    <a id = "credits-blurb" className="col" onClick={this.openModal}>Site Developed by 2020-21 Web Dev Committee</a>
                </div>

                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton onClick = {this.closeModal}>
                    <h5> 2020-21 Web Dev Committee</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <ul>
                                <li> Aaron Liang - <span id = "chair"> Director </span> </li>
                                <li> Cameron Sherry</li>
                                <li> Joshua Liu</li>
                                <li> Areeta Wong</li>
                                <li> Taekyoo Won</li>
                                <li> Lauren Yoo</li>
                                <li> Maireen Espiritu</li>
                                <li> Justin Ho</li>
                                <li> Claire Hyon</li>
                            </ul>

                        </div>
                    </Modal.Body>
                </Modal>
            </Fragment>
        )
    }
}