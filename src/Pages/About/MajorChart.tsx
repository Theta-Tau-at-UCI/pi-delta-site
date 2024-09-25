import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {brotherInfo} from "../Brothers/brother_info.js"

class MajorChart extends React.Component {
    state = {dataDoughnut: {}}

    componentWillMount() {
        // The strings listed in this set are going to be the ones listed on the site.
        const majors_and_count =
            {"Mechanical" : 0, "Chemical" : 0, "Civil": 0, "Data Science": 0,
                "CS/CSE/CpE/SWE": 0, "Biomedical" : 0, "Aerospace" : 0, "Electrical" : 0}
        for (let i = 0; i < brotherInfo.length; i++){
            if (brotherInfo[i].active_status === "Y"){
                const major = brotherInfo[i].major;

                // Count how many of each major are contained by brothers who are listed as active.
                if (major === "Mechanical Engineering"){
                    majors_and_count["Mechanical"]++;
                } else if (major === "Chemical Engineering"){
                    majors_and_count["Chemical"]++;
                } else if (major === "Civil Engineering") {
                    majors_and_count["Civil"]++;
                } else if (major === "Computer Science"){
                    majors_and_count["CS/CSE/CpE/SWE"]++;
                } else if (major === "Computer Science Engineering"){
                    majors_and_count["CS/CSE/CpE/SWE"]++;
                } else if (major === "Computer Engineering"){
                    majors_and_count["CS/CSE/CpE/SWE"]++;
                } else if (major === "Software Engineering"){
                    majors_and_count["CS/CSE/CpE/SWE"]++;
                } else if (major === "Biomedical Engineering"){
                    majors_and_count["Biomedical"]++;
                } else if (major === "Aerospace Engineering"){
                    majors_and_count["Aerospace"]++;
                } else if (major === "Electrical Engineering"){
                    majors_and_count["Electrical"]++;
                } else if (major === "Data Science"){
                    majors_and_count["Data Science"]++;
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
                <h2 className="mt-5">Major Breakdown</h2>
                <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
            </MDBContainer>
        );
    }
}

export default MajorChart;