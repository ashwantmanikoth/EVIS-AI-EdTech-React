import React from "react";
import { useState } from "react";
import axios from "axios";

function Uploads() {
  const [file, setFile] = useState(null);
  const [blocks, setBlocks] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const getExtracts = async () => {
    console.log("Asdfdsaf");
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully", response.data);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file");
    }
  };

  // import React, { useState } from 'react';
  // import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
  // const [pdfDoc, setPdfDoc] = useState(null);
  // const [pageNum, setPageNum] = useState(1);
  // const [scale, setScale] = useState(1);
  // const canvasRef = useRef();

  // useEffect(() => {
  //   if (pdfDoc) {
  //     renderPage(pageNum, scale);
  //   }
  // }, [pdfDoc, pageNum, scale]);

  // const renderPage = (num, scale) => {
  //   pdfDoc.getPage(num).then((page) => {
  //     const viewport = page.getViewport({ scale });
  //     const canvas = canvasRef.current;
  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;

  //     const renderContext = {
  //       canvasContext: canvas.getContext("2d"),
  //       viewport,
  //     };

  //     page.render(renderContext);
  //   });
  // };

  // const onFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     const fileReader = new FileReader();
  //     fileReader.onload = function () {
  //       const typedarray = new Uint8Array(this.result);
  //       pdfjsLib.getDocument({ data: typedarray }).promise.then((pdfDoc_) => {
  //         setPdfDoc(pdfDoc_);
  //         setPageNum(1); // Reset to first page
  //       });
  //     };
  //     fileReader.readAsArrayBuffer(file);
  //   } else {
  //     alert("Please select a PDF file.");
  //   }
  // };

  return (
   
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <button onClick={getExtracts}>Get Extracted</button>

      <h2>Extracted Text Blocks</h2>

      {blocks.length > 0 ? (
        <ul>
          {blocks.map((block, index) => (
            <li key={index}>{`Page ${block.page}: ${block.text}`}</li>
          ))}
        </ul>
      ) : (
        <h2>No extration</h2>
      )}
    </div>

    //new changes
    // <div>
    //   <input type="file" onChange={onFileChange} accept="application/pdf" />
    //   <canvas ref={canvasRef}></canvas>
    //   <div>
    //     <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum <= 1}>
    //       Prev
    //     </button>
    //     <button
    //       onClick={() => setPageNum(pageNum + 1)}
    //       disabled={pdfDoc ? pageNum >= pdfDoc.numPages : true}
    //     >
    //       Next
    //     </button>
    //     <button onClick={() => setScale(scale * 1.1)}>Zoom In</button>
    //     <button onClick={() => setScale(scale / 1.1)}>Zoom Out</button>
    //     <span>
    //       Page {pageNum} of {pdfDoc ? pdfDoc.numPages : 1}
    //     </span>
    //   </div>
    // </div>
  );
}

export default Uploads;
