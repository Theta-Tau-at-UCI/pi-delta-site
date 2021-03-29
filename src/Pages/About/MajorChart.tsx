import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"

class MajorChart extends React.Component {

    state = {
        dataDoughnut: {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }
            ]
        }
    }

    componentWillMount() {
        const majors_and_count = Object();
        const brother_count = brotherInfo.length;
        for (let i = brother_count-1; i >= 0; i--){
            if (brotherInfo[i].active_status == "Y"){
                const major = brotherInfo[i].major;
                if (majors_and_count[major]){
                    majors_and_count[major] = majors_and_count[major] + 1;
                } else {
                    majors_and_count[major] = 1;
                }
            }
        }

        const majors = Object.keys(majors_and_count);
        const counts = Object.values(majors_and_count);
        this.setState({
            dataDoughnut: {
                labels: majors,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#5AD3D1",
                            "#FFC870",
                            "#A8B3C5",
                            "#616774",
                            "#FF5A5E",
                            "#5AD3D1",
                            "#FFC870",
                            "#A8B3C5",
                            "#616774"
                        ]
                    }
                ]
            }
    })
    }

    render() {
        return (
            <MDBContainer>
                <h3 className="mt-5">Major Breakdown</h3>
                <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
            </MDBContainer>
        );
    }
}

export default MajorChart;