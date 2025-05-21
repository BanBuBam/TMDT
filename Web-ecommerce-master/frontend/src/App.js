import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.jpg'
import kid_banner from './Components/Assets/banner_kids.jpg'
import CheckOut from './Pages/CheckOut';
import Company from './Components/Company/Company';
import Offices from './Components/Offices/Offices';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import UserProfile from './Components/UserProfile/UserProfile';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/xedap' element={<ShopCategory banner={men_banner} category="xedap"/>}/>
        <Route path='/xemay' element={<ShopCategory banner={women_banner} category="xemay"/>}/>
        <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<CheckOut/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path="/company" element={<Company />} />
        <Route path="/offices" element={<Offices />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
