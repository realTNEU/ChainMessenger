import Home from "./pages/home/home";
import About from "./pages/about/About"
import Contact from "./pages/contact/Contact"
import Chatting from "./pages/chatting/chatting.jsx"
import Legal from "./pages/legal/Legal"
import CustomCursor from "./CustomCursor";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom"
const App = () => {
  return (
    <>
            {/* <CustomCursor></CustomCursor> */}
      <BrowserRouter>
        <Routes>
          <Route  path = "/" element = {<Home/>}/>
          <Route  path = "/Legal" element = {<Legal/>}/>
          <Route  path = "/About" element = {<About/>}/>
          <Route  path = "/Contact" element = {<Contact/>}/>
          <Route  path = "/Chatting" element = {<Chatting/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
