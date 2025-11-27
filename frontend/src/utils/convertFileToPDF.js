import mammoth from "mammoth";
import html2pdf from "html2pdf.js";

export default async function convertFileToPDF(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  // If already PDF → return it directly
  if (extension === "pdf") return file;

  // Only DOCX can be converted easily
  if (extension === "doc") {
    alert("DOC is old format. Convert to PDF manually or upload DOCX.");
    return null;
  }

  if (extension === "docx") {
    const arrayBuffer = await file.arrayBuffer();

    // Convert DOCX → HTML using Mammoth
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

    // Convert HTML → PDF Blob using html2pdf
    const pdfBlob = await html2pdf()
      .from(htmlResult.value)
      .outputPdf("blob");

    // Create new File object for uploading
    return new File([pdfBlob], file.name.replace(".docx", ".pdf"), {
      type: "application/pdf",
    });
  }

  return null;
}
