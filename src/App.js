import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Body from "./Components/BodyPage";
import Footer from "./Components/Footer";
import Uploads from "./Components/Uploads";
import Reports from "./Components/Reports";
import AuthCallback from "./Components/AuthCallback";
import RoomCreatePage from "./Pages/RoomCreatePage";
import RoomJoinPage from "./Pages/RoomJoinPage";
import UserProfile from "./Components/UserProfile";
import KeyPhrases from "./Components/KeyPhrases";

function App() {
  return (
    <>
      <BrowserRouter>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/keyphrase" element={<KeyPhrases />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/roomcreate" element={<RoomCreatePage />} />
            <Route path="/roomjoin" element={<RoomJoinPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/signup" element={<Body />} />
            {/* Add more routes as needed */}
          </Routes>
          <Footer />
        </>
      </BrowserRouter>
    </>
  );
}
export default App;
