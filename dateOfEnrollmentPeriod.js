//change the date in accordance to the enrollment period of a school year.
function updateEnrollmentPeriod() {
    // Get the element with the ID "enrollmentPeriod"
    const enrollmentPeriodElement = document.getElementById("enrollmentPeriod");
  
    // UPDATE THIS FOR THE ENROLLMENT PERIOD
    enrollmentPeriodElement.textContent = "The enrollment period will remain open until the start of the school year. We are currently offering a tuition fee discount that is valid until May 31, 2024.";
  }
  
  // Call the updateEnrollmentPeriod function on page load
  updateEnrollmentPeriod();