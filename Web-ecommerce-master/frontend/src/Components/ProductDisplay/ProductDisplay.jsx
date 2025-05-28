import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import star_icon from "../Assets/star_icon.png"
import star_dull_icon from "../Assets/star_dull_icon.png"
import { ShopContext } from '../../Context/ShopContext.jsx'

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.quantity) {
            setQuantity(value);
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-mai-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-prices-old">{product.old_price}Đ</div>
                    <div className="productdisplay-right-prices-new">{product.new_price}Đ</div>
                </div>
                <div className="productdisplay-right-description">
               
                </div>
                <div className="productdisplay-right-size">
                    <h1></h1>
                    <div>
                       
                    </div>
                </div>
                <div className="productdisplay-right-quantity">
                    <div className="quantity-selector">
                        <span>Quantity: </span>
                        <input 
                            type="number" 
                            min="1" 
                            max={product.quantity}
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                        <span className="stock-info">
                            ({product.quantity} products available)
                        </span>
                    </div>
                </div>
                <button onClick={() => {addToCart(product.id, quantity)}}>
                    ADD TO CART
                </button>
                <p className='productdisplay-right-category'><span>Category :</span> {product.category}</p>
                <p className='productdisplay-right-category'><span>Tags :</span> Modern, Latest</p>
                <p className='productdisplay-right-description'>
                <span>Description :</span> {product.detail}
                </p>

            </div>
        </div>
    );
  }

export default ProductDisplay