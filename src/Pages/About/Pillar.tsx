import React from "react";
import './Pillar.css'

export default function Pillar(props:any) {
  return (
    <div className="row">
        <img src={props.img} alt="Picture of Pillar"></img>
        <div className="col">
            <h2>{props.value}</h2>
            <div className="description">{props.description}</div>
        </div>
    </div>
  );
}
