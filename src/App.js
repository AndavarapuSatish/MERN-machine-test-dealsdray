import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import Dashboard from "./components/dashboard";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard/>}> </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
