document.addEventListener("DOMContentLoaded", function () {
  // --- Get all DOM elements once ---
  const frontZone = document.getElementById("front-drop-zone");
  const backZone = document.getElementById("back-drop-zone");
  const frontUploadInput = document.getElementById("front-upload");
  const backUploadInput = document.getElementById("back-upload");
  const analyzeBtn = document.getElementById("analyze-btn");
  const statusEl = document.getElementById("upload-status");

  // --- Helper function to update the UI for a file input ---
  function updateFileDisplay(zoneId, file) {
    const uploadContent = document.getElementById(`${zoneId}-upload-content`);
    const fileInfo = document.getElementById(`${zoneId}-file-info`);
    const fileNameEl = document.getElementById(`${zoneId}-file-name`);
    const fileSizeEl = document.getElementById(`${zoneId}-file-size`);
    const zone = document.getElementById(`${zoneId}-drop-zone`);

    if (file) {
      uploadContent.classList.add("hidden");
      fileInfo.classList.remove("hidden");
      zone.classList.remove("border-slate-300", "bg-slate-50");
      zone.classList.add("border-green-500", "bg-green-50");
      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = (file.size / 1024).toFixed(2) + " KB";
    } else {
      uploadContent.classList.remove("hidden");
      fileInfo.classList.add("hidden");
      zone.classList.remove("border-green-500", "bg-green-50");
      zone.classList.add("border-slate-300", "bg-slate-50");
    }
  }

  function checkFormValidity() {
    if (frontUploadInput.files.length > 0 && backUploadInput.files.length > 0) {
      analyzeBtn.disabled = false;
    } else {
      analyzeBtn.disabled = true;
    }
  }

  // Helper to show a transient status message to the user
  function showStatusMessage(msg, timeoutMs = 3000) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove("text-red-600");
    statusEl.classList.add("text-green-600");
    clearTimeout(showStatusMessage._t);
    showStatusMessage._t = setTimeout(
      () => (statusEl.textContent = ""),
      timeoutMs
    );
  }

  // // --- NEW: Handle form submission with AJAX ---
  // uploadForm.addEventListener("submit", function (e) {
  //   e.preventDefault(); // Prevent default form submission

  //   // Show analyzing page immediately
  //   showAnalyzingPage();

  //   // Create FormData from the form
  //   const formData = new FormData(uploadForm);

  //   // Submit the form via AJAX
  //   fetch("/upload", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Analysis failed");
  //       }
  //       return response.text();
  //     })
  //     .then((html) => {
  //       // Replace current page with results page
  //       document.open();
  //       document.write(html);
  //       document.close();
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       alert("Analysis failed. Please try again.");
  //       // Reload the page to reset
  //       window.location.reload();
  //     });
  // });

  // // --- NEW: Function to show analyzing page ---
  // function showAnalyzingPage() {
  //   document.body.innerHTML = `
  //     <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
  //       <div class="text-center">
  //         <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 animate-pulse">
  //           <svg class="h-10 w-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  //           </svg>
  //         </div>
  //         <h2 class="text-2xl text-slate-900 mb-2">Analyzing Aadhaar Card</h2>
  //         <p class="text-slate-600 mb-6">Running AI-powered fraud detection algorithms...</p>
  //         <div class="max-w-md mx-auto space-y-2" id="progress-steps">
  //           <div class="flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-blue-200 bg-blue-50">
  //             <span>Uploading Images</span>
  //             <span class="text-blue-600">⟳ In Progress</span>
  //           </div>
  //           <div class="flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-slate-200">
  //             <span>OCR Processing</span>
  //             <span class="text-slate-400">○ Pending</span>
  //           </div>
  //           <div class="flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-slate-200">
  //             <span>QR Code Decoding</span>
  //             <span class="text-slate-400">○ Pending</span>
  //           </div>
  //           <div class="flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-slate-200">
  //             <span>Visual Analysis</span>
  //             <span class="text-slate-400">○ Pending</span>
  //           </div>
  //           <div class="flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-slate-200">
  //             <span>Metadata Extraction</span>
  //             <span class="text-slate-400">○ Pending</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `;

  //   // Animate progress steps
  //   animateProgressSteps();
  // }

  // // --- NEW: Animate the progress steps ---
  // function animateProgressSteps() {
  //   const steps = [
  //     { delay: 500, index: 0, text: "Uploading Images" },
  //     { delay: 2000, index: 1, text: "OCR Processing" },
  //     { delay: 4000, index: 2, text: "QR Code Decoding" },
  //     { delay: 6000, index: 3, text: "Visual Analysis" },
  //     { delay: 8000, index: 4, text: "Metadata Extraction" },
  //   ];

  //   steps.forEach((step) => {
  //     setTimeout(() => {
  //       const container = document.getElementById("progress-steps");
  //       if (!container) return;

  //       const stepElements = container.children;

  //       // Mark previous steps as complete
  //       for (let i = 0; i < step.index; i++) {
  //         stepElements[i].className =
  //           "flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-green-200 bg-green-50";
  //         stepElements[i].querySelector("span:last-child").innerHTML =
  //           '<span class="text-green-600">✓ Complete</span>';
  //       }

  //       // Mark current step as in progress
  //       if (stepElements[step.index]) {
  //         stepElements[step.index].className =
  //           "flex items-center justify-between text-sm text-slate-600 px-4 py-2 bg-white rounded-lg border border-blue-200 bg-blue-50";
  //         stepElements[step.index].querySelector("span:last-child").innerHTML =
  //           '<span class="text-blue-600">⟳ In Progress</span>';
  //       }
  //     }, step.delay);
  //   });
  // }

  // --- Change listeners ---
  frontUploadInput.addEventListener("change", () => {
    if (frontUploadInput.files.length > 0) {
      const file = frontUploadInput.files[0];
      updateFileDisplay("front", file);
      console.log(
        `✅ Front image accepted: ${file.name} (${(file.size / 1024).toFixed(
          2
        )} KB)`
      );
      showStatusMessage(`Front image "${file.name}" uploaded successfully.`);
    } else {
      updateFileDisplay("front", null);
    }
    checkFormValidity();
  });

  backUploadInput.addEventListener("change", () => {
    if (backUploadInput.files.length > 0) {
      const file = backUploadInput.files[0];
      updateFileDisplay("back", file);
      console.log(
        `✅ Back image accepted: ${file.name} (${(file.size / 1024).toFixed(
          2
        )} KB)`
      );
      showStatusMessage(`Back image "${file.name}" uploaded successfully.`);
    } else {
      updateFileDisplay("back", null);
    }
    checkFormValidity();
  });

  // Handle drag and drop events
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    [frontZone, backZone].forEach((zone) => {
      zone.addEventListener(
        eventName,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });
  });

  // Handle file drop
  frontZone.addEventListener("drop", (e) => {
    frontUploadInput.files = e.dataTransfer.files;
    frontUploadInput.dispatchEvent(new Event("change"));
  });

  backZone.addEventListener("drop", (e) => {
    backUploadInput.files = e.dataTransfer.files;
    backUploadInput.dispatchEvent(new Event("change"));
  });

  document.getElementById("upload-form").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const onclickAttr = button.getAttribute("onclick");

    if (onclickAttr) {
      // Handle inline onclick functions
      e.stopPropagation();

      if (onclickAttr.includes("front-upload")) {
        frontUploadInput.click();
      } else if (onclickAttr.includes("back-upload")) {
        backUploadInput.click();
      } else if (onclickAttr.includes("removeFrontFile")) {
        frontUploadInput.value = "";
        frontUploadInput.dispatchEvent(new Event("change"));
      } else if (onclickAttr.includes("removeBackFile")) {
        backUploadInput.value = "";
        backUploadInput.dispatchEvent(new Event("change"));
      }
      return;
    }
  });

  // Make drop zones clickable, but ignore if clicking on interactive elements
  frontZone.addEventListener("click", (e) => {
    // Ignore clicks on buttons, inputs, or their children
    if (e.target.closest("button") || e.target.closest("input")) {
      return;
    }
    frontUploadInput.click();
  });

  backZone.addEventListener("click", (e) => {
    // Ignore clicks on buttons, inputs, or their children
    if (e.target.closest("button") || e.target.closest("input")) {
      return;
    }
    backUploadInput.click();
  });
});

// Keep these for backward compatibility with HTML onclick attributes
function removeFrontFile(event) {
  event.stopPropagation();
  const input = document.getElementById("front-upload");
  input.value = "";
  input.dispatchEvent(new Event("change"));
}

function removeBackFile(event) {
  event.stopPropagation();
  const input = document.getElementById("back-upload");
  input.value = "";
  input.dispatchEvent(new Event("change"));
}
