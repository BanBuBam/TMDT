/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import edit_icon from '../../assets/edit_icon.jpg' // Thêm icon edit

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        detail: '',
        image: '',
        quantity: '' // Thêm quantity
    });

    // Fetch products
    const fetchInfo = async () => {
        const res = await fetch('http://localhost:4000/allproducts');
        const data = await res.json();
        setAllProducts(data);
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    // Delete product
    const remove_product = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    }

    // Start editing product
    const startEdit = (product) => {
        setEditingProduct(product);
        setEditFormData({
            name: product.name,
            category: product.category,
            new_price: product.new_price,
            old_price: product.old_price,
            detail: product.detail || '',
            image: product.image,
            quantity: product.quantity || '' // Thêm quantity
        });
    }

    // Handle form input changes
    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    }

    // Submit edit form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/updateproduct/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            const data = await response.json();
            if (data.success) {
                setEditingProduct(null);
                fetchInfo();
            } else {
                alert('Error updating product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating product');
        }
    }

    return (
        <div className='list-product'>
            <h1>All Product List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Quantity</p> {/* Thêm cột Quantity */}
                <p>Detail</p>
                <p>Actions</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product, index) => (
                    editingProduct && editingProduct.id === product.id ? (
                        <div key={index} className="listproduct-format-main listproduct-edit-form">
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label>Tên sản phẩm:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Giá cũ:</label>
                                    <input
                                        type="number"
                                        name="old_price"
                                        value={editFormData.old_price}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Giá mới:</label>
                                    <input
                                        type="number"
                                        name="new_price"
                                        value={editFormData.new_price}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Danh mục:</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số lượng:</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editFormData.quantity}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Chi tiết:</label>
                                    <textarea
                                        name="detail"
                                        value={editFormData.detail}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="edit-actions">
                                    <button type="submit">Lưu</button>
                                    <button type="button" onClick={() => setEditingProduct(null)}>Hủy</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div key={index} className="listproduct-format-main listproduct-format">
                            <img src={product.image} alt="" className="listproduct-product-icon" />
                            <p>{product.name}</p>
                            <p>{product.old_price}Đ</p>
                            <p>{product.new_price}Đ</p>
                            <p>{product.category}</p>
                            <p>{product.quantity || 0}</p> {/* Hiển thị quantity */}
                            <p>{product.detail}</p>
                            <div className="action-buttons">
                                <img 
                                    onClick={() => startEdit(product)} 
                                    className='listproduct-edit-icon'  // Sử dụng class mới
                                    src={edit_icon} 
                                    alt="edit" 
                                />
                                <img 
                                    onClick={() => remove_product(product.id)} 
                                    className='listproduct-remove-icon' 
                                    src={cross_icon} 
                                    alt="remove" 
                                />
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default ListProduct