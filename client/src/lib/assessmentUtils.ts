// Anxiety (GAD-7) scoring
export const anxietyScoreInterpretation = (score: number): { level: string; severity: 'none' | 'mild' | 'moderate' | 'severe'; color: string } => {
  if (score >= 15) {
    return { level: 'Severe anxiety', severity: 'severe', color: 'text-red-700' };
  } else if (score >= 10) {
    return { level: 'Moderate anxiety', severity: 'moderate', color: 'text-orange-700' };
  } else if (score >= 5) {
    return { level: 'Mild anxiety', severity: 'mild', color: 'text-yellow-700' };
  } else {
    return { level: 'Minimal anxiety', severity: 'none', color: 'text-green-700' };
  }
};

// Depression (PHQ-9) scoring
export const depressionScoreInterpretation = (score: number): { level: string; severity: 'none' | 'mild' | 'moderate' | 'moderately-severe' | 'severe'; color: string } => {
  if (score >= 20) {
    return { level: 'Severe depression', severity: 'severe', color: 'text-red-700' };
  } else if (score >= 15) {
    return { level: 'Moderately severe depression', severity: 'moderately-severe', color: 'text-orange-700' };
  } else if (score >= 10) {
    return { level: 'Moderate depression', severity: 'moderate', color: 'text-yellow-600' };
  } else if (score >= 5) {
    return { level: 'Mild depression', severity: 'mild', color: 'text-yellow-700' };
  } else {
    return { level: 'Minimal depression', severity: 'none', color: 'text-green-700' };
  }
};

// Trauma (PCL-5) scoring
export const traumaScoreInterpretation = (score: number): { level: string; severity: 'none' | 'moderate' | 'severe'; color: string } => {
  if (score >= 33) {
    return { level: 'Probable PTSD', severity: 'severe', color: 'text-red-700' };
  } else if (score >= 20) {
    return { level: 'Concerning trauma symptoms', severity: 'moderate', color: 'text-orange-700' };
  } else {
    return { level: 'Below clinical threshold', severity: 'none', color: 'text-green-700' };
  }
};

// Trauma bonding scoring
export const traumaBondingScoreInterpretation = (score: number): { level: string; severity: 'none' | 'mild' | 'moderate' | 'severe'; color: string } => {
  if (score >= 30) {
    return { level: 'Severe trauma bonding', severity: 'severe', color: 'text-red-700' };
  } else if (score >= 20) {
    return { level: 'Moderate trauma bonding', severity: 'moderate', color: 'text-orange-700' };
  } else if (score >= 10) {
    return { level: 'Mild trauma bonding', severity: 'mild', color: 'text-yellow-700' };
  } else {
    return { level: 'Minimal trauma bonding', severity: 'none', color: 'text-green-700' };
  }
};

// Get risk status
export const getRiskStatus = (suicidalThoughts: string, furtherHarmRisk: string): {
  status: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  color: string;
} => {
  if (suicidalThoughts === 'Active thoughts with plan' || furtherHarmRisk === 'Immediate danger') {
    return { 
      status: 'Critical Risk - Immediate Intervention Required', 
      severity: 'critical', 
      color: 'text-red-700' 
    };
  } else if (suicidalThoughts === 'Active thoughts without plan' || furtherHarmRisk === 'High risk') {
    return { 
      status: 'High Risk - Urgent Attention Required', 
      severity: 'high', 
      color: 'text-orange-700' 
    };
  } else if (suicidalThoughts === 'Passive thoughts (e.g., \'I wish I wouldn\'t wake up\')' || furtherHarmRisk === 'Moderate risk') {
    return { 
      status: 'Moderate Risk - Close Monitoring Advised', 
      severity: 'moderate', 
      color: 'text-yellow-700' 
    };
  } else {
    return { 
      status: 'Low/Minimal Risk', 
      severity: 'low', 
      color: 'text-green-700' 
    };
  }
};

// Get recommended interventions based on suicide risk and further harm risk
export const getRecommendedInterventions = (
  suicidalThoughts: string,
  furtherHarmRisk: string
): string[] => {
  const interventions: string[] = [];
  const riskStatus = getRiskStatus(suicidalThoughts, furtherHarmRisk);
  
  // Risk based interventions
  if (riskStatus.severity === 'high' || riskStatus.severity === 'critical') {
    interventions.push('Safety planning');
    interventions.push('Crisis intervention');

    if (suicidalThoughts.includes('Active thoughts')) {
      interventions.push('Immediate referral to psychiatric services');
      interventions.push('Suicide risk assessment and monitoring');
    }
    
    if (furtherHarmRisk.includes('Immediate danger')) {
      interventions.push('Emergency shelter services');
      interventions.push('Legal protection (restraining order)');
    }
  }

  if (riskStatus.severity === 'moderate') {
    interventions.push('Regular safety check-ins');
    interventions.push('Trauma-focused therapy');
    interventions.push('Support group participation');
  }
  
  // Add standard interventions based on GBV context
  interventions.push('Individual psychotherapy');
  
  if (furtherHarmRisk.includes('contact with perpetrator')) {
    interventions.push('Legal advocacy');
  }
  
  // If limited interventions identified, add general support options
  if (interventions.length < 3) {
    if (!interventions.includes('Individual psychotherapy')) {
      interventions.push('Individual psychotherapy');
    }
    interventions.push('Psychoeducation on GBV impacts and recovery');
    interventions.push('Social support enhancement');
  }
  
  return interventions;
};

// Form options for various sections
export const formOptions = {
  vulnerabilityOptions: [
    'Physical disability', 'PLHIV', 'Female sex worker', 'IDP', 'Drug user', 'Widow', 
    'Out of school child', 'Minor', 'Housemaid/Domestic worker', 'Child Apprentice', 
    'Orphans', 'Not applicable', 'Others'
  ],
  
  incidentLocationOptions: [
    'Survivor/Victim\'s Home', 'Perpetrator\'s house', 'Bush/forest', 'Road', 
    'School', 'Place of Work', 'IDP Camp', 'Others'
  ],
  
  violenceTypeOptions: [
    'Sexual Assault', 'Physical Assault', 'Financial/Economic', 'Online/Cyberspace', 
    'Rape', 'Defilement', 'Forced Marriage', 'Denial of Resources', 
    'Psychological/Emotional Abuse', 'Female Genital Mutilation', 
    'Violation of property & inheritance right', 'Child abuse and neglect', 'Others'
  ],
  
  perpetratorRelationshipOptions: [
    'Stranger', 'Service provider', 'Spouse', 'Current intimate partner',
    'Former intimate partner', 'Parent', 'Relative', 'Law enforcement agent',
    'Religious leader', 'Teacher/Lecturer'
  ],
  
  frequencyOptions: [
    'One-time incident', 'Daily', 'Weekly', 'Monthly', 'Occasionally'
  ],
  
  exposureOptions: [
    'One-time incident', 'Less than 1 month', '1-3 months', '3-6 months',
    '6-12 months', '1-2 years', '2-5 years', 'More than 5 years'
  ],
  
  educationOptions: [
    'No education', 'Some Primary school', 'Completed primary', 'Some Secondary',
    'Completed secondary', 'Undergraduate', 'Graduate', 'Postgraduate', 'Religious'
  ],
  
  maritalStatusOptions: [
    'Never Married', 'Married', 'Cohabiting', 'Divorced', 'Separated', 'Widowed', 'Minor'
  ],
  
  livingArrangementOptions: [
    'With family & friends', 'Alone', 'Shelter', 'Others'
  ],
  
  employmentStatusOptions: [
    'Currently Employed', 'Self-Employed', 'Unemployed', 'Not reported'
  ],
  
  anxietyQuestions: [
    'Feeling nervous, anxious, or on edge',
    'Not able to control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being restless',
    'Easily annoyed or irritable',
    'Afraid as if something awful might happen'
  ],
  
  depressionQuestions: [
    'Little interest or pleasure in activities',
    'Feeling down, depressed, hopeless',
    'Trouble sleeping',
    'Feeling tired, low energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself',
    'Trouble concentrating',
    'Moving/speaking slowly or being fidgety',
    'Thoughts of self-harm'
  ],
  
  traumaQuestions: [
    'Disturbing memories',
    'Avoiding memories or feelings',
    'Being super alert or watchful',
    'Feeling jumpy',
    'Difficulty experiencing positive emotions',
    'Trouble remembering traumatic events'
  ],
  
  traumaBondingQuestions: [
    'Emotional attachment despite harm',
    'Defending abuser\'s behavior',
    'Feeling guilt for abuse',
    'Believing love can change abuser',
    'Relief/happiness at kindness from abuser',
    'Difficulty imagining life without abuser',
    'Strong urge to remain connected',
    'Justifying staying due to dependence',
    'Minimizing severity of abuse',
    'Anxiety/distress at thought of leaving'
  ],
  
  supportSourceOptions: [
    'Family', 'Friends', 'Religious community', 'Coworkers',
    'Counseling/Therapy', 'Support group', 'Community organization', 'None'
  ],
  
  copingMechanismOptions: [
    'Exercise/physical activity', 'Meditation/mindfulness', 'Religious practices',
    'Hobbies', 'Social interactions', 'Journaling', 'Substance use', 'Avoidance'
  ],
  
  physicalInjuryOptions: [
    'Head injuries', 'Fractures', 'Bruises', 'Internal injuries', 'Chronic pain',
    'Difficulty breathing', 'Hearing/vision impairment', 'Gynecological issues',
    'Gastrointestinal issues', 'None'
  ],
  
  sexualHealthIssueOptions: [
    'Unwanted pregnancy', 'STIs', 'Chronic pain', 'Reproductive complications', 'None'
  ],
  
  sleepDisturbanceOptions: [
    'Difficulty falling asleep', 'Frequent waking', 'Nightmares', 'Exhaustion', 'None'
  ],
  
  healthcareBarrierOptions: [
    'Financial constraints', 'Distance to healthcare facilities', 'Fear/stigma',
    'Lack of specialized services', 'None'
  ],
  
  workImpactOptions: [
    'No impact', 'Mild impact', 'Moderate impact', 'Severe impact', 'Unable to work'
  ],
  
  overallHealthOptions: [
    'Excellent', 'Good', 'Fair', 'Poor', 'Very poor'
  ],
  
  suicidalThoughtOptions: [
    'Never', 'In the past, but not currently',
    'Passive thoughts (e.g., \'I wish I wouldn\'t wake up\')',
    'Active thoughts without plan', 'Active thoughts with plan'
  ],
  
  safetyFeelingOptions: [
    'Very safe', 'Somewhat safe', 'Somewhat unsafe', 'Very unsafe'
  ],
  
  furtherHarmRiskOptions: [
    'No risk', 'Low risk', 'Moderate risk', 'High risk', 'Immediate danger'
  ],
  
  priorityOptions: [
    'Physical safety', 'Mental health/emotional well-being', 'Housing/shelter',
    'Financial support', 'Legal assistance', 'Medical care', 'Parenting support',
    'Education/skills training'
  ],
  
  timeframeOptions: [
    'Crisis intervention only (1-3 sessions)', 'Short-term (1-3 months)',
    'Medium-term (3-6 months)', 'Long-term (6+ months)'
  ]
};
