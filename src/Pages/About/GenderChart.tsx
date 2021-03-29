import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"
import {Button} from "react-bootstrap";

class MajorChart extends React.Component {


    state = {

        dataDoughnut: {
            labels: ["M", "F"],
            datasets: []
        }
    }

    update_chart = (genders_and_count: Object) => {
        const genders = Object.keys(genders_and_count);
        const counts = Object.values(genders_and_count);
        this.setState({
            dataDoughnut: {
                labels: genders,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: ["#F7464A", "#46BFBD"],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#5AD3D1"
                        ]
                    }
                ]
            }

        });
    }

    render() {
        const genders_and_count = Object();
        const brother_count = brotherInfo.length;
        for (let i = brother_count-1; i >= 0; i--){
            if (brotherInfo[i].active_status == "Y"){
                const gender = brotherInfo[i].gender;
                if (genders_and_count[gender]){
                    genders_and_count[gender] = genders_and_count[gender] + 1;
                } else {
                    genders_and_count[gender] = 1;
                }
            }
        }


        return (
            <MDBContainer>
                <h3 className="mt-5">Gender Breakdown</h3>
                <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
                <button onClick = { this.update_chart.bind(this,genders_and_count)}> Click </button>
            </MDBContainer>
        );
    }
}

export default MajorChart;