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
  );
}

export default Uploads;
