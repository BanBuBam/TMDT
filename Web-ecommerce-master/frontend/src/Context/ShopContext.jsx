import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [selectedItems, setSelectedItems] = useState({}); // Add selected items state
    const [cartTotal, setCartTotal] = useState(0);
    const [discount, setDiscount] = useState(0); // Add discount state

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => {
                console.log("Dữ liệu all_product:", data);
                setAll_Product(data);
            })
            .catch((error) => console.error("Lỗi khi tải all_product:", error));

        if (localStorage.getItem("auth-token")) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Dữ liệu cartItems từ server:", data);
                    setCartItems(data);
                })
                .catch((error) => console.error("Lỗi khi tải cartItems:", error));
        }
    }, []);

    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => {
            const newQuantity = (prev[itemId] || 0) + quantity;
            return { ...prev, [itemId]: newQuantity > 0 ? newQuantity : 0 };
        });
        
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "itemId": itemId,
                    "quantity": quantity 
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log("Đã thêm vào giỏ:", data))
                .catch((error) => console.error("Lỗi khi thêm vào giỏ:", error));
        }
    };

    const removeFromCart = (itemId, quantity = 1) => {
        setCartItems((prev) => {
            const newQuantity = prev[itemId] - quantity;
            if (newQuantity <= 0) {
                const newCart = { ...prev };
                delete newCart[itemId];
                return newCart;
            }
            return { ...prev, [itemId]: newQuantity };
        });

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "itemId": itemId,
                    "quantity": quantity 
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log("Đã xóa khỏi giỏ:", data))
                .catch((error) => console.error("Lỗi khi xóa khỏi giỏ:", error));
        }
    };

    // New function to completely remove an item
    const removeItemCompletely = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId]; // Remove the item completely
            return newCart;
        });

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "itemId": itemId,
                    "quantity": prev => prev[itemId] // Send the full quantity to remove
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log("Đã xóa hoàn toàn sản phẩm khỏi giỏ:", data))
                .catch((error) => console.error("Lỗi khi xóa hoàn toàn:", error));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        if (!all_product.length) {
            console.log("Dữ liệu sản phẩm chưa sẵn sàng.");
            return totalAmount;
        }

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemId = Number(item);
                const itemInfo = all_product.find((product) => product.id === itemId);
                
                if (itemInfo) {
                    const price = Number(itemInfo.new_price);
                    console.log(`Item ID: ${itemId}, Price: ${price}, Quantity: ${cartItems[item]}`);
                    totalAmount += price * cartItems[item];
                } else {
                    console.log(`Không tìm thấy sản phẩm với ID: ${itemId}`);
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItem = () => {
        let totalTypes = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalTypes += 1; // Đếm mỗi loại sản phẩm là 1, không quan tâm số lượng
            }
        }
        return totalTypes;
    };

    const getSelectedItemsTotal = () => {
        let totalAmount = 0;
        if (!all_product.length) return totalAmount;

        Object.keys(selectedItems).forEach(itemId => {
            if (selectedItems[itemId] && cartItems[itemId] > 0) {
                const item = all_product.find(product => product.id === Number(itemId));
                if (item) {
                    totalAmount += item.new_price * cartItems[itemId];
                }
            }
        });
        return totalAmount;
    };

    useEffect(() => {
        // Cập nhật cartTotal mỗi khi selectedItems hoặc discount thay đổi
        const total = getSelectedItemsTotal() - discount;
        setCartTotal(total);
    }, [selectedItems, discount]);

    const contextValue = { 
        getTotalCartItem, 
        getTotalCartAmount,
        selectedItems,
        setSelectedItems,
        discount,
        setDiscount,
        cartTotal,
        setCartTotal,
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart,
        removeItemCompletely
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;