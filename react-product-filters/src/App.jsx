import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NavMenu from "./components/Nav/nav";
import CreateEvent from './components/CreateEvent/CreateEvent'; 
function App() {
  return (
    <>
      <main>
        <NavMenu />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/create" element={<CreateEvent />} />
        </Routes>
      </main>
    </>
  );
}

export default App;