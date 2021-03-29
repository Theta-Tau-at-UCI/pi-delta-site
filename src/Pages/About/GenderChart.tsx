import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"

class GenderChart extends React.Component {


    state = {

        dataDoughnut: {
            labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
            datasets: [
                {
                    data: [300, 50, 100, 40, 120],
                    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                    hoverBackgroundColor: [
                        "#FF5A5E",
                        "#5AD3D1",
                        "#FFC870",
                        "#A8B3C5",
                        "#616774"
                    ]
                }
            ]
        }
    }

    render() {
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


        // this.setState({
        //         dataDoughnut: {
        //             labels: Object.keys(majors_and_count),
        //             datasets: [
        //                 {
        //                     data: Object.values(majors_and_count),
        //                     backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
        //                         hoverBackgroundColor: [
        //                         "#FF5A5E",
        //                         "#5AD3D1",
        //                         "#FFC870",
        //                         "#A8B3C5",
        //                         "#616774",
        //                         "#FF5A5E",
        //                         "#5AD3D1",
        //                         "#FFC870",
        //                         "#A8B3C5",
        //                         "#616774"
        //                     ]
        //                 }
        //             ]
        //         }

        // })


        return (
            <MDBContainer>
                <h3 className="mt-5">Major Breakdown</h3>
                <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
            </MDBContainer>
        );
    }
}

export default GenderChart;