// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import { brotherInfo } from "../Brothers/brother_info";
//
// const sharedOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   legend: {
//     display: true,
//     position: "bottom" as const,
//     align: "center" as const,
//     labels: {
//       boxWidth: 14,
//       padding: 15,
//     },
//   },
// };
//
// type Gender = "M" | "F";
//
// interface GenderChartState {
//   dataDoughnut: {
//     labels: Gender[];
//     datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[] }[];
//   };
// }
//
// class GenderChart extends React.Component<{}, GenderChartState> {
//   state: GenderChartState = {
//     dataDoughnut: {
//       labels: ["M", "F"],
//       datasets: [{ data: [0, 0], backgroundColor: [], hoverBackgroundColor: [] }],
//     },
//   };
//
//   componentDidMount() {
//     const genders: Record<Gender, number> = { M: 0, F: 0 };
//
//     for (let i = 0; i < brotherInfo.length; i++) {
//       if (brotherInfo[i].active_status === "Y") {
//         const g = brotherInfo[i].gender as Gender;
//         if (g === "M" || g === "F") {
//           genders[g]++;
//         }
//       }
//     }
//
//     this.setState({
//       dataDoughnut: {
//         labels: Object.keys(genders) as Gender[],
//         datasets: [
//           {
//             data: Object.values(genders),
//             backgroundColor: ["#4d92e0", "#FF66FF"],
//             hoverBackgroundColor: ["#379fbe", "#FFCCFF"],
//           },
//         ],
//       },
//     });
//   }
//
//   render() {
//     return (
//         <div className="chart-wrapper">
//           <h3 className="chart-title">Gender Breakdown</h3>
//           <Doughnut data={this.state.dataDoughnut} options={sharedOptions} />
//         </div>
//     );
//   }
// }
//
// export default GenderChart;

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { brotherInfo } from "../Brothers/brother_info";

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      align: "center" as const,
      labels: {
        boxWidth: 14,
        padding: 15,
      },
    },
  },
};

type Gender = "M" | "F";

interface GenderChartState {
  dataDoughnut: {
    labels: Gender[];
    datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[] }[];
  };
}

class GenderChart extends React.Component<{}, GenderChartState> {
  state: GenderChartState = {
    dataDoughnut: {
      labels: ["M", "F"],
      datasets: [{ data: [0, 0], backgroundColor: [], hoverBackgroundColor: [] }],
    },
  };

  componentDidMount() {
    const genders: Record<Gender, number> = { M: 0, F: 0 };

    for (let i = 0; i < brotherInfo.length; i++) {
      if (brotherInfo[i].active_status === "Y") {
        const g = brotherInfo[i].gender as Gender;
        if (g === "M" || g === "F") {
          genders[g]++;
        }
      }
    }

    this.setState({
      dataDoughnut: {
        labels: Object.keys(genders) as Gender[],
        datasets: [
          {
            data: Object.values(genders),
            backgroundColor: ["#66a4ea", "#fa98d2"],
            hoverBackgroundColor: ["#379fbe", "#FFCCFF"],
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
            Gender Breakdown
          </h3>
          <Doughnut
              data={this.state.dataDoughnut}
              options={sharedOptions}
              height={400}
              width={400}
          />
        </div>
    );
  }
}

export default GenderChart;
