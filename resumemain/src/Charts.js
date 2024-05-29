import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import skillsData from "./skillsDataResume.json";
import selectedSkillsData from "./selectedSkills.json";
import predictedJobRoleData from "./PredictedJR.json";
import PieChart2 from "./PieChart2";
import axios from "axios";
const predictedJobRole = predictedJobRoleData.PredictedJR || "";
//import predictedJobRoleData from './PredictedJR.json'; // Import the predicted job role data

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
//const predictedJobRole = predictedJobRoleData.PredictedJR || ""; // Get the predicted job role

function Charts({userNameExist}) {
  console.log("charrrt",userNameExist)
  const [chartDataAllSkills, setChartDataAllSkills] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [predictjob, setpredictjob] = useState("");
  useEffect(() => {
    axios
      .post("http://127.0.0.1:5000/dashboard")
      .then((result) => {
        const userName = userNameExist;
        let skillmatter = "";
        let rating = "";
        let aipredict = "";
        for (const item of result.data) {
          if (item.usernameExsist === userName) {
            skillmatter = item.skills[0]// Assuming skills is an array
            console.log("skillmatter",skillmatter)
            aipredict = item.predict
            setpredictjob(aipredict);
            console.log("predict",aipredict)
            rating = item.rating;
            console.log("rating",rating);
            const skills = item.rating.split(", "); // Split the string into skill-rating pairs
            const skillData = skills.map((skill) => {
              const [name, rating] = skill.split(": "); // Split the skill and rating
              return { name: name.trim(), rating: parseInt(rating, 10) };
            });
            console.log("skillData",skillData);
            setSelectedSkills(skillData);
            break;
          }
        }

        if (skillmatter) {
          Skillmatter(skillmatter);
          console.log("Skillmatter data:", skillmatter);
        } else {
          console.error("Skillmatter data is undefined or empty.");
        }
      })
      .catch((error) => {
        console.error("Axios error:", error);
        // Handle any errors here
      });
  }, []);

  function Skillmatter(skillmatter) {
    const skillmatterArray = skillmatter.split(", ");
    console.log("inside", skillmatter);

    const data = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "All Skills Scrapped from Resume",
      },
      data: [
        {
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: false,
          dataPoints: skillmatterArray.map((skill) => ({
            y: 100 / skillmatterArray.length,
            label: skill.trim(),
          })),
        },
      ],
    };

    setChartDataAllSkills(data); // Set the chart data
  }

  useEffect(() => {
    // Convert all skills to lowercase for case-insensitive comparison
    const lowercasedSkillsData = skillsData.skillsData.map((skill) =>
      skill.toLowerCase()
    );
    setSkills(lowercasedSkillsData);
  }, []);

  // // Helper function for case-insensitive skill matching
  // const isSkillMatched = (skill) => {
  //   const lowercasedSkill = skill.toLowerCase();
  //   return selectedSkills.some(
  //     (selectedSkill) => selectedSkill.name === lowercasedSkill
  //   );
  // };

  // console.log("isSkillMatched",isSkillMatched)

  // const matchedSkillsCount = skills.filter(isSkillMatched).length;
  // console.log("matchedSkillsCount",matchedSkillsCount)
  // const totalSkillsCount = selectedSkills.length;
  // console.log("totalSkillsCount",totalSkillsCount)

  // const percentageMatched = (
  //   (matchedSkillsCount / totalSkillsCount) *
  //   100
  // ).toFixed(2);
  // const percentageUnmatched = (100 - percentageMatched).toFixed(2);

  // const chartDataMatchedSkills = {
  //   exportEnabled: true,
  //   animationEnabled: true,
  //   title: {
  //     text: `Matched Skillssss: ${percentageMatched}%`,
  //   },
  //   data: [
  //     {
  //       type: "pie",
  //       startAngle: 75,
  //       toolTipContent: "<b>{label}</b>: {y}%",
  //       showInLegend: false,
  //       legendText: "{label}",
  //       indexLabelFontSize: 16,
  //       indexLabel: "{label} - {y}%",
  //       dataPoints: [
  //         { y: parseFloat(percentageMatched), label: "Matched Skiiiiills" },
  //         { y: parseFloat(percentageUnmatched), label: "Unmatched Skills" },
  //       ],
  //     },
  //   ],
  // };

  // Line Chart Data and Options
  const ratingsDataPoints = selectedSkills.map((skill) => ({
    y: parseInt(skill.rating),
    label: skill.name,
  }));

  const lineChartData = {
    animationEnabled: true,
    title: {
      text: "Ratings for Selected Skills",
    },
    axisX: {
      title: "Skills",
      interval: 1,
    },
    axisY: {
      title: "Ratings",
      interval: 1,
      minimum: 0,
      maximum: 5,
    },
    data: [
      {
        type: "line",
        dataPoints: ratingsDataPoints,
      },
    ],
  };

  return (
    <div className="body-charts">
      <div
        className="pie-Line"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "10px",
          backgroundColor: "#fff",
          borderRadius: "75px 0px 75px 0px ",
        }}
      >
        <div className="centered-text">
          <h1 className="mt-10" style={{ color: "#43B5F4" }}>
            AI Recommendation:-
          </h1>
        </div>

        <div style={{}}>{predictjob && <h1>{predictjob}</h1>}</div>
      </div>

      <div
        className="pie-Line"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "10px",
          backgroundColor: "#fff",
          borderRadius: "30px 30px ",
        }}
      >
        <div className="centered-text">
          <h6>SkillGraph / LineGraph</h6>
          <h7>Matched & UnMatched</h7>
          <PieChart2 userNameExist={userNameExist} />
        </div>

        <div
          style={{
            width: "60%",
            maxWidth: "700px",
            height: "400px",
            margin: "0",
          }}
        >
          <br></br>
          <br />
          <br />
          <CanvasJSChart options={lineChartData} />
        </div>
      </div>

      <div
        className=""
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "30px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        {chartDataAllSkills && (
          <div style={{ width: "100%", height: "400px" }}>
            <CanvasJSChart options={chartDataAllSkills} />
          </div>
        )}
      </div>

      <hr style={{ margin: "30px 0" }} />
      <div style={{ textAlign: "center" }}>
        <h3 style={{ display: "inline-block", fontWeight: "bold" }}>
          Enhance Your Skill
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          bottom: "20px",
          flexWrap: "wrap",
          justifyContent: "space-between",
          borderRadius: "20px",
          height: "100px",
        }}
      >
        {selectedSkills.map((skill) => (
          <React.Fragment key={skill.name}>
            <div
              className="card"
              style={{
                width: "18rem",
                margin: "10px",
                flex: "1 0 21%",
                position: "relative",
                borderRadius: "20px",
              }}
            >
              <div className="card-body">
                <center>
                  <h5 className="card-title">{skill.name}</h5>
                  <p className="card-text">
                    This Course is for enhance You Skill Check It Out And Grab
                    Great Discounts Click On Take Test
                  </p>
                </center>
              </div>
              <a
                href="#"
                className="btn btn-primary"
                style={{
                  width: "50%",
                  marginBottom: "10px",
                  right: "50%",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  transform: "translateX(50%)",
                }}
              >
                Take Test
              </a>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Charts;
