import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"

class MajorChart extends React.Component {
    state = {
        dataDoughnut: {
            labels: ["M", "F"],
            datasets: []
        }
    }

    componentWillMount() {
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
        const genders = Object.keys(genders_and_count);
        const counts = Object.values(genders_and_count);
        this.setState({
            dataDoughnut: {
                labels: genders,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: ["#00FFFF", "#FF66FF"],
                        hoverBackgroundColor: [
                            "#99FFFF",
                            "#FFCCFF"
                        ]
                    }
                ]
            }
        });
    }


    render() {
        return (
            <MDBContainer>
                <h3 className="mt-5">Gender Breakdown</h3>
                <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
            </MDBContainer>
        );
    }
}

export default MajorChart;