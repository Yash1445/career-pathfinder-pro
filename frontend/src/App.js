import React, { useState } from 'react';
import './App.css';

function App() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const analyzeCareer = async () => {
    if (skills.length === 0) {
      alert('Please add at least one skill before analyzing!');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/career/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze career');
      }

      const result = await response.json();
      setAnalysis(result.data);
    } catch (error) {
      console.error('Error analyzing career:', error);
      alert('Failed to analyze career. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewAnalysis = () => {
    setSkills([]);
    setAnalysis(null);
    setNewSkill('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="logo">🎯</div>
          <h1>Career PathFinder Pro</h1>
          <p className="subtitle">Navigate your career path with AI-powered insights</p>
        </header>

        {!analysis ? (
          <div className="skill-input-section">
            <div className="skill-input-container">
              <h2>🧠 Enter Your Skills:</h2>
              <div className="input-group">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a skill (e.g., React, Python, SQL)"
                  className="skill-input"
                />
                <button onClick={addSkill} className="add-button">
                  ➕ Add Skill
                </button>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="skills-list">
                <h3>Your Skills:</h3>
                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="remove-skill"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <button 
                  onClick={analyzeCareer} 
                  className="analyze-button"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Analyzing...' : '🚀 Analyze Career Path'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="analysis-results">
            <div className="analysis-header">
              <h2>🎯 Your Career Analysis</h2>
            </div>

            <div className="career-recommendation">
              <h3>💼 Recommended Career Path:</h3>
              <div className="career-card">
                <h2 className="career-title">{analysis.topMatch.title}</h2>
                <p className="career-description">{analysis.topMatch.description}</p>
                <div className="career-stats">
                  <div className="stat">
                    <span className="stat-label">Match Score:</span>
                    <span className="stat-value match-score">{analysis.topMatch.matchScore}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Average Salary:</span>
                    <span className="stat-value salary">${analysis.topMatch.averageSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="skills-to-learn">
              <h3>📚 Skills to Learn:</h3>
              <div className="skills-grid">
                {analysis.skillGaps.map((skill, index) => (
                  <span key={index} className="skill-gap-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="market-insights">
              <h3>📊 Market Insights:</h3>
              <div className="insights-content">
                {analysis.recommendations.map((recommendation, index) => (
                  <p key={index}>{recommendation}</p>
                ))}
              </div>
            </div>

            <button onClick={startNewAnalysis} className="new-analysis-button">
              🔄 Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;