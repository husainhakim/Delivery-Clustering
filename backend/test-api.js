import axios from 'axios';

async function run() {
  try {
    // We can simulate an admin token because we know the secret
    // Wait, let's just do it directly against the DB to see if it's empty
    console.log("Checking DB directly...");
  } catch(e) {
    console.error(e);
  }
}
run();
