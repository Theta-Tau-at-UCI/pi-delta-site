import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"

class MajorChart extends React.Component {
    state = {dataDoughnut: {}}

    componentWillMount() {
        const majors_and_count = {"MechE" : 0, "ChemE" : 0, "Civil": 0, "CS/CSE/CpE/SWE" : 0, "BmE" : 0, "Aero" : 0, "EE" : 0}
        for (let i = 0; i < brotherInfo.length; i++){
            if (brotherInfo[i].active_status == "Y"){
                const major = brotherInfo[i].major;

                if (major == "Mechanical Engineering"){
                    majors_and_count["MechE"] =  majors_and_count["MechE"]+1;
                } else if (major == "Chemical Engineering"){
                    majors_and_count["ChemE"] =  majors_and_count["ChemE"]+1;
                } else if (major == "Civil Engineering") {
                    majors_and_count["Civil"] = majors_and_count["Civil"] + 1;
                } else if (new Set(["Computer Science", "Computer Science and Engineering", "Computer Engineering", "Software Engineering"]).has(major)) {
                    majors_and_count["CS/CSE/CpE/SWE"] = majors_and_count["CS/CSE/CpE/SWE"] + 1;
                } else if (major == "Biomedical Engineering"){
                    majors_and_count["BmE"] =  majors_and_count["BmE"] +1;
                } else if (major == "Aerospace Engineering"){
                majors_and_count["Aero"] =  majors_and_count["Aero"] +1;
                } else if (major == "Electrical Engineering"){
                    majors_and_count["EE"] =  majors_and_count["EE"] +1;
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
                        backgroundColor: ["#f7464a", "#46BFBD", "#6cfd5c", "#AC1CFF", "#4D5360", "#4DA6FF", "#D5FF03"],
                        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#44f187", "#D387FF", "#616774", "#B0D7FF", "#E5FF66"]
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