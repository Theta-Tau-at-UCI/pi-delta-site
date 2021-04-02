import React from "react";
import './Pillar.css'


export default class Pillar extends React.Component<{img: string, value: string, description: string}, {windowWidth: any}> {
    constructor(props: any) {
        super(props);
        this.state = { windowWidth: window.innerWidth };
    }

    handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    render() {
        if (this.state.windowWidth > 375){
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
        } else{
            return (
                <div className="pillar-row">
                    <div className="col">
                        <div className="pillar-title"><h2>{this.props.value}</h2></div>
                        <div className="pillar-description"><p className = "pillar-description"> {this.props.description} </p></div>
                        <div> <img className = "pillar-photo" src = {this.props.img}/> </div>
                    </div>
                </div>
            );
        }

    }
}
