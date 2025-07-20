import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // ✅ import actual store
import { SocketProvider } from "./providers/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}> 
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
);
