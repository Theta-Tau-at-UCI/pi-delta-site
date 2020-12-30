import React, {Component} from 'react';
import "./current_rush.css";
import test from '../../Media/winter_photoshoot_2020.jpg';
// import {url} from inspector;

class CurrentRush extends Component {
    render() {
        return (
            <div>
                <div id="title-block">
                    <div id="title">Spring Rush 2021</div>
                </div>
                <div id="rush-blurb">
                    <p id="blurb">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci animi assumenda deserunt eaque, est fugit iure molestias
                    nostrum quae quam quibusdam soluta totam vero. A ab adipisci dolores repellat unde.
                    </p>
                </div>
                <hr className="divider"/>
                <div className="timeline">
                    <div id="timeline-title">Timeline</div>
                    <EventNode date="Monday 3/29"
                               name="Virtual Escape Room"
                               description="Join us for night of puzzles and brain teasers as you try ot escape with the help of your peers!"
                               time_loc="7:00 pm @ Engineering Quad"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Tuesday 3/30"
                               name="Info Night"
                               description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci animi assumenda deserunt eaque, est fugit iure molestias
                    nostrum quae quam quibusdam soluta totam vero. A ab adipisci dolores repellat unde."
                               time_loc="7:00 pm @ Engineering Quad"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Wednesday 3/31"
                               name="Professional Development Night"
                               description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci animi assumenda deserunt eaque, est fugit iure molestias
                    nostrum quae quam quibusdam soluta totam vero. A ab adipisci dolores repellat unde."
                               time_loc="7:00 pm @ Engineering Quad"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Thursday 4/1"
                               name="BBQ"
                               description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci animi assumenda deserunt eaque, est fugit iure molestias
                    nostrum quae quam quibusdam soluta totam vero. A ab adipisci dolores repellat unde."
                               time_loc="7:00 pm @ Engineering Quad"
                               attire="Casual"
                               img1={test}
                               img2={test}/>
                    <EventNode date="Friday 4/2"
                               name="Interviews"
                               description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci animi assumenda deserunt eaque, est fugit iure molestias
                    nostrum quae quam quibusdam soluta totam vero. A ab adipisci dolores repellat unde."
                               time_loc="7:00 pm @ Engineering Quad"
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
            isHover: false
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
            <div className={expand_div} onMouseEnter={() => this.expandEvent()} onMouseLeave={() => this.closeEvent()}>
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
                <div className={show_img}>
                    <img src={img1}/>
                    <img src={img2}/>
                </div>
            </div>
        );
    }
}