import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// Import styles for text layer and annotation layer
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";

// Setting up the worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Added state for current page
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Trigger the file input dialog
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Update state when a file is selected
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page whenever a new document is loaded
  }

  function goToPrevPage() {
    setPageNumber(pageNumber - 1);
  }

  function goToNextPage() {
    setPageNumber(pageNumber + 1);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    setisLoading(true);
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    // uploading to s3
    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully", response.data);
      alert("File uploaded successfully");
      if(await getExtracts()){
        setisLoading(false);
      }
      
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file");
    }
  };

  const getExtracts = async () => {
    try {
      const response = await fetch("/extract", { method: "GET" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        setBlocks(data);
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const blocksForCurrentPage = blocks.filter(
    (block) => block.page === pageNumber
  );

  return (
    <div>
      {file && (
        <div>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              width={300}
              style={{ border: "10px solid black" }}
            />
            {/* Adjust width as needed */}
          </Document>
          <div>
            <button
              className="btn-create-room"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <button
              className="btn-create-room"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
      <div>
        <input
          type="file"
          style={{ display: "none" }} // Hide the file input
          ref={fileInputRef}
          onChange={onFileChange}
          accept="application/pdf"
        />
        <button className="btn-create-room" onClick={handleButtonClick}>
          Upload PDF
        </button>
        <button className="btn-create-room" onClick={handleFormSubmit}>
          Send Insights to Students
        </button>

        {blocks.length > 0 ? (
          <div className="room-id-display1">
            <ul>
              {blocksForCurrentPage.map((block, index) => (
                <div className="">
                  <li key={index}>{`Page ${block.page}: ${block.text}`}</li>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <div className="">{isLoading==true ?(<div className="spinner"></div>):""}</div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
