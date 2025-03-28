import { db } from "../server/db";
import { users } from "../shared/schema";

async function createAdminUser() {
  console.log("Creating admin user...");
  
  try {
    // Create an admin user
    const [user] = await db.insert(users).values({
      username: "admin",
      password: "admin123" // In a production app, you would hash this password
    }).returning();
    
    console.log(`Successfully created admin user with ID: ${user.id}`);
    return user;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  } finally {
    // No need to explicitly close the connection in this script
    // The process.exit() will terminate all connections
  }
}

// Run the function
createAdminUser()
  .then(() => {
    console.log("Admin user creation completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Admin user creation failed:", error);
    process.exit(1);
  });