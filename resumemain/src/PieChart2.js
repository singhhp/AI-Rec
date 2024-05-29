import { React, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import skillsData from "./skillsDataResume.json";
import selectedSkillsData from "./selectedSkills.json";
import predictedJobRoleData from "./PredictedJR.json";
import axios from "axios";
const predictedJobRole = predictedJobRoleData.PredictedJR || "";

const PieChart2 = ({userNameExist}) => {
  console.log("piechart",userNameExist)
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    // Convert all skills to lowercase for case-insensitive comparison
    let lowercasedSkillsData = [];
    let lowercasedSelectedSkillsData = [];
    axios
      .post("http://127.0.0.1:5000/dashboard")
      .then((result) => {
        const userName = userNameExist;
        let skillmatter = "";
        for (const item of result.data) {
          if (item.usernameExsist === userName) {
             skillmatter = item.skills[0].split(", ");
            lowercasedSkillsData = skillmatter.map((skill) =>
              skill.toLowerCase()
            );
            const skills = item.rating.split(", "); // Split   the string into skill-rating pairs
            const skillData = skills.map((skill) => {
              const [name, rating] = skill.split(": "); // Split the skill and rating
              return { name: name.trim(), rating: parseInt(rating, 10) };
            });
            lowercasedSelectedSkillsData = skillData.map((skill) => ({
              name: skill.name.toLowerCase(),
              rating: skill.rating,
            }));
          }
        }

        setSkills(lowercasedSkillsData);
        setSelectedSkills(lowercasedSelectedSkillsData);
      })

      .catch((error) => {

        console.error("Axios error:", error);
        // Handle any errors here
      });

    setSkills(lowercasedSkillsData);
    setSelectedSkills(lowercasedSelectedSkillsData);
  }, []);

  const isSkillMatched = (skill) => {
    const lowercasedSkill = skill.toLowerCase();
    return selectedSkills.some(
      (selectedSkill) => selectedSkill.name === lowercasedSkill
    );
  };

  const matchedSkillsCount = skills.filter(isSkillMatched).length;
  const totalSkillsCount = selectedSkills.length;
  const percentageMatched = (
    (matchedSkillsCount / totalSkillsCount) *
    100
  ).toFixed(0);
  const percentageUnmatched = (100 - percentageMatched).toFixed(2);

  const chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    title: {
      text: "SkillData", // Displayed in the center of the chart
      verticalAlign: "middle",
      y: 10,
      // Adjust as needed to center vertically
    },
    plotOptions: {
      pie: {
        innerSize: 200,
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
        },
        showInLegend: false,
        colors: [
          "#43B5F4", // Color for matched skills
          "#89CFF5", // Color for unmatched skills
        ],
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name: `Matched Skills ${percentageMatched}`,
            y: parseFloat(percentageMatched),
          },
          {
            name: `Unmatched Skills  ${percentageUnmatched}`,
            y: parseFloat(percentageUnmatched),
          },
        ],
      },
    ],
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ height: "400px", width: "600px" }}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        <div style={{ marginLeft: "0px" }}>
          <h6>
            <div
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: "#43B5F4",
              }}
            ></div>
            Matched Skills {percentageMatched}
          </h6>
          <br></br>
          <h6>
            <div
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: "#89CFF5",
              }}
            ></div>
            Unmatched Skills {percentageUnmatched}
          </h6>
        </div>
      </div>
    </>
  );
};

export default PieChart2;
