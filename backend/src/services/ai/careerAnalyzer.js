class CareerAnalyzer {
  constructor() {
    this.careerPaths = [
      {
        id: 1,
        title: 'Frontend Developer',
        skills: ['javascript', 'react', 'html', 'css', 'typescript'],
        averageSalary: 75000,
        demandLevel: 'high',
        description: 'Build user interfaces and user experiences'
      },
      {
        id: 2,
        title: 'Backend Developer', 
        skills: ['javascript', 'nodejs', 'python', 'sql', 'mongodb'],
        averageSalary: 80000,
        demandLevel: 'high',
        description: 'Build server-side logic and databases'
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        skills: ['javascript', 'react', 'nodejs', 'sql', 'python'],
        averageSalary: 85000,
        demandLevel: 'very-high',
        description: 'Work on both frontend and backend'
      },
      {
        id: 4,
        title: 'Data Scientist',
        skills: ['python', 'sql', 'machine-learning', 'statistics', 'pandas'],
        averageSalary: 95000,
        demandLevel: 'very-high',
        description: 'Analyze data to help companies make decisions'
      }
    ];
  }

  analyzeCareer(userSkills) {
    const matches = this.careerPaths.map(path => {
      const skillMatch = this.calculateSkillMatch(userSkills, path.skills);
      return {
        ...path,
        matchScore: skillMatch,
        missingSkills: path.skills.filter(skill => 
          !userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        )
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      topMatches: matches.slice(0, 3),
      recommendations: this.generateRecommendations(matches[0]),
      skillGaps: matches[0].missingSkills
    };
  }

  calculateSkillMatch(userSkills, pathSkills) {
    if (!userSkills || userSkills.length === 0) return 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const matchingSkills = pathSkills.filter(skill => 
      userSkillsLower.includes(skill.toLowerCase())
    );
    
    return Math.round((matchingSkills.length / pathSkills.length) * 100);
  }

  generateRecommendations(topMatch) {
    return [
      'Focus on ' + topMatch.title + ' with ' + topMatch.matchScore + '% match',
      'Average salary: $' + topMatch.averageSalary.toLocaleString(),
      'Market demand: ' + topMatch.demandLevel,
      'Next skills: ' + topMatch.missingSkills.slice(0, 2).join(', ')
    ];
  }
}

module.exports = new CareerAnalyzer();
