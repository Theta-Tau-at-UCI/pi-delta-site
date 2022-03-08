import React from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { brotherInfo } from "../Brothers/brother_info.js";

class MajorChart extends React.Component {
  state = {
    dataDoughnut: {
      labels: ["M", "F"],
    },
  };

  componentWillMount() {
    const genders_and_count = { M: 0, F: 0 };
    for (let i = brotherInfo.length - 1; i >= 0; i--) {
      if (brotherInfo[i].active_status === "Y") {
        // @ts-ignore
        genders_and_count[brotherInfo[i].gender] += 1;
      }
    }

    this.setState({
      dataDoughnut: {
        labels: Object.keys(genders_and_count),
        datasets: [
          {
            data: Object.values(genders_and_count),
            backgroundColor: ["#4d92e0", "#FF66FF"],
            hoverBackgroundColor: ["#379fbe", "#FFCCFF"],
          },
        ],
      },
    });
  }

  render() {
    return (
      <MDBContainer>
        <h3 className="mt-5">Gender Breakdown</h3>
        <Doughnut
          data={this.state.dataDoughnut}
          options={{ responsive: true }}
        />
      </MDBContainer>
    );
  }
}

export default MajorChart;
