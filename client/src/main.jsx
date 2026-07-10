<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { injectStore } from './lib/axios'

injectStore(store)

createRoot(document.getElementById('root')).render(
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
>>>>>>> develop
  <StrictMode>
    <Provider store={store}>
        <App />
        <Toaster position="bottom-right" reverseOrder={false} />
    </Provider>
  </StrictMode>
);
