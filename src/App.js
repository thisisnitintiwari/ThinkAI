import { useEffect, useState, useRef } from "react";
import gptlogo from "./assets/chatgpt.svg";
import abtn from "./assets/add-30.png";
import msgimg from "./assets/message.svg";
import home from "./assets/home.svg";
import saved from "./assets/bookmark.svg";
import rocket from "./assets/rocket.svg";
import send from "./assets/send.svg";
import usericon from "./assets/user-icon.png";
import "./App.css";

function App() {
  const scroll = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([
    {
      text: "Hi I am ThinkAI , Your Intelligent Partner in Every Click.",
      isBot: true,
    },
  ]);

  useEffect(() => {
    scroll.current.scrollIntoView();
  }, [response]);

  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    if (storedChats) {
      setResponse(JSON.parse(storedChats));
    }
  }, []);
  const [userprompt, setuserprompt] = useState("");

  const sendPrompt = async () => {
    setuserprompt(prompt);
    setResponse([...response, { text: prompt, isBot: false }]);
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyDCmeovVpJVtOeNyxvQoihLQsflFUZYdaY",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json(); // it gets the API response

      const responsetext =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";

      const updatedresponse = [
        ...response,
        { text: prompt, isBot: false },
        { text: responsetext, isBot: true },
      ];
      setResponse(updatedresponse);

      //sent response to local storage
      localStorage.setItem("chats", JSON.stringify(updatedresponse));

      setPrompt("");
    } catch (err) {
      console.error("Gemini API failed:", err);
      setResponse("Error contacting Gemini");
    }
  };

  return (
    <div className="App">
      <div class="sidebar">
        <div className="upperside">
          <div className="uppersidetop">
            <img src={gptlogo} alt="" className="logo" />
            <span className="logotext">ThinkAI</span>
          </div>
          <button className="midbtn query">
            <img src={abtn} alt="" className="addbtn" />
            <span
              className="newtext"
              onClick={(e) => (
                setResponse([
                  {
                    text: "Hi I am ThinkAI , Your Intelligent Partner in Every Click.",
                    isBot: true,
                  },
                ]),
                setPrompt(""),
                localStorage.clear()
              )}
            >
              New Chat
            </span>
          </button>
          <button className="query querybtn">
            <img src={msgimg} alt="" className="addbtn" />
            What is Programing ?{" "}
          </button>
          <button className="query querybtn">
            <img src={msgimg} alt="" className="addbtn" />
            How to call API ?{" "}
          </button>
        </div>
        <div className="lowerside">
          <div className="listitem">
            <img src={home} alt="" className="listitemimg" />
            Home
          </div>
          <div className="listitem">
            <img src={saved} alt="" className="listitemimg" />
            saved
          </div>
          <div className="listitem">
            <img src={rocket} alt="" className="listitemimg" />
            Upgrade to Pro
          </div>
        </div>
      </div>
      <div class="main">
        <div className="chats">
          {response.map((res, i) => (
            <div key={i} className={res.isBot ? "chat bot" : "chat"}>
              <img
                src={res.isBot ? gptlogo : usericon}
                alt=""
                className="chatlogo"
              />
              <p className="text">{res.text}</p>
            </div>
          ))}
          <div ref={scroll} />
        </div>

        <div className="chatfooter">
          <input
            type="text"
            className="inp"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log(e.key);
                sendPrompt();
              }
            }}
            placeholder="Ask Anything"
          />
          <button className="send">
            <img src={send} onClick={sendPrompt} alt="" className="sendimg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
