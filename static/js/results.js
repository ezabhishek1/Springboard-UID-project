// Tab switching functionality
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Remove active state from all tabs
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active-tab", "bg-slate-100");
    button.classList.add("hover:bg-slate-50");
  });

  // Show selected tab content
  document.getElementById("content-" + tabName).classList.remove("hidden");

  // Add active state to clicked tab
  const activeTab = document.getElementById("tab-" + tabName);
  activeTab.classList.add("active-tab", "bg-slate-100");
  activeTab.classList.remove("hover:bg-slate-50");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  // Set overview tab as active by default
  switchTab("overview");
});
