document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("upload-form");
  const frontZone = document.getElementById("front-drop-zone");
  const backZone = document.getElementById("back-drop-zone");
  const frontUploadInput = document.getElementById("front-upload");
  const backUploadInput = document.getElementById("back-upload");
  const analyzeBtn = document.getElementById("analyze-btn");
  const statusEl = document.getElementById("upload-status");

  // Helper to update the drop zone visual state based on selection
  function updateFileDisplay(zoneId, file) {
    const uploadContent = document.getElementById(`${zoneId}-upload-content`);
    const fileInfo = document.getElementById(`${zoneId}-file-info`);
    const fileNameEl = document.getElementById(`${zoneId}-file-name`);
    const fileSizeEl = document.getElementById(`${zoneId}-file-size`);
    const zone = document.getElementById(`${zoneId}-drop-zone`);

    if (file) {
      uploadContent.classList.add("hidden");
      fileInfo.classList.remove("hidden");
      zone.classList.remove("border-slate-700", "bg-slate-900/30");
      zone.classList.add("border-cyan-500", "bg-cyan-500/5", "upload-zone-active");
      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = (file.size / 1024).toFixed(2) + " KB";
    } else {
      uploadContent.classList.remove("hidden");
      fileInfo.classList.add("hidden");
      zone.classList.remove("border-cyan-500", "bg-cyan-500/5", "upload-zone-active");
      zone.classList.add("border-slate-700", "bg-slate-900/30");
    }
  }

  // Only the front side image is required to run diagnostics
  function checkFormValidity() {
    if (frontUploadInput.files.length > 0) {
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove("opacity-30", "pointer-events-none");
    } else {
      analyzeBtn.disabled = true;
      analyzeBtn.classList.add("opacity-30", "pointer-events-none");
    }
  }

  function showStatusMessage(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    if (isError) {
      statusEl.classList.remove("text-cyan-400");
      statusEl.classList.add("text-red-400");
    } else {
      statusEl.classList.remove("text-red-400");
      statusEl.classList.add("text-cyan-400");
    }
  }

  // --- AJAX Diagnostics Transition ---
  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const mainContainer = document.getElementById("main-container");
    if (!mainContainer) return;

    // Transition main page into a holographic scan log
    mainContainer.innerHTML = `
      <div class="max-w-xl mx-auto glass-panel p-8 rounded-2xl relative overflow-hidden animate-fade-in shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        <div class="scan-line"></div>
        
        <div class="text-center mb-8">
          <div class="relative inline-block mb-6">
            <!-- Pulsing outer circle -->
            <div class="absolute -inset-2 rounded-full border border-cyan-500/30 animate-ping opacity-75"></div>
            <!-- Rotating futuristic gear -->
            <div class="h-20 w-20 rounded-full border-2 border-dashed border-cyan-500 flex items-center justify-center animate-spin-slow">
              <svg class="h-10 w-10 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a13.92 13.92 0 00-2.3-7.558M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 2.04l-.054.09A13.916 13.916 0 0015 11a13.92 13.92 0 002.3 7.558M12 11a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-display font-bold text-white tracking-wide">SYSTEM DIAGNOSTICS IN PROGRESS</h2>
          <p class="text-xs text-slate-400 font-mono mt-1">SECURE NEURAL SCAN CORRELATION</p>
        </div>

        <!-- Simulated Cyber Logs console -->
        <div class="bg-slate-950/80 rounded-xl p-5 font-mono text-xs text-cyan-400 border border-slate-800 space-y-2.5 max-h-60 overflow-y-auto mb-6 scrollbar-thin" id="cyber-logs">
          <div class="flex items-center gap-2 text-slate-500">
            <span>[SYS]</span>
            <span class="text-slate-400">Initializing diagnostic session...</span>
          </div>
        </div>

        <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full w-0 transition-all duration-500" id="progress-bar"></div>
        </div>
      </div>
    `;

    const logsContainer = document.getElementById("cyber-logs");
    const progressBar = document.getElementById("progress-bar");

    function writeLog(tag, text, isWarn = false) {
      if (!logsContainer) return;
      const logDiv = document.createElement("div");
      logDiv.className = "flex items-start gap-2 animate-fade-in";
      const colorClass = isWarn ? "text-amber-400" : "text-cyan-400";
      logDiv.innerHTML = `
        <span class="text-slate-500">[${tag}]</span>
        <span class="${colorClass}">${text}</span>
      `;
      logsContainer.appendChild(logDiv);
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Make AJAX request with file upload progress tracking
    const formData = new FormData(uploadForm);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/upload", true);

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        if (progressBar) {
          // Map 0-100% upload to 0-10% of the overall progress bar
          const uploadProgress = Math.round(percentComplete * 0.1);
          progressBar.style.width = `${uploadProgress}%`;
        }
        
        // Update status or log intermittently
        const existingUploadLog = document.getElementById("upload-progress-log");
        if (existingUploadLog) {
          existingUploadLog.querySelector(".log-text").textContent = `Transmitting payload to secure server: ${percentComplete}%`;
        } else {
          const logDiv = document.createElement("div");
          logDiv.id = "upload-progress-log";
          logDiv.className = "flex items-start gap-2 animate-fade-in";
          logDiv.innerHTML = `
            <span class="text-slate-500">[SYS]</span>
            <span class="text-cyan-400 log-text">Transmitting payload to secure server: ${percentComplete}%</span>
          `;
          logsContainer.appendChild(logDiv);
        }
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          const taskId = data.task_id;
          if (!taskId) {
            throw new Error("No task ID returned from server.");
          }
          writeLog("SYS", "Payload secure. Handing off to diagnostics system...");
          pollTaskStatus(taskId);
        } catch (err) {
          handleUploadError(err);
        }
      } else {
        handleUploadError(new Error(`Server returned code ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      handleUploadError(new Error("Network communication failure."));
    };

    function handleUploadError(err) {
      console.error("Upload Error:", err);
      writeLog("CRITICAL", `Process failed: ${err.message}`, true);
      setTimeout(() => {
        alert("Aadhaar analysis failed. Returning to upload.");
        window.location.reload();
      }, 2000);
    }

    xhr.send(formData);

    let lastLogIndex = 0;
    function pollTaskStatus(taskId) {
      const interval = setInterval(() => {
        fetch(`/status/${taskId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Status query failed");
            return res.json();
          })
          .then((data) => {
            // Write any new logs
            if (data.logs && data.logs.length > lastLogIndex) {
              for (let i = lastLogIndex; i < data.logs.length; i++) {
                writeLog("NEURAL", data.logs[i]);
              }
              lastLogIndex = data.logs.length;
            }
            
            // Update progress bar
            if (progressBar && data.progress !== undefined) {
              progressBar.style.width = `${data.progress}%`;
            }
            
            // Handle completed
            if (data.status === "completed") {
              clearInterval(interval);
              writeLog("DONE", "Diagnostics complete. Formulating report...", false);
              if (progressBar) progressBar.style.width = "100%";
              
              setTimeout(() => {
                document.open();
                document.write(data.html);
                document.close();
              }, 400);
            }
            
            // Handle failed
            if (data.status === "failed") {
              clearInterval(interval);
              writeLog("CRITICAL", `Analysis failed: ${data.error}`, true);
              setTimeout(() => {
                alert(`Diagnostics failed: ${data.error}`);
                window.location.reload();
              }, 3000);
            }
          })
          .catch((err) => {
            console.error("Polling error:", err);
          });
      }, 500);
    }
  });

  // --- Event Listeners for File Inputs ---
  frontUploadInput.addEventListener("change", () => {
    if (frontUploadInput.files.length > 0) {
      const file = frontUploadInput.files[0];
      updateFileDisplay("front", file);
      showStatusMessage(`Accepted front image: "${file.name}"`);
    } else {
      updateFileDisplay("front", null);
    }
    checkFormValidity();
  });

  backUploadInput.addEventListener("change", () => {
    if (backUploadInput.files.length > 0) {
      const file = backUploadInput.files[0];
      updateFileDisplay("back", file);
      showStatusMessage(`Accepted back image: "${file.name}"`);
    } else {
      updateFileDisplay("back", null);
    }
    checkFormValidity();
  });

  // --- Drag and Drop Logic ---
  ["dragenter", "dragover", "dragleave", "drop"].forEach((evtName) => {
    [frontZone, backZone].forEach((zone) => {
      zone.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });
  });

  // Hover highlighting
  ["dragenter", "dragover"].forEach((evtName) => {
    frontZone.addEventListener(evtName, () => frontZone.classList.add("upload-zone-active"), false);
    backZone.addEventListener(evtName, () => backZone.classList.add("upload-zone-active"), false);
  });

  ["dragleave", "drop"].forEach((evtName) => {
    frontZone.addEventListener(evtName, () => frontZone.classList.remove("upload-zone-active"), false);
    backZone.addEventListener(evtName, () => backZone.classList.remove("upload-zone-active"), false);
  });

  // Drop files
  frontZone.addEventListener("drop", (e) => {
    frontUploadInput.files = e.dataTransfer.files;
    frontUploadInput.dispatchEvent(new Event("change"));
  });

  backZone.addEventListener("drop", (e) => {
    backUploadInput.files = e.dataTransfer.files;
    backUploadInput.dispatchEvent(new Event("change"));
  });

  // Click handler wrapper
  frontZone.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;
    frontUploadInput.click();
  });

  backZone.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;
    backUploadInput.click();
  });
});

// Backward compatibility helper function calls
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
