import React from "react";
import { Doughnut } from "react-chartjs-2";
import { brotherInfo } from "../Brothers/brother_info.js";

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // let chart fill parent
    plugins: {
        legend: {
            display: true,
            position: "bottom",
            labels: {
                boxWidth: 14,
                padding: 14,
            },
        },
    },
};

class MajorChart extends React.Component {
    state = { dataDoughnut: {} };

    componentWillMount() {
        const majors_and_count = {
            Mechanical: 0,
            Chemical: 0,
            Civil: 0,
            "Data Science": 0,
            "CS/CSE/CpE/SWE": 0,
            Biomedical: 0,
            Aerospace: 0,
            Electrical: 0,
        };

        for (let i = 0; i < brotherInfo.length; i++) {
            if (brotherInfo[i].active_status === "Y") {
                const major = brotherInfo[i].major;
                if (major === "Mechanical Engineering") majors_and_count.Mechanical++;
                else if (major === "Chemical Engineering") majors_and_count.Chemical++;
                else if (major === "Civil Engineering") majors_and_count.Civil++;
                else if (
                    ["Computer Science", "Computer Science Engineering", "Computer Engineering", "Software Engineering"]
                        .includes(major)
                ) majors_and_count["CS/CSE/CpE/SWE"]++;
                else if (major === "Biomedical Engineering") majors_and_count.Biomedical++;
                else if (major === "Aerospace Engineering") majors_and_count.Aerospace++;
                else if (major === "Electrical Engineering") majors_and_count.Electrical++;
                else if (major === "Data Science") majors_and_count["Data Science"]++;
            }
        }

        this.setState({
            dataDoughnut: {
                labels: Object.keys(majors_and_count),
                datasets: [
                    {
                        data: Object.values(majors_and_count),
                        backgroundColor: [
                            "#7C0303",
                            "#C1121F",
                            "#780000",
                            "#003049",
                            "#669BBC",
                            "#F77F00",
                            "#FCBF49",
                            "#EAE2B7",
                        ],
                    },
                ],
            },
        });
    }

    render() {
        return (
            <div
                className="chart-wrapper"
                style={{
                    width: 500,
                    height: 500,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h3 className="chart-title" style={{ textAlign: "center" }}>
                    Major Breakdown
                </h3>
                {/* Set height/width directly on Doughnut via props */}
                <Doughnut
                    data={this.state.dataDoughnut}
                    options={chartOptions}
                    height={400}
                    width={400}
                />
            </div>
        );
    }
}

export default MajorChart;
