/* eslint-disable no-unused-vars */
import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import BannerSettings from '../../Components/BannerSettings/BannerSettings'
import PopupSettings from '../../Components/PopupSettings/PopupSettings'
import UserList from '../../Components/UserList/UserList'
import AdminOrder from '../../Components/AdminOrder/AdminOrder'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/listproduct' element={<ListProduct/>} />
        <Route path='banner' element={<BannerSettings/>} />
        <Route path='/popup' element={<PopupSettings/>} />
        <Route path='/users' element={<UserList/>} />
        <Route path='/orders/all' element={<AdminOrder/>} />
      </Routes>
    </div>
  )
}

export default Admin