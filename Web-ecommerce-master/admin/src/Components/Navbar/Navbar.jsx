/* eslint-disable no-unused-vars */
import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo22.png'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="nav-brand">
                <img src={navlogo} alt="" className="nav-logo" />
                <span className="brand-name">Ride On</span>
            </div>
            <img src={navProfile} className='nav-profile' alt="" />
        </div>
    )
}

export default Navbar