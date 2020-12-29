import React, {Fragment} from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"
import Footer from "../../SharedComponents/Footer/Footer"
import {Dropdown, DropdownButton} from "react-bootstrap";

export default class Classes extends React.Component<{}, {selected: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selected: "Founding"
        }
    }

    toggle_class = (class_name: string) => {
        this.setState({selected: class_name})
    }

    render() {
        let classes = ["Founding", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
            "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Tau"]

        return (
            <Fragment>
                <div className = "container"> <h1> {this.state.selected}</h1> </div>

                <div className = "text-right">
                    <DropdownButton className = "d-inline-block" id="class-button" title="Class"  >
                        {classes.map((class_name) =>  <Dropdown.Item  onClick = {() => this.toggle_class(class_name)}>{class_name}</Dropdown.Item>)}
                    </DropdownButton>
                </div>
                <div className=" grid-container">
                    {brotherInfo.filter(brother => (brother.class === this.state.selected)).map(brother => (
                        <div className="grid-item"><BrotherCard id={brother.id} name={brother.name}
                                                               major={brother.major}
                                                               profile_url={brother.profile_url}/>
                        </div>
                    ))}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}



class BrotherCard extends React.Component<{id: number, name: string, major: string, profile_url:string}, {isOpen: boolean}> {
    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            <div>
                <img className = "headshot" src={this.props.profile_url} />
                <p className = "names"> {this.props.name} </p>
                <p className= "descriptor"> {this.props.major}  </p>
            </div>
        );
    }
}





