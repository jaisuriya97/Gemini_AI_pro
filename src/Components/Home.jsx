import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Textarea } from "@nextui-org/react";
import Markdown from "react-markdown";
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);

const generateContent = async (input) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(input);
  const response = await result.response;
  const text = await response.text();
  return text;
};

const Home = () => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateContent("Hi, Who are you").then((result) => setText(result));
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const result = await generateContent(input);
      setText(result);
    } catch (error) {
      setText("");
      setText("Something Went Wrong ☹️");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5 mb-4">
        <div className="col-md-8">
          <div className="bg-dark p-4 rounded">
            <div className="d-flex justify-content-end">
              {loading ? null : (
                <button className="btn btn-sm btn-light me-2" onClick={copyText}>
                  Copy
                </button>
              )}
            </div>
            <Markdown>{loading ? "Loading..." : text}</Markdown>
            
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Textarea
            type="text"
            className="form-control"
            id="search"
            placeholder="Enter your query"
            value={input}
            onChange={handleInputChange}
          />
          <button
            className={`btn btn-primary mt-3 ${loading && "disabled"}`}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

