import React, { useState, useEffect } from "react";
import Data from "./Role_csv.csv";
import Papa from "papaparse";
import skillsData from "./skillsData";
import Navbar from "./Navbar2";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import LoadingAnimation from "../src/assets/LoadingAnimation.gif";
import "./Form2.css";
import logoImage from "../src/assets/logo.png";
import formImage from "../src/assets/form.png";
import loginImage from "../src/assets/login.png";
const Form2 = ({ userName }) => {
  
  console.log("suvvvvvv=", userName);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, []);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const selectedSkills = selectedDeveloper
    ? skillsData[String(selectedDeveloper).toLowerCase()] || []
    : [];
  // const [skills, setSkills] = useState(
  //   selectedSkills.map((skill) => ({
  //     ...skill,
  //     rating: 0,
  //   }))
  // );
  const [skills, setSkills] = useState([]);

  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    degree: "",
    collegeName: "",
    skills: "",
  });
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState({});

  const handleFileUpload = (data) => {
    setResumeData(data);
    setFormData(
      {
        name: data.name || "",
        email: data.email || "",
        mobileNumber: data.mobile_number || "",
        degree: data.degree || "",
        collegeName: data.college_name || "",
        skills: data.skills ? data.skills.join(", ") : "",
      },
      setIsLoading(false)
    );
  };

  const handleDeveloperChange = (event) => {
    setSelectedDeveloper(event.target.value);
    const updatedSkills =
      skillsData[String(event.target.value).toLowerCase()] || [];
    setSkills(
      updatedSkills.map((skill) => ({
        ...skill,
        rating: 0,
      }))
    );
  };
  // const handleDeveloperChange = (event) => {
  //   setSelectedDeveloper(event.target.value);
  // };
  useEffect(() => {
    if (selectedDeveloper) {
      const selectedSkills =
        data.find((row) => row.Role === selectedDeveloper)?.Skills || "";
      const parsedSkills = selectedSkills.split(",").map((skill) => ({
        name: skill.trim(),
        rating: 0,
      }));
      setSkills(parsedSkills);
    } else {
      setSkills([]);
    }
  }, [selectedDeveloper, data]);

  const handleRatingChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], rating: value };
    setSkills(updatedSkills);
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {;
    console.log("Form submitted successfully!");
     
    const formDataToSend = {
      ...formData,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };
    const skillsArray = formData.skills.split(",").map((skill) => skill.trim());

    const skillsDataObject = skillsArray.reduce((obj, skill) => {
      obj[skill] = { required: true };
      return obj;
    }, {});

    const PredictedJR = resumeData.predicted_job_role;

   /* const JRDataBlob = new Blob([JSON.stringify({ PredictedJR })], {
      type: "application/json",
    });
    saveAs(JRDataBlob, "PredictedJR.json"); */
    //Bhupesh
    const jsonData = JSON.stringify({ PredictedJR });
    const parsedData = JSON.parse(jsonData);
    console.log("Mongo =", parsedData.PredictedJR);
    // Bhupesh end

    const skillsData = resumeData.skills;

   /* const skillsDataBlob = new Blob([JSON.stringify({ skillsData })], {
      type: "application/json",
    });
    saveAs(skillsDataBlob, "skillsDataResume.json"); */

    //Bhupesh
    const values = skillsData.map((skill) => JSON.stringify(skill));
    console.log("Mongo =", values.join(", "));
    // Bhupesh end
   /* const selectedSkillsBlob = new Blob([JSON.stringify({ skills })], {
      type: "application/json",
    });

    saveAs(selectedSkillsBlob, "selectedSkills.json"); */
    // Bhupesh
    console.log("selectedSkills:", skills);
    const skillsObjects = skills.map((skill, index) => ({
      id: index + 1,
      ...skill,
    }));
    console.log("mongo0000=", skillsObjects);
    console.log("mongo=", formData.name);
    console.log("mongo=", formData.mobileNumber);
    console.log("mongo=", formData.email);
    console.log("mongo=", formData.degree);
    console.log("mongoskill=", formData.skills);
    const skillsString = skillsObjects.map(skill => `${skill.name}: ${skill.rating}`).join(', ');
    console.log("mongoskilbbbbbbbbbbl=", skillsString);
    const degreeString = formData.degree.join(', ');
    // Bhupesh end
    console.log("skillsData:", resumeData.skills);
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/register", {
        usernameExsist : userName,
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        skills: formData.skills,
        degree:degreeString,
        rating:skillsString,
        predict: parsedData.PredictedJR
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors here
      });
    navigate("/dashboard", {
      state: {
        userDetail: formDataToSend,
        userName: userName,
        chartsData: {
          skillsData,
          selectedSkills,
          predictedJobRole: resumeData.predicted_job_role,
        },
      },
      location,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    axios
      .post("http://localhost:8000/process/", formData)
      .then((response) => {
        const data = response.data;
        console.log(data);
        handleFileUpload(data);
      })
      .catch((error) => {
        console.error("Error parsing resume:", error);
      });
  };
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    if (formData.name === "") {
      setIsLoading(true);
    }
  };
  return (
    <div className="form-body ">
      <Navbar handleFileUpload={handleFileUpload} setIsLoading={setIsLoading} />
      <div
        className="LoadingAnimation"
        style={{ marginLeft: "40%", position: "absolute" }}
      >
        {isLoading && (
          <img className="animation" src={LoadingAnimation} alt="Loading..." />
        )}
      </div>

      <div className="heading-container">
        <h1 className="textDetails">Or Enter Your Details Manually</h1>
      </div>
      <hr></hr>
      <div className="flex-container">
        <div className="first">
          <div className="container">
            <div className="slect-Role">
              <label htmlFor="developer-select">
                <b>
                  <h2>Select a Job Role:</h2>
                </b>
              </label>

              <select
                id="developer-select-drop"
                value={selectedDeveloper}
                onChange={handleDeveloperChange}
              >
                <option value="">Select</option>
                {data.map((row, index) => (
                  <option key={index} value={row.Role}>
                    {row.Role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div id="skills" className="skills-container">
            {skills.length > 0 && (
              <div className="two-column-container">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="skill-item">
                    <hr></hr>
                    <div className="skill_box">
                      <h6>
                        {" "}
                        <span className="skillName">{skill.name}: </span>
                      </h6>

                      <input
                        className="scaling"
                        type="range"
                        min="1"
                        max="5"
                        value={skill.rating}
                        onChange={(event) =>
                          handleRatingChange(index, event.target.value)
                        }
                      />

                      <span>{skill.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div id="second">
          <label htmlFor="name">Full Name*:</label>
          <br></br>
          <input
            required
            type="text"
            name="name"
            id="name"
            placeholder="Enter Your Full Name"
            className="my-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <br></br>
          <label htmlFor="email">Email*:</label>
          <br></br>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Valid Email"
            className="my-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <br></br>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <br></br>
          <input
            type="tel"
            name="mobileNumber"
            id="mobileNumber"
            placeholder="Enter Your Mobile Number"
            className="my-2"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
          />
          <br></br>
          <label htmlFor="degree">Degree:</label>
          <br></br>
          <input
            type="text"
            name="degree"
            id="degree"
            placeholder="Enter your Highest Degree"
            className="my-2"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
          />
          <br></br>

          <label htmlFor="skills">Skills*:</label>
          <br></br>
          <input
            required
            type="text"
            name="skills"
            id="skills"
            placeholder="Enter your skills separated with a comma"
            className="my-2"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
        </div>
      </div>

      <div className="SubmitButton">
        <button
          type="submit"
          className="d-block my-4 btn btn-outline-success"
          onClick={handleSubmit}
        >
          <b>Next</b>
        </button>
      </div>
    </div>
  );
};

export default Form2;