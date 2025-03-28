import { db } from "../server/db";
import { assessments } from "../shared/schema";

async function seedDatabase() {
  console.log("Seeding database with test data...");
  
  try {
    // Create a test assessment
    const [assessment] = await db.insert(assessments).values({
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      data: {
        generalInformation: {
          age: 32,
          sex: "Female",
          ethnicity: "African",
          educationLevel: "Undergraduate",
          maritalStatus: "Married",
          dependents: 2,
          livingArrangement: "With family & friends",
          employmentStatus: "Currently Employed",
          vulnerability: ["Not applicable"]
        },
        incidentDetails: {
          location: "Survivor/Victim's Home",
          violenceType: ["Physical Assault", "Psychological/Emotional Abuse"],
          perpetratorRelationship: "Spouse",
          frequency: "Weekly",
          lengthOfExposure: "2 years",
          reportingStatus: "Yes",
          servicesReceived: "Medical care, Police report",
          outcome: "Legal case in progress"
        },
        anxietySymptoms: {
          nervous: 2,
          cantStopWorrying: 2,
          worryingTooMuch: 3,
          troubleRelaxing: 3,
          restless: 2,
          irritable: 3,
          afraid: 2
        },
        depressionSymptoms: {
          littleInterest: 2,
          feelingDown: 3,
          troubleSleeping: 3,
          tired: 2,
          poorAppetite: 1,
          feelingBad: 2,
          troubleConcentrating: 2,
          movingSpeaking: 1,
          thoughtsOfHarm: 0
        },
        traumaSymptoms: {
          disturbingMemories: 3,
          avoidingMemories: 2,
          beingAlert: 3,
          feelingJumpy: 2,
          difficultyPositiveEmotions: 2,
          troubleRemembering: 1
        },
        traumaBonding: {
          emotionalAttachment: 3,
          defendingAbuser: 2,
          feelingGuilt: 3,
          believingLoveChanges: 2,
          reliefAfterKindness: 3,
          difficultyImaginingLife: 2,
          urgeToRemain: 2,
          justifyingStaying: 3,
          minimizingSeverity: 1,
          anxietyAboutLeaving: 2
        },
        socialSupport: {
          sources: ["Family", "Friends", "Support group"],
          satisfactionLevel: "Moderate",
          copingMechanisms: ["Prayer/religious activities", "Exercise", "Talking to friends"],
          previousCounseling: "None"
        },
        physicalWellbeing: {
          overallHealth: "Fair",
          chronicPain: "Yes - back pain from physical assault",
          chronicConditions: "None",
          injuries: ["Bruises", "Chronic pain"],
          difficultyDailyActivities: "Moderate",
          sexualHealthIssues: "None reported",
          medicalCare: "Basic treatment received",
          sleepDisturbances: "Difficulty falling asleep, nightmares",
          impactOnWork: "Missed work due to injuries",
          healthcareAccess: "Limited due to financial constraints",
          unmetMedicalNeeds: "Physiotherapy"
        },
        riskAssessment: {
          suicidalThoughts: "None",
          feelingSafe: "Sometimes unsafe",
          furtherHarmRisk: "Moderate risk",
          safetyPlanNeeded: "Yes"
        },
        programExpectations: {
          expectations: "Counseling, safety planning, legal advice",
          desiredChanges: "Feel safer at home, reduce anxiety, develop coping skills"
        }
      }
    }).returning();
    
    console.log(`Successfully created test assessment with ID: ${assessment.id}`);
    return assessment;
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    // Close the database connection
    await db.end?.();
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("Database seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exit(1);
  });