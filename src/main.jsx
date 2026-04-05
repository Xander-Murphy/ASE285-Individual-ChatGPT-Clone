import React from "react";
import { createRoot } from "react-dom/client";
import ChatScreen from "./lib/screens/ChatScreen";
import "/styles.css";

createRoot(document.getElementById("root")).render(<ChatScreen />);