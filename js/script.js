const modal = document.getElementById("resumeModal");
const resumeBtn = document.getElementById("resumeLink");
const closeBtn = document.querySelector(".close-btn");
// Target the iframe inside the modal
const modalIframe = modal.querySelector("iframe");

// Helper function to open modal with specific content
function openModal(e, contentUrl) {
  if (e) e.preventDefault();
  
  // Update the iframe source to the new page
  modalIframe.src = contentUrl;
  
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Function to handle closing the modal and resetting the page
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Re-enables scrolling on the main page
  
  // Optional: Reset iframe so it doesn't keep running in the background
  if (modalIframe) {
    modalIframe.src = "";
  }
}

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}


// RESUME Link: Opens the PDF
resumeBtn.onclick = (e) => {
  if (isMobile()) {
    // Let mobile open PDF normally in a new tab
    e.preventDefault();
    window.open("assets/resume.pdf", "_blank");
  } else {
    openModal(e, "assets/resume.pdf");
  }
};


// Experiences Links: Use a class listener to handle multiple "Read More" buttons
document.querySelectorAll('.read-more').forEach(button => {
  button.onclick = (e) => {
    const projectUrl = button.getAttribute('data-project');
    openModal(e, projectUrl);
  };
});

// Project Links: Use a class listener to handle multiple project buttons
document.querySelectorAll('.project-item a').forEach(button => {
  button.onclick = (e) => {
    const projectUrl = button.getAttribute('data-project');
    openModal(e, projectUrl);
  };
});

// 1. Keep this on your main index.html script.js
modalIframe.addEventListener('load', () => {
    const iframeWindow = modalIframe.contentWindow;
    const iframeDoc = modalIframe.contentDocument || iframeWindow.document;
    
    // Attach listeners to the links inside the iframe
    iframeDoc.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            // If the link is an anchor on the same page (e.g., #projects)
            // we close immediately.
            closeModal();
        });
    });
});

// 2. Add this GLOBALLY so the sub-pages can "shout" to the parent
window.closeModal = closeModal;

// Existing close logic
closeBtn.onclick = closeModal;
window.onclick = (event) => { if (event.target == modal) closeModal(); }

document.addEventListener('keydown', function(event) {
  if (event.key === "Escape" && modal.style.display === "block") {
    closeModal();
  }
});