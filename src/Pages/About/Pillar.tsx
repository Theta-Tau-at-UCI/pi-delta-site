import React from "react";
import './Pillar.css'

export default function Pillar(props:string) {
  return (
    <div className="pillar-wrapper">
        <img src={props.img} alt="Picture of Pillar"></img>
        <h2>{props.value}</h2>
        <div className="description">{props.description}</div>
    </div>
  );
}
