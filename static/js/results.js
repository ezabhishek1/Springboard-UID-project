// Tab switching functionality
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Remove active state from all tabs
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active-tab");
  });

  // Show selected tab content
  const targetContent = document.getElementById("content-" + tabName);
  if (targetContent) {
    targetContent.classList.remove("hidden");
  }

  // Add active state to clicked tab
  const activeTab = document.getElementById("tab-" + tabName);
  if (activeTab) {
    activeTab.classList.add("active-tab");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  // Set overview tab as active by default
  switchTab("overview");
});
