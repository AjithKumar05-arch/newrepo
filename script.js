let map;
let marker;
let currentLocation = null;

// Initialize Google Map
function initMap() {
  const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India center
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 5,
  });
}

document.getElementById("getLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        currentLocation = { lat, lng };

        map.setCenter(currentLocation);
        map.setZoom(15);

        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
        });

        document.getElementById("locationDisplay").textContent =
          `Location Detected: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

// Utility: Generate unique ID for each report
function generateReportID() {
  return 'report-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// Handle report submission
document.getElementById("reportForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const photoInput = document.getElementById("photo");
  const desc = document.getElementById("description").value;
  const reportsContainer = document.getElementById("reportsContainer");

  const reader = new FileReader();
  reader.onload = function(event) {
    const reportID = generateReportID();

    const reportCard = document.createElement("div");
    reportCard.classList.add("report-card");

    reportCard.innerHTML = `
      <img src="${event.target.result}" width="100%">
      <p><strong>Description:</strong> ${desc}</p>
      <p><strong>Location:</strong> ${
        currentLocation
          ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
          : "Not detected"
      }</p>
      <button class="upvote-btn" data-id="${reportID}">⬆️ Upvote</button>
      <span class="upvote-count">0</span> Upvotes
    `;

    const upvoteBtn = reportCard.querySelector(".upvote-btn");
    const upvoteCount = reportCard.querySelector(".upvote-count");

    // Check if already upvoted in localStorage
    let upvotedReports = JSON.parse(localStorage.getItem("upvotedReports") || "[]");
    if (upvotedReports.includes(reportID)) {
      upvoteBtn.disabled = true;
      upvoteBtn.textContent = "✅ Upvoted";
    }

    // Upvote functionality
    upvoteBtn.addEventListener("click", () => {
      let count = parseInt(upvoteCount.textContent);
      count++;
      upvoteCount.textContent = count;

      upvoteBtn.disabled = true;
      upvoteBtn.textContent = "✅ Upvoted";
      upvotedReports.push(reportID);
      localStorage.setItem("upvotedReports", JSON.stringify(upvotedReports));
    });

    reportsContainer.appendChild(reportCard);
  };

  if (photoInput.files[0]) reader.readAsDataURL(photoInput.files[0]);
  e.target.reset();
  document.getElementById("locationDisplay").textContent = "Location: Not detected yet";
});
