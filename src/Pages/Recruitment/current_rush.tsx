import React, {Component} from 'react';
import "./current_rush.css";

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
                    <EventNode date="Monday 3/29" name="Virtual Escape Room" />
                    <EventNode date="Tuesday 3/30" name="Info Night" />
                    <EventNode date="Wednesday 3/31" name="Professional Development Night" />
                    <EventNode date="Thursday 4/1" name="BBQ" />
                    <EventNode date="Friday 4/2" name="Interviews" />
                </div>

            </div>
        );
    }
}

export default CurrentRush;

class EventNode extends Component<{date: string, name: string}, {isHover: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isHover: false
        };
    }

    expandEvent = () => this.setState({isHover: true});
    closeEvent = () => this.setState({isHover: false});

    render() {
        return (
            <div>
                <div className="event" onMouseEnter={() => this.expandEvent()} onMouseLeave={() => this.closeEvent()}>
                    <div className="node">
                        <svg width="2em" height="4em" viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 200L200 300L100 400L0 300L100 200Z" fill="#990000"/>
                        <path d="M100 0L100 600" stroke="#990000" stroke-width="7"/>
                    </svg>
                    </div>
                    <div className="event-date">
                        <p> {this.props.date} </p>
                    </div>
                    <div className="event-name">
                        <p> {this.props.name} </p>
                    </div>
                </div>
            </div>
        );
    }
}