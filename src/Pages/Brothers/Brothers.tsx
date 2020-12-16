import { Button, Modal, Dropdown, DropdownButton, Container } from "react-bootstrap";
import React, { Fragment } from "react";
import "./Brothers.css"
import {brotherInfo} from "./brother_info.js"

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';
// import tileData from './tileData';


export default class Brothers extends React.Component<{}, {selected: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selected: "Actives"
        }
    }


    render() {
        if (this.state.selected === "Actives") {
            return (
                <Fragment>
                    <div><SelectClass/><ActiveOrAlumniButton/></div>
                    <h1> Cabinet and Exec Board</h1>
                    {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "Y")).map(brother =>(
                            <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />
                    ))}

                    <h1> Actives</h1>
                    {brotherInfo.filter(brother => (brother.active_status === "Y" && brother.cabby_exec_status === "N")).map(brother =>(
                        <li>
                            <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />

                        </li>
                    ))}
                </Fragment>
            );
        }
        else if (this.state.selected === "Alumni"){
            return(
                <Fragment>
                    <div><SelectClass/><ActiveOrAlumniButton/></div>
                    {brotherInfo.filter(brother => (brother.active_status === "N")).map(brother =>(
                        <li>
                            <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />

                        </li>
                    ))}
                </Fragment>
            );
        }
        else{
            return(
                <Fragment>
                    <div><SelectClass/><ActiveOrAlumniButton/></div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        {brotherInfo.filter(brother => (brother.class === this.state.selected)).map(brother =>(
                            <li>
                                <BrotherCard id= {brother.id} name = {brother.name} class = {brother.class}  linkedin_url = {brother.linkedin_url} major = {brother.major} cabby_exec_status = {brother.cabby_exec_status} profile_url = {brother.profile_url} />

                            </li>
                        ))}
                    </div>

                </Fragment>
            );
        }

    }
}

class SelectClass extends React.Component {
    render() {
        let classes = new Set()
        for (const brother of brotherInfo){
            classes.add(brother.class)
        }
        return (
            <DropdownButton id="button" title="Class">
                {/*{Array.from(classes).map((class_name) =>  <Dropdown.Item href="#/action-1">{class_name}</Dropdown.Item>)}*/}
            </DropdownButton>
        );
    }
}

class ActiveOrAlumniButton extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <button type="button" id = "button" className="btn">Actives</button>
                    <button type="button" id = "button" className="btn">Alumni</button>
                </div>
            </div>
        );
    }
}

class BrotherCard extends React.Component<{id: number, name: string, class: string, linkedin_url: string, major: string, cabby_exec_status: string, profile_url:string}, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <img src={this.props.profile_url}  />
            </div>
        );
    }
}




