document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
  });

  // Convert functionality
  document.getElementById('convertBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
      alert("Please select a Word file to convert.");
      return;
    }

    // Show loading GIF and disable buttons
    document.getElementById('loadingGif').style.display = "inline-block";
    document.getElementById('convertBtn').textContent = "Converting...";
    document.getElementById('convertBtn').disabled = true;

    const pdfUrl = await convertDocxToPdf(fileInput);

    // Hide loading GIF and reset button state
    document.getElementById('loadingGif').style.display = "none";
    document.getElementById('convertBtn').textContent = "Convert to PDF";
    document.getElementById('convertBtn').disabled = false;

    if (pdfUrl) {
      const downloadBtn = document.getElementById("downloadBtn");
      downloadBtn.style.display = "inline-block";
      downloadBtn.onclick = () => window.open(pdfUrl, '_blank'); // Opens PDF in new tab
    }
  });

  async function convertDocxToPdf(file) {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("StoreFile", "true");

    try {
      const response = await fetch("https://v2.convertapi.com/convert/docx/to/pdf", {
        method: "POST",
        headers: {
          "Authorization": "Bearer secret_1pMEEOfguyODceXt"  // Replace with your actual API key
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to convert file");

      const data = await response.json();

      if (data.Files && data.Files.length > 0) {
        return data.Files[0].Url;
      } else {
        throw new Error("No PDF URL received");
      }
    } catch (error) {
      console.error("Error converting DOCX to PDF:", error);
      alert("There was an error converting your file. Please try again.");
      return null;
    }
  }
});
