import './App.css';
import Header from './Header';
import BuySellStock from './BuySellStock';
import Home from './Home';
import AddStock from './AddStock';
import NoPage from './NoPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";


{/* 
    <Header> 
    <BuySellStock>

    </BuySellStock>
    </Header> */}
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="buysellstock" element={<BuySellStock />} />
          <Route path="addstock" element={<AddStock />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
