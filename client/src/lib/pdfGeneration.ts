import { jsPDF } from "jspdf";
import { FormData } from "@shared/schema";
import { 
  anxietyScoreInterpretation, 
  depressionScoreInterpretation, 
  traumaScoreInterpretation,
  traumaBondingScoreInterpretation,
  getRiskStatus,
  getRecommendedInterventions,
  formOptions
} from "./assessmentUtils";

// Helper function to create multi-line text
const addWrappedText = (
  doc: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number,
  lineHeight: number = 7
): number => {
  const textLines = doc.splitTextToSize(text, maxWidth);
  doc.text(textLines, x, y);
  return y + (textLines.length * lineHeight);
};

// Helper to format date
const formatDate = (): string => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate PDF for assessment
export const generateAssessmentPDF = (formData: FormData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  let y = 15; // Starting Y position
  const margin = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("GBV Psychosocial Assessment Report", margin, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${formatDate()}`, margin, y);
  
  y += 10;
  doc.setDrawColor(70, 130, 180);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  
  y += 10;
  
  // Section 1: General Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("1. General Information", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Create a table-like structure for general info
  const generalInfo = formData.generalInformation;
  const infoItems = [
    { label: "Age", value: generalInfo.age || "Not provided" },
    { label: "Sex", value: generalInfo.sex || "Not provided" },
    { label: "Ethnicity/Tribe", value: generalInfo.ethnicity || "Not provided" },
    { label: "Education", value: generalInfo.education || "Not provided" },
    { label: "Marital Status", value: generalInfo.maritalStatus || "Not provided" },
    { label: "Dependents", value: generalInfo.dependents || "Not provided" },
    { label: "Living Arrangement", value: generalInfo.livingArrangement || "Not provided" },
    { label: "Employment Status", value: generalInfo.employmentStatus || "Not provided" },
    { label: "Vulnerabilities", value: generalInfo.vulnerabilities.length > 0 ? generalInfo.vulnerabilities.join(", ") : "None" },
  ];
  
  infoItems.forEach(item => {
    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}: `, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(item.value, margin + 35, y);
    y += 6;
  });
  
  // Section 2: Incident Details
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("2. Incident Details", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const incidentDetails = formData.incidentDetails;
  const incidentItems = [
    { label: "Location", value: incidentDetails.location || "Not provided" },
    { label: "Type of Violence", value: incidentDetails.violenceTypes.length > 0 ? incidentDetails.violenceTypes.join(", ") : "Not provided" },
    { label: "Perpetrator Relationship", value: incidentDetails.perpetratorRelationship || "Not provided" },
    { label: "Frequency", value: incidentDetails.frequency || "Not provided" },
    { label: "Length of Exposure", value: incidentDetails.exposure || "Not provided" },
    { label: "Reported", value: incidentDetails.reportingStatus || "Not provided" },
  ];
  
  incidentItems.forEach(item => {
    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}: `, margin, y);
    doc.setFont("helvetica", "normal");
    
    // Handle potential long text
    if (item.value.length > 60) {
      y = addWrappedText(doc, item.value, margin + 40, y, contentWidth - 40);
    } else {
      doc.text(item.value, margin + 40, y);
      y += 6;
    }
  });
  
  // Services Received (if any)
  if (incidentDetails.servicesReceived) {
    doc.setFont("helvetica", "bold");
    doc.text("Services Received: ", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, incidentDetails.servicesReceived, margin, y, contentWidth);
    y += 2;
  }
  
  // Outcome (if any)
  if (incidentDetails.outcome) {
    doc.setFont("helvetica", "bold");
    doc.text("Outcome: ", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, incidentDetails.outcome, margin, y, contentWidth);
    y += 2;
  }
  
  // Check if we need to add a new page
  if (y > 250) {
    doc.addPage();
    y = 15;
  }
  
  // Section 3: Mental Health Assessment
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("3. Mental Health Assessment", margin, y);
  
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Anxiety (GAD-7)", margin, y);
  
  y += 6;
  doc.setFont("helvetica", "normal");
  const anxietyScore = formData.anxietySymptoms.totalScore;
  const anxietyResult = anxietyScoreInterpretation(anxietyScore);
  doc.text(`Score: ${anxietyScore}/21 - ${anxietyResult.level}`, margin, y);
  
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Depression (PHQ-9)", margin, y);
  
  y += 6;
  doc.setFont("helvetica", "normal");
  const depressionScore = formData.depressionSymptoms.totalScore;
  const depressionResult = depressionScoreInterpretation(depressionScore);
  doc.text(`Score: ${depressionScore}/27 - ${depressionResult.level}`, margin, y);
  
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Trauma Symptoms (PCL-5)", margin, y);
  
  y += 6;
  doc.setFont("helvetica", "normal");
  const traumaScore = formData.traumaSymptoms.ptsdTotalScore;
  const traumaResult = traumaScoreInterpretation(traumaScore);
  doc.text(`Score: ${traumaScore}/24 - ${traumaResult.level}`, margin, y);
  
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Trauma Bonding", margin, y);
  
  y += 6;
  doc.setFont("helvetica", "normal");
  const bondingScore = formData.traumaSymptoms.bondingTotalScore;
  const bondingResult = traumaBondingScoreInterpretation(bondingScore);
  doc.text(`Score: ${bondingScore}/40 - ${bondingResult.level}`, margin, y);
  
  // Section 4: Risk Assessment
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("4. Risk Assessment", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const riskAssessment = formData.riskAssessment;
  const suicidalThoughts = riskAssessment.suicidalThoughts || "Not assessed";
  const safetyFeeling = riskAssessment.safetyFeeling || "Not assessed";
  const furtherHarmRisk = riskAssessment.furtherHarmRisk || "Not assessed";
  const safetyPlanNeeded = riskAssessment.safetyPlanNeeded || "Not assessed";
  
  const riskItems = [
    { label: "Suicidal Thoughts", value: suicidalThoughts },
    { label: "Safety Feeling", value: safetyFeeling },
    { label: "Risk of Further Harm", value: furtherHarmRisk },
    { label: "Safety Plan Needed", value: safetyPlanNeeded },
  ];
  
  riskItems.forEach(item => {
    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}: `, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(item.value, margin + 45, y);
    y += 6;
  });
  
  // Overall Risk Status
  const riskStatus = getRiskStatus(suicidalThoughts, furtherHarmRisk);
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.text("Risk Status: ", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(riskStatus.status, margin + 25, y);
  
  // Check if we need to add a new page
  if (y > 250) {
    doc.addPage();
    y = 15;
  }
  
  // Section 5: Recommended Interventions
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("5. Recommended Interventions", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const interventions = getRecommendedInterventions(
    anxietyScore,
    depressionScore,
    traumaScore,
    suicidalThoughts,
    furtherHarmRisk,
    formData.socialSupport.supportSources,
    formData.socialSupport.supportSatisfaction,
    formData.physicalWellbeing.physicalInjuries,
    formData.programExpectations.priorities
  );
  
  interventions.forEach(intervention => {
    doc.text("•", margin, y);
    y = addWrappedText(doc, intervention, margin + 5, y, contentWidth - 5);
    y += 2;
  });
  
  // Section 6: Client Expectations and Goals
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("6. Client Expectations and Goals", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Expectations
  if (formData.programExpectations.expectations) {
    doc.setFont("helvetica", "bold");
    doc.text("Expectations from Support: ", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, formData.programExpectations.expectations, margin, y, contentWidth);
    y += 2;
  }
  
  // Life Changes
  if (formData.programExpectations.lifeChanges) {
    doc.setFont("helvetica", "bold");
    doc.text("Desired Life Changes: ", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, formData.programExpectations.lifeChanges, margin, y, contentWidth);
    y += 2;
  }
  
  // Priorities
  if (formData.programExpectations.priorities.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Priorities: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.programExpectations.priorities.join(", "), margin + 20, y);
    y += 6;
  }
  
  // Timeframe
  if (formData.programExpectations.timeframe) {
    doc.setFont("helvetica", "bold");
    doc.text("Timeframe: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.programExpectations.timeframe, margin + 20, y);
    y += 6;
  }
  
  // Footer
  y = 280;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("CONFIDENTIAL: This assessment contains sensitive information and is intended for authorized personnel only.", margin, y);
  
  // Save the PDF
  doc.save("GBV-Psychosocial-Assessment.pdf");
};

// Export assessment as JSON
export const exportAssessmentJSON = (formData: FormData): void => {
  const dataStr = JSON.stringify(formData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `GBV-Assessment-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
