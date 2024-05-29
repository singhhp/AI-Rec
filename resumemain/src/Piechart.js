import React, { useState, useEffect } from 'react';
import skillsData from './skillsDataResume.json';
import selectedSkillsData from './selectedSkills.json';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Charts() {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    setSkills(skillsData.skillsData);
    setSelectedSkills(selectedSkillsData.selectedSkills);
  }, []);

  // Get the counts of each skill
  const allSkillCounts = skills.reduce((counts, skill) => {
    counts[skill] = (counts[skill] || 0) + 1;
    return counts;
  }, {});

  const selectedSkillCounts = selectedSkills.reduce((counts, skill) => {
    counts[skill.name] = (counts[skill.name] || 0) + 1;
    return counts;
  }, {});

  // Combine the counts into a single object
  const combinedCounts = Object.keys(allSkillCounts).reduce((counts, skill) => {
    counts[skill] = {
      allSkills: allSkillCounts[skill] || 0,
      selectedSkills: selectedSkillCounts[skill] || 0,
    };
    return counts;
  }, {});

  // Convert the counts into chart data
  const chartData = {
    labels: Object.keys(combinedCounts),
    datasets: [
      {
        label: 'All Skills',
        data: Object.values(combinedCounts).map(counts => counts.allSkills),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Selected Skills',
        data: Object.values(combinedCounts).map(counts => counts.selectedSkills),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Set the chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribution of Skills',
      },
    },
  };

  return (
    <div>
      <h1>Skills Data</h1>
      <h2>All Skills</h2>
      {skills.map((skill, index) => (
        <p key={index}>{skill}</p>
      ))}
      <h2>Selected Skills</h2>
      {selectedSkills.map((skill, index) => (
        <div key={index}>
          <p>Name: {skill.name}</p>
          <p>Rating: {skill.rating}</p>
        </div>
      ))}
      <div style={{ width: '400px', height: '400px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Charts;
