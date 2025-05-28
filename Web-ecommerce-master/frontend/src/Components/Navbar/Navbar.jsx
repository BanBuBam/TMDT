import React, { useContext,useRef, useState } from 'react'
import './Navbar.css'

import logo from '../Assets/logo22.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'
import user_icon from '../Assets/user-icon.jpg'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Navbar = () => {

    const [menu,setMenu] = useState("shop");
    const {getTotalCartItem} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle =(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.nav-user-dropdown') && !event.target.closest('.nav-icon')) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace('/');
    };

    return(
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>RideOn</p>
            </div>
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("xedap")}}><Link style={{ textDecoration: 'none' }} to='/xedap'>Bike</Link>{menu==="xedap"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("xemay")}}><Link style={{ textDecoration: 'none' }} to='/xemay'>MotorBike</Link>{menu==="xemay"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ? <>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={user_icon}
                            alt="profile"
                            className="nav-icon"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowUserDropdown((prev) => !prev)}
                        />
                        {showUserDropdown && (
                            <div className="nav-user-dropdown" style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                minWidth: '140px',
                                zIndex: 1000
                            }}>
                                <Link to="/profile" className="dropdown-item" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#222' }} onClick={()=>setShowUserDropdown(false)}>Profile</Link>
                                <Link to="/orders" className="dropdown-item" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#222' }} onClick={()=>setShowUserDropdown(false)}>Orders</Link>
                                <button className="dropdown-item" style={{ display: 'block', padding: '10px', width: '100%', border: 'none', background: 'none', textAlign: 'left', color: '#222', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                  </>
                :<Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItem()}</div>
            </div>
        </div>
    )
}

export default Navbar