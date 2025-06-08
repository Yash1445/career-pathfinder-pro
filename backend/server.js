const express = require('express');
const cors = require('cors');

const app = express();

console.log('Starting Career PathFinder Pro server...');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// COMPLETE Career Analysis Function - ALL SUBJECTS INCLUDED
function analyzeSkills(skills) {
  try {
    const skillsLower = skills.map(s => s.toLowerCase());
    console.log('Analyzing skills:', skillsLower);
    
    // ================================
    // MEDICAL & HEALTHCARE SUBJECTS
    // ================================
    
    // Medical Foundation (Basic Sciences)
    const medicalFoundation = [
      'anatomy', 'physiology', 'biology', 'chemistry', 'organic chemistry', 'biochemistry', 
      'microbiology', 'pathology', 'pharmacology', 'immunology', 'genetics', 'molecular biology',
      'cell biology', 'histology', 'embryology', 'neuroscience', 'medical ethics',
      'biostatistics', 'epidemiology', 'public health', 'medical terminology', 'pathophysiology',
      'toxicology', 'virology', 'bacteriology', 'parasitology', 'medical physics'
    ];
    const medicalFoundationCount = skillsLower.filter(skill => 
      medicalFoundation.some(med => skill.includes(med))
    ).length;

    // Clinical Medicine
    const clinicalMedicine = [
      'clinical medicine', 'internal medicine', 'family medicine', 'emergency medicine',
      'pediatrics', 'geriatrics', 'cardiology', 'pulmonology', 'gastroenterology',
      'endocrinology', 'rheumatology', 'nephrology', 'hematology', 'oncology',
      'infectious disease', 'dermatology', 'neurology', 'radiology',
      'diagnostic imaging', 'clinical diagnosis', 'differential diagnosis', 'patient assessment',
      'physical examination', 'medical history taking', 'clinical reasoning', 'evidence based medicine',
      'intensive care', 'critical care', 'trauma medicine', 'sports medicine'
    ];
    const clinicalCount = skillsLower.filter(skill => 
      clinicalMedicine.some(clin => skill.includes(clin))
    ).length;

    // Surgery & Surgical Specialties
    const surgery = [
      'surgery', 'surgical', 'general surgery', 'orthopedic surgery', 'neurosurgery',
      'cardiac surgery', 'thoracic surgery', 'vascular surgery', 'plastic surgery',
      'trauma surgery', 'pediatric surgery', 'urological surgery', 'gynecological surgery',
      'ophthalmic surgery', 'ent surgery', 'oral surgery', 'transplant surgery',
      'operating room', 'or', 'perioperative care', 'anesthesia', 'anesthesiology',
      'surgical instruments', 'sterile technique', 'suturing', 'laparoscopy',
      'minimally invasive surgery', 'robotic surgery', 'surgical anatomy', 'surgical pathology'
    ];
    const surgeryCount = skillsLower.filter(skill => 
      surgery.some(surg => skill.includes(surg))
    ).length;

    // Nursing & Patient Care
    const nursing = [
      'nursing', 'registered nurse', 'rn', 'lpn', 'bsn', 'adn', 'msn', 'nurse practitioner',
      'patient care', 'bedside manner', 'vital signs', 'medication administration',
      'wound care', 'infection control', 'patient safety', 'nursing assessment',
      'care planning', 'patient education', 'clinical nursing', 'critical care nursing',
      'icu nursing', 'emergency nursing', 'surgical nursing', 'pediatric nursing',
      'obstetric nursing', 'psychiatric nursing', 'community health nursing',
      'geriatric nursing', 'oncology nursing', 'cardiac nursing', 'neonatal nursing',
      'nurse educator', 'nurse administrator', 'nurse researcher'
    ];
    const nursingCount = skillsLower.filter(skill => 
      nursing.some(nurs => skill.includes(nurs))
    ).length;

    // Pharmacy & Pharmaceutical Sciences
    const pharmacy = [
      'pharmacy', 'pharmacology', 'pharmaceutical sciences', 'clinical pharmacy',
      'pharmacotherapy', 'pharmacokinetics', 'pharmacodynamics', 'toxicology',
      'medicinal chemistry', 'pharmaceutical chemistry', 'drug development',
      'drug interactions', 'medication therapy management', 'pharmaceutical care',
      'compounding', 'dispensing', 'drug safety', 'adverse drug reactions',
      'pharmacy practice', 'hospital pharmacy', 'retail pharmacy', 'pharmd',
      'pharmaceutical law', 'pharmacy administration', 'drug information',
      'pharmacoeconomics', 'pharmaceutical manufacturing', 'regulatory affairs'
    ];
    const pharmacyCount = skillsLower.filter(skill => 
      pharmacy.some(pharm => skill.includes(pharm))
    ).length;

    // Dentistry & Oral Health
    const dentistry = [
      'dentistry', 'dental', 'oral health', 'dental hygiene', 'orthodontics',
      'periodontics', 'endodontics', 'prosthodontics', 'oral surgery',
      'dental assistant', 'dental hygienist', 'teeth cleaning', 'cavity filling',
      'root canal', 'dental implants', 'oral pathology', 'dental radiology',
      'dental materials', 'dental anatomy', 'occlusion', 'dental public health',
      'pediatric dentistry', 'geriatric dentistry', 'cosmetic dentistry',
      'oral and maxillofacial surgery', 'dds', 'dmd', 'dental practice management',
      'dental laboratory technology', 'dental therapeutics'
    ];
    const dentistryCount = skillsLower.filter(skill => 
      dentistry.some(dent => skill.includes(dent))
    ).length;

    // Physical Therapy & Rehabilitation
    const physicalTherapy = [
      'physical therapy', 'physiotherapy', 'pt', 'dpt', 'rehabilitation',
      'exercise therapy', 'manual therapy', 'therapeutic exercise',
      'movement analysis', 'gait training', 'balance training', 'strength training',
      'musculoskeletal', 'orthopedic', 'neurological rehabilitation',
      'sports medicine', 'sports rehabilitation', 'occupational therapy',
      'ot', 'speech therapy', 'speech pathology', 'respiratory therapy',
      'physical rehabilitation', 'injury prevention', 'biomechanics',
      'kinesiology', 'exercise science', 'athletic training', 'massage therapy'
    ];
    const physicalTherapyCount = skillsLower.filter(skill => 
      physicalTherapy.some(pt => skill.includes(pt))
    ).length;

    // Medical Laboratory & Diagnostics
    const laboratory = [
      'medical laboratory', 'clinical laboratory', 'lab technician', 'lab technology',
      'medical laboratory science', 'clinical pathology', 'laboratory medicine',
      'blood work', 'hematology lab', 'chemistry lab', 'microbiology lab',
      'immunology lab', 'molecular diagnostics', 'cytology', 'histopathology',
      'laboratory testing', 'diagnostic testing', 'laboratory analysis',
      'quality control', 'laboratory management', 'laboratory safety',
      'specimen collection', 'laboratory equipment', 'microscopy',
      'laboratory procedures', 'laboratory standards', 'ascp certification',
      'medical technology', 'clinical chemistry', 'blood banking'
    ];
    const laboratoryCount = skillsLower.filter(skill => 
      laboratory.some(lab => skill.includes(lab))
    ).length;

    // Medical Imaging & Radiology
    const medicalImaging = [
      'radiology', 'medical imaging', 'radiologic technology', 'x-ray',
      'ct scan', 'mri', 'ultrasound', 'nuclear medicine', 'pet scan',
      'mammography', 'fluoroscopy', 'interventional radiology',
      'diagnostic imaging', 'radiography', 'sonography', 'echocardiography',
      'radiation therapy', 'radiation oncology', 'medical dosimetry',
      'radiation safety', 'imaging physics', 'contrast media',
      'image interpretation', 'pacs', 'dicom', 'radiologic science',
      'bone densitometry', 'cardiac catheterization', 'angiography'
    ];
    const imagingCount = skillsLower.filter(skill => 
      medicalImaging.some(img => skill.includes(img))
    ).length;

    // Mental Health & Psychology - RESTORED
    const mentalHealth = [
      'psychology', 'psychiatry', 'mental health', 'behavioral health',
      'clinical psychology', 'counseling psychology', 'psychotherapy',
      'cognitive behavioral therapy', 'cbt', 'psychoanalysis', 'psychopharmacology',
      'neuropsychology', 'social work', 'psychiatric nursing', 'addiction counseling',
      'marriage and family therapy', 'child psychology', 'developmental psychology',
      'abnormal psychology', 'psychological assessment', 'psychological testing',
      'mental health counseling', 'substance abuse counseling', 'trauma therapy',
      'group therapy', 'psychiatric rehabilitation', 'behavioral analysis',
      'art therapy', 'music therapy', 'play therapy', 'psychosocial rehabilitation'
    ];
    const mentalHealthCount = skillsLower.filter(skill => 
      mentalHealth.some(mh => skill.includes(mh))
    ).length;

    // Public Health & Epidemiology - RESTORED
    const publicHealth = [
      'public health', 'epidemiology', 'biostatistics', 'environmental health',
      'health policy', 'global health', 'community health', 'health promotion',
      'disease prevention', 'health education', 'health administration',
      'healthcare management', 'health informatics', 'health economics',
      'maternal and child health', 'occupational health', 'nutrition',
      'food safety', 'infection control', 'outbreak investigation',
      'health surveillance', 'health research', 'mph', 'drph',
      'social determinants of health', 'health disparities', 'health communication',
      'program evaluation', 'health planning', 'health services research'
    ];
    const publicHealthCount = skillsLower.filter(skill => 
      publicHealth.some(ph => skill.includes(ph))
    ).length;

    // ================================
    // TECHNOLOGY & ENGINEERING SUBJECTS
    // ================================

    // Data Science & Analytics
    const dataScience = [
      'data science', 'machine learning', 'artificial intelligence', 'ai', 'ml',
      'deep learning', 'neural networks', 'natural language processing', 'nlp',
      'computer vision', 'data analysis', 'data mining', 'big data', 'analytics',
      'statistical analysis', 'predictive modeling', 'data visualization',
      'business intelligence', 'data engineering', 'mlops', 'model deployment',
      'python', 'r', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
      'keras', 'jupyter', 'tableau', 'power bi', 'spark', 'hadoop', 'kafka',
      'data warehousing', 'etl', 'statistics', 'probability', 'linear algebra',
      'reinforcement learning', 'unsupervised learning', 'supervised learning'
    ];
    const dataScienceCount = skillsLower.filter(skill => 
      dataScience.some(ds => skill.includes(ds))
    ).length;

    // Frontend Development
    const frontend = [
      'frontend', 'front-end', 'web development', 'ui development', 'ux development',
      'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular',
      'svelte', 'next.js', 'nuxt.js', 'gatsby', 'webpack', 'vite', 'parcel',
      'sass', 'scss', 'less', 'stylus', 'tailwind css', 'bootstrap', 'material ui',
      'styled components', 'css modules', 'responsive design', 'mobile-first design',
      'web accessibility', 'cross-browser compatibility', 'performance optimization',
      'seo', 'progressive web apps', 'pwa', 'service workers', 'web components',
      'dom manipulation', 'event handling', 'ajax', 'fetch api', 'rest apis',
      'graphql', 'state management', 'redux', 'mobx', 'zustand', 'context api'
    ];
    const frontendCount = skillsLower.filter(skill => 
      frontend.some(fe => skill.includes(fe))
    ).length;

    // Backend Development
    const backend = [
      'backend', 'back-end', 'server-side', 'api development', 'web services',
      'node.js', 'express.js', 'python', 'django', 'flask', 'fastapi',
      'java', 'spring boot', 'spring framework', 'c#', '.net', 'asp.net',
      'php', 'laravel', 'symfony', 'ruby', 'ruby on rails', 'go', 'golang',
      'rust', 'scala', 'kotlin', 'microservices', 'monolithic architecture',
      'rest api', 'graphql', 'grpc', 'soap', 'websockets', 'server architecture',
      'load balancing', 'caching', 'redis', 'memcached', 'message queues',
      'rabbitmq', 'apache kafka', 'authentication', 'authorization', 'jwt',
      'oauth', 'api security', 'rate limiting', 'logging', 'monitoring'
    ];
    const backendCount = skillsLower.filter(skill => 
      backend.some(be => skill.includes(be))
    ).length;

    // Database Technologies
    const database = [
      'database', 'sql', 'nosql', 'mysql', 'postgresql', 'sqlite', 'oracle',
      'sql server', 'mongodb', 'cassandra', 'redis', 'elasticsearch',
      'neo4j', 'graph database', 'time series database', 'influxdb',
      'database design', 'database administration', 'dba', 'data modeling',
      'normalization', 'indexing', 'query optimization', 'stored procedures',
      'triggers', 'database security', 'backup and recovery', 'replication',
      'sharding', 'acid properties', 'transactions', 'concurrency control',
      'database migration', 'orm', 'sequelize', 'hibernate', 'prisma'
    ];
    const databaseCount = skillsLower.filter(skill => 
      database.some(db => skill.includes(db))
    ).length;

    // DevOps & Cloud Engineering
    const devops = [
      'devops', 'cloud computing', 'aws', 'azure', 'google cloud', 'gcp',
      'docker', 'kubernetes', 'containerization', 'orchestration',
      'ci/cd', 'continuous integration', 'continuous deployment', 'jenkins',
      'gitlab ci', 'github actions', 'travis ci', 'infrastructure as code',
      'terraform', 'ansible', 'puppet', 'chef', 'cloudformation',
      'monitoring', 'logging', 'observability', 'prometheus', 'grafana',
      'elk stack', 'splunk', 'new relic', 'datadog', 'linux', 'unix',
      'bash scripting', 'powershell', 'networking', 'security', 'ssl/tls',
      'load balancers', 'cdn', 'microservices deployment', 'serverless'
    ];
    const devopsCount = skillsLower.filter(skill => 
      devops.some(dv => skill.includes(dv))
    ).length;

    // Mobile Development
    const mobile = [
      'mobile development', 'ios development', 'android development',
      'react native', 'flutter', 'xamarin', 'ionic', 'cordova', 'phonegap',
      'swift', 'objective-c', 'kotlin', 'java android', 'dart',
      'mobile ui/ux', 'mobile design', 'responsive design', 'app store optimization',
      'mobile testing', 'mobile security', 'push notifications', 'in-app purchases',
      'mobile analytics', 'mobile performance', 'offline functionality',
      'mobile databases', 'mobile apis', 'cross-platform development',
      'native development', 'hybrid apps', 'progressive web apps',
      'mobile deployment', 'app store', 'google play', 'mobile frameworks'
    ];
    const mobileCount = skillsLower.filter(skill => 
      mobile.some(mb => skill.includes(mb))
    ).length;

    // Cybersecurity
    const cybersecurity = [
      'cybersecurity', 'information security', 'network security', 'application security',
      'ethical hacking', 'penetration testing', 'vulnerability assessment',
      'security auditing', 'incident response', 'malware analysis', 'forensics',
      'cryptography', 'encryption', 'ssl/tls', 'pki', 'identity management',
      'access control', 'authentication', 'authorization', 'security frameworks',
      'iso 27001', 'nist', 'owasp', 'security compliance', 'risk assessment',
      'security monitoring', 'siem', 'ids/ips', 'firewall', 'antivirus',
      'security awareness', 'social engineering', 'phishing', 'ransomware',
      'cloud security', 'mobile security', 'iot security', 'blockchain security'
    ];
    const cybersecurityCount = skillsLower.filter(skill => 
      cybersecurity.some(cs => skill.includes(cs))
    ).length;

    // Game Development - RESTORED
    const gameDevelopment = [
      'game development', 'game design', 'unity', 'unreal engine', 'godot',
      'c#', 'c++', 'javascript', 'python', 'lua', 'game programming',
      'game physics', 'game graphics', '3d modeling', '2d graphics',
      'animation', 'game ai', 'gameplay programming', 'game testing',
      'level design', 'game mechanics', 'user interface design', 'game audio',
      'sound design', 'music composition', 'game monetization', 'game publishing',
      'mobile games', 'pc games', 'console games', 'vr games', 'ar games',
      'multiplayer games', 'networking', 'game optimization', 'performance tuning',
      'indie game development', 'aaa game development', 'game engines'
    ];
    const gameDevCount = skillsLower.filter(skill => 
      gameDevelopment.some(gd => skill.includes(gd))
    ).length;

    // Software Engineering - RESTORED
    const softwareEngineering = [
      'software engineering', 'software development', 'programming', 'coding',
      'algorithms', 'data structures', 'object-oriented programming', 'oop',
      'functional programming', 'design patterns', 'software architecture',
      'system design', 'scalability', 'performance optimization', 'code review',
      'version control', 'git', 'github', 'gitlab', 'bitbucket', 'svn',
      'agile methodology', 'scrum', 'kanban', 'test-driven development', 'tdd',
      'behavior-driven development', 'bdd', 'unit testing', 'integration testing',
      'end-to-end testing', 'automated testing', 'manual testing', 'debugging',
      'refactoring', 'documentation', 'technical writing', 'code quality',
      'software lifecycle', 'software requirements', 'software maintenance'
    ];
    const softwareEngineeringCount = skillsLower.filter(skill => 
      softwareEngineering.some(se => skill.includes(se))
    ).length;

    // UI/UX Design - RESTORED
    const uiuxDesign = [
      'ui design', 'ux design', 'user interface', 'user experience', 'design',
      'graphic design', 'visual design', 'interaction design', 'product design',
      'web design', 'mobile design', 'responsive design', 'accessibility design',
      'design thinking', 'user research', 'usability testing', 'prototyping',
      'wireframing', 'mockups', 'design systems', 'style guides', 'branding',
      'typography', 'color theory', 'layout design', 'information architecture',
      'sketch', 'figma', 'adobe xd', 'photoshop', 'illustrator', 'indesign',
      'after effects', 'principle', 'framer', 'invision', 'zeplin', 'marvel',
      'user personas', 'user journey', 'user flow', 'a/b testing'
    ];
    const uiuxCount = skillsLower.filter(skill => 
      uiuxDesign.some(ux => skill.includes(ux))
    ).length;

    console.log('COMPLETE Skill Counts:', {
      medicalFoundation: medicalFoundationCount,
      clinical: clinicalCount,
      surgery: surgeryCount,
      nursing: nursingCount,
      pharmacy: pharmacyCount,
      dentistry: dentistryCount,
      physicalTherapy: physicalTherapyCount,
      laboratory: laboratoryCount,
      imaging: imagingCount,
      mentalHealth: mentalHealthCount,      // RESTORED
      publicHealth: publicHealthCount,      // RESTORED
      dataScience: dataScienceCount,
      frontend: frontendCount,
      backend: backendCount,
      database: databaseCount,
      devops: devopsCount,
      mobile: mobileCount,
      cybersecurity: cybersecurityCount,
      gameDev: gameDevCount,               // RESTORED
      softwareEng: softwareEngineeringCount, // RESTORED
      uiux: uiuxCount                      // RESTORED
    });

    let careerAnalysis;

    // ================================
    // MEDICAL CAREER PATHS (11 paths)
    // ================================

    // Surgeon / Surgical Specialist
    if (surgeryCount >= 3 || (surgeryCount >= 2 && medicalFoundationCount >= 2)) {
      careerAnalysis = {
        title: 'Surgeon / Surgical Specialist',
        matchScore: Math.min(98, 85 + (surgeryCount * 4) + (medicalFoundationCount * 2)),
        averageSalary: 400000,
        description: 'Exceptional fit for surgical specialties and operating room leadership!',
        skillGaps: ['Advanced Surgical Techniques', 'Minimally Invasive Surgery', 'Surgical Research', 'Teaching & Mentoring'],
        recommendations: [
          'Outstanding surgical knowledge and medical foundation',
          'Consider subspecialty training in cardiac, neuro, or orthopedic surgery',
          '4 years medical school + 5-7 years surgical residency required',
          'Average salary: $400,000 - $700,000+ depending on specialty'
        ]
      };
    }
    // Physician / Medical Doctor
    else if (clinicalCount >= 3 || medicalFoundationCount >= 5 || 
             (medicalFoundationCount >= 3 && clinicalCount >= 1) ||
             (medicalFoundationCount >= 4)) {
      careerAnalysis = {
        title: 'Physician / Medical Doctor',
        matchScore: Math.min(95, 80 + (clinicalCount * 3) + (medicalFoundationCount * 2)),
        averageSalary: 250000,
        description: 'Excellent foundation for medical practice and patient care!',
        skillGaps: ['Clinical Diagnosis', 'Medical Research', 'Patient Communication', 'Evidence-Based Medicine'],
        recommendations: [
          'Strong medical knowledge foundation with clinical focus',
          'Choose specialty: Internal Medicine, Family Medicine, Pediatrics, etc.',
          '4 years medical school + 3-7 years residency required',
          'Average salary: $250,000 - $450,000 depending on specialty'
        ]
      };
    }
    // Psychiatrist / Mental Health Professional - RESTORED
    else if (mentalHealthCount >= 4 || (mentalHealthCount >= 3 && medicalFoundationCount >= 2)) {
      careerAnalysis = {
        title: 'Psychiatrist / Mental Health Professional',
        matchScore: Math.min(95, 80 + (mentalHealthCount * 4) + (medicalFoundationCount * 2)),
        averageSalary: 220000,
        description: 'Excellent fit for mental health and behavioral healthcare!',
        skillGaps: ['Psychopharmacology', 'Therapeutic Techniques', 'Crisis Intervention', 'Cultural Competency'],
        recommendations: [
          'Strong foundation in psychology and mental health',
          'MD in Psychiatry: $220k+, PhD in Psychology: $90k+, LCSW: $65k+',
          'Specialization options: Child Psychiatry, Addiction Medicine, Forensic Psychology',
          'Average salary: $90,000 - $250,000 depending on credential'
        ]
      };
    }
    // Registered Nurse
    else if (nursingCount >= 3 || (nursingCount >= 2 && medicalFoundationCount >= 2)) {
      careerAnalysis = {
        title: 'Registered Nurse (RN)',
        matchScore: Math.min(95, 85 + (nursingCount * 4) + (medicalFoundationCount * 2)),
        averageSalary: 85000,
        description: 'Perfect match for nursing and comprehensive patient care!',
        skillGaps: ['Advanced Practice Nursing', 'Critical Care', 'Evidence-Based Practice', 'Leadership'],
        recommendations: [
          'Excellent nursing foundation and patient care skills',
          'BSN degree strongly recommended for career advancement',
          'Consider specialization: ICU, ER, OR, Pediatrics, or Nurse Practitioner',
          'Average salary: $85,000 - $120,000 (RN), $120,000+ (NP)'
        ]
      };
    }
    // Pharmacist
    else if (pharmacyCount >= 3 || (pharmacyCount >= 2 && medicalFoundationCount >= 1)) {
      careerAnalysis = {
        title: 'Pharmacist',
        matchScore: Math.min(95, 80 + (pharmacyCount * 5) + (medicalFoundationCount * 2)),
        averageSalary: 140000,
        description: 'Outstanding fit for pharmaceutical care and medication expertise!',
        skillGaps: ['Clinical Pharmacology', 'Pharmaceutical Care', 'Drug Information', 'Patient Counseling'],
        recommendations: [
          'Strong pharmaceutical science and chemistry foundation',
          'PharmD (Doctor of Pharmacy) degree required',
          'Specialization options: Clinical, Hospital, Retail, or Industrial Pharmacy',
          'Average salary: $140,000 - $170,000'
        ]
      };
    }
    // Dentist
    else if (dentistryCount >= 3 || (dentistryCount >= 2 && medicalFoundationCount >= 1)) {
      careerAnalysis = {
        title: 'Dentist / Dental Specialist',
        matchScore: Math.min(95, 85 + (dentistryCount * 5) + (medicalFoundationCount * 2)),
        averageSalary: 200000,
        description: 'Excellent match for dental practice and oral healthcare!',
        skillGaps: ['Advanced Restorative Procedures', 'Oral Surgery', 'Practice Management', 'Digital Dentistry'],
        recommendations: [
          'Strong foundation in dental science and oral health',
          'DDS or DMD degree required (4 years dental school)',
          'Specialization options: Orthodontics, Oral Surgery, Periodontics',
          'Average salary: $200,000 - $300,000+ (specialists earn more)'
        ]
      };
    }
    // Physical Therapist
    else if (physicalTherapyCount >= 3 || (physicalTherapyCount >= 2 && medicalFoundationCount >= 1)) {
      careerAnalysis = {
        title: 'Physical Therapist',
        matchScore: Math.min(95, 85 + (physicalTherapyCount * 5) + (medicalFoundationCount * 2)),
        averageSalary: 95000,
        description: 'Perfect fit for rehabilitation and movement therapy!',
        skillGaps: ['Advanced Manual Therapy', 'Research Methods', 'Specialty Certification', 'Technology Integration'],
        recommendations: [
          'Excellent foundation in movement science and rehabilitation',
          'DPT (Doctor of Physical Therapy) degree required',
          'Specialization options: Sports, Orthopedic, Neurological, Pediatric PT',
          'Average salary: $95,000 - $115,000'
        ]
      };
    }
    // Medical Laboratory Scientist
    else if (laboratoryCount >= 3 || (laboratoryCount >= 2 && medicalFoundationCount >= 2)) {
      careerAnalysis = {
        title: 'Medical Laboratory Scientist',
        matchScore: Math.min(95, 80 + (laboratoryCount * 5) + (medicalFoundationCount * 3)),
        averageSalary: 75000,
        description: 'Excellent fit for laboratory diagnostics and medical testing!',
        skillGaps: ['Molecular Diagnostics', 'Quality Management', 'Laboratory Information Systems', 'Research'],
        recommendations: [
          'Strong analytical and laboratory science foundation',
          'Bachelor\'s in Medical Laboratory Science + certification required',
          'Specialization options: Hematology, Microbiology, Chemistry, Molecular Diagnostics',
          'Average salary: $75,000 - $95,000'
        ]
      };
    }
    // Radiologic Technologist
    else if (imagingCount >= 3 || (imagingCount >= 2 && medicalFoundationCount >= 1)) {
      careerAnalysis = {
        title: 'Radiologic Technologist',
        matchScore: Math.min(95, 85 + (imagingCount * 5) + (medicalFoundationCount * 2)),
        averageSalary: 70000,
        description: 'Great match for medical imaging and diagnostic technology!',
        skillGaps: ['Advanced Imaging Modalities', 'Radiation Safety', 'Image Analysis', 'Technology Updates'],
        recommendations: [
          'Strong foundation in medical imaging and technology',
          'Associate degree in Radiologic Technology + certification required',
          'Specialization options: CT, MRI, Nuclear Medicine, Mammography',
          'Average salary: $70,000 - $85,000'
        ]
      };
    }
    // Public Health Professional - RESTORED
    else if (publicHealthCount >= 3 || (publicHealthCount >= 2 && medicalFoundationCount >= 2)) {
      careerAnalysis = {
        title: 'Public Health Professional',
        matchScore: Math.min(95, 80 + (publicHealthCount * 4) + (medicalFoundationCount * 2)),
        averageSalary: 80000,
        description: 'Great match for population health and disease prevention!',
        skillGaps: ['Health Policy', 'Program Evaluation', 'Global Health', 'Health Communication'],
        recommendations: [
          'Strong foundation in public health sciences and epidemiology',
          'MPH (Master of Public Health) degree highly recommended',
          'Career options: Government, NGOs, Healthcare Organizations, Research',
          'Average salary: $80,000 - $120,000'
        ]
      };
    }

    // ================================
    // TECHNOLOGY CAREER PATHS (10 paths)
    // ================================

    // Data Scientist / AI Engineer
    else if (dataScienceCount >= 4 || (dataScienceCount >= 3 && softwareEngineeringCount >= 2)) {
      careerAnalysis = {
        title: 'Data Scientist / AI Engineer',
        matchScore: Math.min(98, 80 + (dataScienceCount * 3) + (softwareEngineeringCount * 2)),
        averageSalary: 130000,
        description: 'Outstanding fit for data science and artificial intelligence!',
        skillGaps: ['MLOps', 'Deep Learning', 'Big Data Engineering', 'Model Deployment'],
        recommendations: [
          'Exceptional data science and machine learning expertise',
          'Consider specialization in Computer Vision, NLP, or Robotics',
          'Advanced degree in Data Science/CS often preferred',
          'Average salary: $130,000 - $200,000+'
        ]
      };
    }
    // Full Stack Developer
    else if ((frontendCount >= 3 && backendCount >= 3) || 
             (frontendCount >= 4 && backendCount >= 2) || 
             (frontendCount >= 2 && backendCount >= 4)) {
      careerAnalysis = {
        title: 'Full Stack Developer',
        matchScore: Math.min(98, 85 + (frontendCount * 2) + (backendCount * 2) + (databaseCount * 2)),
        averageSalary: 105000,
        description: 'Perfect match for full stack development across the entire web stack!',
        skillGaps: ['System Architecture', 'DevOps Integration', 'Performance Optimization', 'Security Best Practices'],
        recommendations: [
          'Excellent full stack capabilities with both frontend and backend expertise',
          'Consider specializing in modern frameworks like React/Node.js or Vue/Django',
          'Cloud deployment and DevOps skills would enhance your profile',
          'Average salary: $105,000 - $150,000'
        ]
      };
    }
    // Frontend Developer
    else if (frontendCount >= 4 || (frontendCount >= 3 && uiuxCount >= 2)) {
      careerAnalysis = {
        title: 'Frontend Developer',
        matchScore: Math.min(95, 85 + (frontendCount * 3) + (uiuxCount * 2)),
        averageSalary: 90000,
        description: 'Excellent match for frontend development and user interface creation!',
        skillGaps: ['Advanced JavaScript', 'Performance Optimization', 'Testing Frameworks', 'Build Tools'],
        recommendations: [
          'Strong frontend development skills with modern frameworks',
          'TypeScript and advanced React/Vue patterns would be valuable',
          'Consider learning mobile development or design systems',
          'Average salary: $90,000 - $125,000'
        ]
      };
    }
    // Backend Developer
    else if (backendCount >= 4 || (backendCount >= 3 && databaseCount >= 2)) {
      careerAnalysis = {
        title: 'Backend Developer',
        matchScore: Math.min(95, 85 + (backendCount * 3) + (databaseCount * 2)),
        averageSalary: 100000,
        description: 'Outstanding fit for backend development and server-side architecture!',
        skillGaps: ['Microservices Architecture', 'API Security', 'Caching Strategies', 'Message Queues'],
        recommendations: [
          'Excellent backend development foundation with database expertise',
          'Microservices and cloud architecture skills are highly valuable',
          'Consider specializing in distributed systems or API design',
          'Average salary: $100,000 - $140,000'
        ]
      };
    }
    // DevOps Engineer
    else if (devopsCount >= 4 || (devopsCount >= 3 && (backendCount >= 2 || databaseCount >= 2))) {
      careerAnalysis = {
        title: 'DevOps Engineer',
        matchScore: Math.min(98, 85 + (devopsCount * 4) + (backendCount * 2)),
        averageSalary: 120000,
        description: 'Perfect match for DevOps and cloud infrastructure engineering!',
        skillGaps: ['Site Reliability Engineering', 'Observability', 'Security Automation', 'Cost Optimization'],
        recommendations: [
          'Outstanding DevOps and cloud engineering capabilities',
          'Consider AWS/Azure/GCP certifications for specialization',
          'Site Reliability Engineering (SRE) would be a natural progression',
          'Average salary: $120,000 - $170,000'
        ]
      };
    }
    // Mobile Developer
    else if (mobileCount >= 4 || (mobileCount >= 3 && (frontendCount >= 2 || softwareEngineeringCount >= 2))) {
      careerAnalysis = {
        title: 'Mobile Developer',
        matchScore: Math.min(95, 85 + (mobileCount * 4) + (frontendCount * 2)),
        averageSalary: 95000,
        description: 'Excellent fit for mobile application development!',
        skillGaps: ['Advanced Mobile Architecture', 'Performance Optimization', 'App Store Optimization', 'Cross-Platform Expertise'],
        recommendations: [
          'Strong mobile development skills across platforms',
          'Consider specializing in React Native, Flutter, or native development',
          'AR/VR mobile development is an emerging high-value area',
          'Average salary: $95,000 - $130,000'
        ]
      };
    }
    // Cybersecurity Specialist
    else if (cybersecurityCount >= 4 || (cybersecurityCount >= 3 && (backendCount >= 2 || softwareEngineeringCount >= 2))) {
      careerAnalysis = {
        title: 'Cybersecurity Specialist',
        matchScore: Math.min(98, 85 + (cybersecurityCount * 4) + (softwareEngineeringCount * 2)),
        averageSalary: 115000,
        description: 'Outstanding fit for cybersecurity and information security roles!',
        skillGaps: ['Advanced Threat Detection', 'Incident Response', 'Security Architecture', 'Compliance Frameworks'],
        recommendations: [
          'Excellent cybersecurity foundation with technical depth',
          'Consider certifications: CISSP, CEH, OSCP, or SANS specializations',
          'Cloud security and DevSecOps are high-growth areas',
          'Average salary: $115,000 - $160,000'
        ]
      };
    }
    // Game Developer - RESTORED
    else if (gameDevCount >= 4 || (gameDevCount >= 3 && softwareEngineeringCount >= 2)) {
      careerAnalysis = {
        title: 'Game Developer',
        matchScore: Math.min(95, 85 + (gameDevCount * 4) + (softwareEngineeringCount * 2)),
        averageSalary: 85000,
        description: 'Great match for game development and interactive entertainment!',
        skillGaps: ['Advanced Game Engines', 'Multiplayer Programming', 'VR/AR Development', 'Game Optimization'],
        recommendations: [
          'Strong game development skills with programming foundation',
          'Consider specializing in Unity, Unreal Engine, or indie game development',
          'VR/AR and mobile gaming are rapidly growing segments',
          'Average salary: $85,000 - $120,000'
        ]
      };
    }
    // UI/UX Designer - RESTORED
    else if (uiuxCount >= 4 || (uiuxCount >= 3 && frontendCount >= 2)) {
      careerAnalysis = {
        title: 'UI/UX Designer',
        matchScore: Math.min(95, 85 + (uiuxCount * 4) + (frontendCount * 2)),
        averageSalary: 80000,
        description: 'Excellent fit for user interface and user experience design!',
        skillGaps: ['Design Systems', 'User Research', 'Prototyping Tools', 'Accessibility Design'],
        recommendations: [
          'Strong design foundation with user experience focus',
          'Consider specializing in product design or design systems',
          'Frontend development skills give you a significant advantage',
          'Average salary: $80,000 - $120,000'
        ]
      };
    }
    // Software Engineer (General) - RESTORED
    else if (softwareEngineeringCount >= 4 || (softwareEngineeringCount >= 3 && (frontendCount >= 2 || backendCount >= 2))) {
      careerAnalysis = {
        title: 'Software Engineer',
        matchScore: Math.min(92, 80 + (softwareEngineeringCount * 3) + (frontendCount * 2) + (backendCount * 2)),
        averageSalary: 95000,
        description: 'Strong foundation for software engineering and development roles!',
        skillGaps: ['System Design', 'Advanced Algorithms', 'Software Architecture', 'Technical Leadership'],
        recommendations: [
          'Solid software engineering fundamentals',
          'Consider specializing in a specific domain: web, mobile, or systems',
          'System design and architecture skills are valuable for senior roles',
          'Average salary: $95,000 - $140,000'
        ]
      };
    }

    // ================================
    // INTERDISCIPLINARY PATHS
    // ================================

    // Medical Technology / Health Informatics
    else if ((medicalFoundationCount >= 3 && (dataScienceCount >= 2 || softwareEngineeringCount >= 2)) || 
             (medicalFoundationCount >= 2 && dataScienceCount >= 3)) {
      careerAnalysis = {
        title: 'Medical Technology / Health Informatics Specialist',
        matchScore: Math.min(96, 80 + (medicalFoundationCount * 3) + (dataScienceCount * 3) + (softwareEngineeringCount * 2)),
        averageSalary: 110000,
        description: 'Perfect blend of medical knowledge and technology expertise!',
        skillGaps: ['Health Data Standards', 'Medical Device Integration', 'Healthcare Analytics', 'Regulatory Compliance'],
        recommendations: [
          'Exceptional combination of medical and technology skills',
          'High demand in telemedicine, medical devices, and health analytics',
          'Consider specializing in medical AI, EHR systems, or digital health',
          'Average salary: $110,000 - $150,000'
        ]
      };
    }
    // Biomedical Engineer
    else if ((medicalFoundationCount >= 2 && softwareEngineeringCount >= 3) || 
             (medicalFoundationCount >= 3 && (frontendCount >= 2 || backendCount >= 2))) {
      careerAnalysis = {
        title: 'Biomedical Engineer',
        matchScore: Math.min(95, 80 + (medicalFoundationCount * 3) + (softwareEngineeringCount * 3)),
        averageSalary: 100000,
        description: 'Excellent fit for biomedical engineering and medical technology!',
        skillGaps: ['Medical Device Design', 'Regulatory Affairs', 'Biomedical Signal Processing', 'Clinical Trials'],
        recommendations: [
          'Strong foundation in both medical sciences and engineering',
          'Medical device development and digital health are growing rapidly',
          'Consider specializing in medical imaging, prosthetics, or diagnostic equipment',
          'Average salary: $100,000 - $135,000'
        ]
      };
    }

    // ================================
    // GENERAL CATEGORY PATHS
    // ================================

    // Healthcare Professional (General)
    else if (medicalFoundationCount >= 3 || nursingCount >= 2 || 
             (medicalFoundationCount >= 2 && (laboratoryCount >= 1 || imagingCount >= 1)) ||
             mentalHealthCount >= 2 || publicHealthCount >= 2) {
      careerAnalysis = {
        title: 'Healthcare Professional',
        matchScore: Math.min(85, 70 + (medicalFoundationCount * 4) + (nursingCount * 3) + (mentalHealthCount * 3)),
        averageSalary: 75000,
        description: 'Strong foundation for various healthcare career paths!',
        skillGaps: ['Clinical Experience', 'Specialty Knowledge', 'Professional Certification', 'Patient Care Skills'],
        recommendations: [
          'Solid medical knowledge foundation',
          'Consider focusing on a specific healthcare specialty',
          'Clinical experience and certification will enhance opportunities',
          'Average salary: $75,000 - $120,000 depending on specialty'
        ]
      };
    }
    // Technology Professional (General)
    else if (frontendCount >= 2 || backendCount >= 2 || dataScienceCount >= 2 || 
             softwareEngineeringCount >= 3 || devopsCount >= 2 || uiuxCount >= 2 || gameDevCount >= 2) {
      careerAnalysis = {
        title: 'Technology Professional',
        matchScore: Math.min(80, 65 + (frontendCount * 3) + (backendCount * 3) + (dataScienceCount * 3) + (softwareEngineeringCount * 2)),
        averageSalary: 85000,
        description: 'Good foundation for technology and software development roles!',
        skillGaps: ['Specialized Framework', 'Advanced Programming', 'System Design', 'Industry Experience'],
        recommendations: [
          'Solid technology foundation with room for specialization',
          'Consider focusing on a specific tech stack or domain',
          'Building projects and gaining experience will accelerate growth',
          'Average salary: $85,000 - $120,000 depending on specialization'
        ]
      };
    }

    // ================================
    // DEFAULT CAREER EXPLORER
    // ================================
    else {
      careerAnalysis = {
        title: 'Career Explorer',
        matchScore: 60,
        averageSalary: 65000,
        description: 'Great foundation for exploring diverse career opportunities!',
        skillGaps: ['Specialized Skills', 'Industry Knowledge', 'Professional Experience', 'Certification/Education'],
        recommendations: [
          'Consider exploring both medical and technology fields based on your interests',
          'Medical fields: Medicine, Nursing, Pharmacy, Physical Therapy offer excellent growth',
          'Technology fields: Software Development, Data Science, Cybersecurity are in high demand',
          'Focus on building depth in a chosen field through education and experience',
          'Average salary varies significantly: $50,000 - $300,000+ depending on specialization'
        ]
      };
    }

    console.log('Final career recommendation:', careerAnalysis.title);
    return careerAnalysis;

  } catch (error) {
    console.error('Error in analyzeSkills:', error);
    return {
      title: 'Career Explorer',
      matchScore: 60,
      averageSalary: 65000,
      description: 'Error in analysis - please try again!',
      skillGaps: ['System Error'],
      recommendations: ['Please refresh and try again']
    };
  }
}

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Career PathFinder Pro Backend is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Career PathFinder Pro backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Career analysis route
app.post('/api/career/analyze', (req, res) => {
  console.log('Analysis request received:', req.body);
  
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    console.log('Invalid skills data received');
    return res.status(400).json({
      success: false,
      message: 'Please provide skills array'
    });
  }

  console.log('Processing skills:', skills);

  try {
    const analysis = analyzeSkills(skills);

    const responseData = {
      userSkills: skills,
      topMatch: {
        title: analysis.title,
        matchScore: analysis.matchScore,
        averageSalary: analysis.averageSalary,
        description: analysis.description
      },
      recommendations: analysis.recommendations,
      skillGaps: analysis.skillGaps,
      timestamp: new Date().toISOString()
    };

    console.log('Sending analysis for:', analysis.title);

    res.json({
      success: true,
      message: 'Career analysis completed',
      data: responseData
    });
  } catch (error) {
    console.error('Error in career analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

const PORT = 3001;

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    return;
  }
  console.log(`✅ Career PathFinder Pro server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Career analysis: http://localhost:${PORT}/api/career/analyze`);
  console.log('🏥💻🎮🎨 COMPLETE Medical + Tech + Game Dev + Design career analysis enabled!');
});