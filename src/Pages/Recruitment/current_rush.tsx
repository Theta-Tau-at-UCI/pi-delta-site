import React, {Component} from 'react';
import "./current_rush.css";
import test from '../../Media/chapter-photos/winter_photoshoot_2020.jpg';
import rush_header from "../../Media/rush/rush-header.png"

class CurrentRush extends Component {
    render() {
        return (
            <div>

                <img id = "rush-header" src = {rush_header} alt = "rush_header"/>
                <div id="rush-blurb">
                    <p className = "rush-desc">
                        Pi Delta is now hosting Spring Rush! We hope to see you on our <a id = "discord-link" href = "http://discord.gg/AGxvc3scp8"> discord server
                        </a> ! If you have any questions, feel free to reach out to our recruitment chairs:

                        <br/>
                    </p>
                    <p className = "rush-desc">
                        Rush Chair: Joshua Liu | IG:@joshualiuser | (510) 386-2818
                        <br/>
                        Rush Chair: Lauren Yoo | IG:@laurenyoohoo | (818) 913-4104
                    </p>


                </div>

                <div id = "events" className="timeline">
                    <h1> Timeline</h1>
                    <EventNode date="Monday 3/29"
                               name="Game Night"
                               description="Spend a night playing some games while getting to know the brothers of Theta Tau!"
                               time_loc="7:00 pm @ Discord Server"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Tuesday 3/30"
                               name="Info Night"
                               description="Learn more about Theta Tau and what we have to offer, have all your questions answered, and get a chance to hear from some of our amazing alumni!"
                               time_loc="7:00 pm @ Discord Server"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Wednesday 3/31"
                               name="Professional Development Night"
                               description="Resume building, Interview Tips, and LinkedIn Help! Get all the professional development help you could want from our very own brothers! "
                               time_loc="7:00 pm @ Discord Server"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Thursday 4/1"
                               name="[Invite Only] Potluck"
                               description="Eat and chat virtually with the brothers of Theta Tau to get to know us better!"
                               time_loc="7:00 pm @ Discord Server"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Friday 4/2"
                               name="[Invite Only] Interviews"
                               description="Show off your best self in a professional interview setting!"
                               time_loc="7:00 pm @ Discord Server"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                </div>

            </div>
        );
    }
}

export default CurrentRush;

class EventNode extends Component<{date: string, name: string, description: string, time_loc: string, attire: string, img1: string, img2: string}, {isHover: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isHover: true
        };
    }

    expandEvent = () => this.setState({isHover: true});
    closeEvent = () => this.setState({isHover: false});

    render() {
        let description, time_loc, attire, img1, img2;
        let expand_div, show_img;
        if (this.state.isHover) {
            description = this.props.description;
            time_loc = this.props.time_loc;
            attire = this.props.attire;
            img1 = this.props.img1;
            img2 = this.props.img2;
            show_img = "show";
            expand_div = "expand";
        } else {
            description = null;
            time_loc = null;
            attire = null;
            img1 = "";
            img2 = "";
            show_img = "noshow";
            expand_div = "noexpand";
        }


        return (
            <div className={expand_div} onMouseEnter={() => this.expandEvent()} onMouseLeave={() => this.expandEvent()}>
                <div className="event">
                    <div className="node">
                        <svg width="1em" height="6em" viewBox="0 0 200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 500L200 600L100 700L0 600L100 500Z" fill="#990000"/>
                            <path d="M100 0L100 1200" stroke="#990000" stroke-width="7"/>
                        </svg>
                    </div>
                    <div className="event-date">
                        <p className="event-date-day"> {this.props.date} </p>
                        <p className="event-date-extra"> {time_loc} </p>
                        <p className="event-date-extra"> {attire} </p>
                    </div>
                    <div className="event-name">
                        <p className="event-name-title"> {this.props.name} </p>
                        <p className="description"> {description} </p>
                    </div>
                </div>
                {/*<div className={show_img}>*/}
                {/*    <img src={img1}/>*/}
                {/*    <img src={img2}/>*/}
                {/*</div>*/}
            </div>
        );
    }
}