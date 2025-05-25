/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "xemay",
        new_price: "",
        old_price: "",
        detail: "",
        quantity: "" // Thêm trường quantity
    })

    const imageHandler=(e)=>{
        setImage(e.target.files[0]);
    }

    const changeHandler=(e)=>{
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }

    const Add_Product = async() =>{
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});

        if (responseData.success) 
        {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Falsed")
            })
        }
    }

  return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Detail</p>
                <textarea 
                    value={productDetails.detail}
                    onChange={changeHandler}
                    name="detail"
                    placeholder='Type product details here'
                    rows="4"
                    style={{width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "3px", border: "1px solid #b9b9b9"}}
                />
            </div>
            <div className="addproduct-price"> {/* Sử dụng lại class này vì nó đã có sẵn style 2 cột */}
                <div className="addproduct-itemfield">
                    <p>Product Category</p>
                    <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                        <option value="xemay">MotorBike</option>
                        <option value="xedap">Bike</option>
                        <option value="kid">Kid</option>
                    </select>
                </div>
                <div className="addproduct-itemfield">
                    <p>Quantity</p>
                    <input 
                        value={productDetails.quantity}
                        onChange={changeHandler}
                        type="number"
                        name="quantity"
                        placeholder='Enter quantity'
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
            </div>
            <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct