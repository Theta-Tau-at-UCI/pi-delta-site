import React, { Fragment } from "react";
import "./Landing.css"
import tt_logo from "../../Media/tt-logo.png";
import Pillar from "./Pillar";
import {CardDeck} from "react-bootstrap";

export default class Landing extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <header>
                    <div className={"overlay"}/>
                    <video playsInline={true} autoPlay={true} muted={true} loop={true}>
                        <source src={"https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"} type={"video/mp4"}/>
                    </video>
                    <div className={"container h-100"}>
                        <div className={"d-flex h-100 align-items-center"}>
                            <div className={"w-100 text-white"}>
                                <h1 className={"display-3"}>Theta Tau (Placeholder)</h1>
                                <div>Professional Engineering Fraternity</div>
                            </div>
                        </div>
                    </div>
                </header>

                <h1>Our Pillars</h1>
                <CardDeck id={"pillar-cards"}>
                    <Pillar value={"Brotherhood"} img={tt_logo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                    "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                    "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                    "                                consequat."}
                    />
                    <Pillar value={"Professionalism"} img={tt_logo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                    "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                    "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                    "                                consequat."}
                    />
                    <Pillar value={"Service"} img={tt_logo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                    "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                    "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                    "                                consequat."}
                    />
                </CardDeck>

                <h1>Our other stuff</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet at cum dicta dolorum ea eligendi
                    error et eum facilis fuga iure laboriosam magnam, maiores modi quibusdam temporibus vero
                    voluptatibus!</p><p>Quae reiciendis, voluptates! Architecto atque, beatae corporis delectus ea
                expedita explicabo illo minima mollitia neque omnis quibusdam quisquam, ratione recusandae reprehenderit
                tempore ut voluptatem voluptatibus? Illum nihil odio qui sapiente.</p><p>Aperiam, asperiores at commodi
                consectetur dolores eaque expedita illo iusto, laborum laudantium numquam pariatur possimus quod sequi
                ullam ut, veniam. Laborum nisi odit sed ut vel! Assumenda dolor quod repudiandae.</p><p>Consequatur
                culpa delectus, doloribus dolorum labore libero nemo perspiciatis placeat quae sed sunt tempore totam?
                Cumque dignissimos enim eos fugit magni maxime odio quam, tempore vitae. Eligendi ex minima
                voluptas.</p><p>A, atque autem consectetur culpa distinctio dolor enim eos, exercitationem fugiat
                incidunt ipsa maxime natus nihil nulla perspiciatis praesentium quas quo sequi tempore veniam.
                Accusantium amet doloribus explicabo mollitia repudiandae.</p>
            </Fragment>
        );
    }
}