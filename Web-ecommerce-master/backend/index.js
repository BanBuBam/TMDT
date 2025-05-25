const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const crypto = require('crypto');
const axios = require('axios');
const { urlencoded } = require('body-parser');
const config = require('./config');


app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.static('./public'));

// Connect database
mongoose.connect("mongodb+srv://nguyenmanhhung:1008@cluster0.lqjuoon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/")

// API
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})


//Image
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema creating product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:String,
        required:true,
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilabel:{
        type:Boolean,
        default:true,
    },
    detail: {
        type: String,
        required: false, // Thay đổi thành false
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//API delete product
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//API get all product
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

//Schema create user model
const Users = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//Create endpoint register user
app.post('/signup', async(req, res) => {
    try {
        console.log("Received signup data:", req.body);

        // Validate all required fields
        if (!req.body.username || !req.body.email || !req.body.password || 
            !req.body.phone || !req.body.address || !req.body.fullName) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        // Check for existing user
        const existingUser = await Users.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already registered"
            });
        }

        // Initialize cart
        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create new user with all fields
        const newUser = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            fullName: req.body.fullName,
            cartData: cart
        });

        // Save user and log the result
        const savedUser = await newUser.save();
        console.log("Saved user:", savedUser);

        const token = jwt.sign(
            { user: { id: savedUser._id } },
            'secret_ecom'
        );

        res.status(201).json({
            success: true,
            token,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            error: "Registration failed: " + error.message
        });
    }
});

//Create endpoint user login
app.post('/login',async (req,res) =>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,"secret_ecom");
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//Create endpoint collection
app.get('/newcollections', async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//create middelware 
    const fetchUser = async(req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
            
        }
        else{
            try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error){
                res.status(401).send({errors:"Please authenticate using valid token"})
            }
        }
    }

app.post('/addtocart',fetchUser,async(req,res)=>{
    
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    console.log("123");
    console.log(userData);
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})




// // MoMo Payment Integration




app.post('/payment', async (req, res) => {
    let {
      accessKey,
      secretKey,
      orderInfo,
      partnerCode,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      orderGroupId,
      autoCapture,
      lang,
    } = config;
  
    // var amount = '10000';
    const { amount } = req.body;  // Nhận số tiền từ frontend
if (!amount) {
  return res.status(400).json({ message: 'Thiếu số tiền thanh toán!' });
}

    

    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
  
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
  
    //signature
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
  
    // Send the request and handle the response
    let result;
    try {
      result = await axios(options);
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  });
  
  app.post('/callback', async (req, res) => {
    /**
      resultCode = 0: giao dịch thành công.
      resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
      resultCode <> 0: giao dịch thất bại.
     */
    console.log('callback: ');
    console.log(req.body);
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */
  
    return res.status(204).json(req.body);
  });
  
  app.post('/check-status-transaction', async (req, res) => {
    const { orderId } = req.body;
  
    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
  
    const result = await axios(options);
  
    return res.status(200).json(result.data);
  });



app.get('/userinfo', async (req, res) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ success: false, error: "No token provided" });
        }

        const decoded = jwt.verify(token, 'secret_ecom');
        const user = await Users.findById(decoded.user.id)
            .select('-password -cartData -date -__v');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error in /userinfo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error',
            message: error.message 
        });
    }
});

app.post('/updateuser', async (req, res) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ success: false, error: "No token provided" });
        }

        const decoded = jwt.verify(token, 'secret_ecom');
        const updateData = {
            name: req.body.name,
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address
        };

        const user = await Users.findByIdAndUpdate(
            decoded.user.id,
            updateData,
            { new: true }
        ).select('-password -cartData -date -__v');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error in /updateuser:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Update failed',
            message: error.message 
        });
    }
});

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port"+port)
    }
})
// Route: GET /products/related/:category/:id
app.get('/products/related/:category/:id', async (req, res) => {
  const { category, id } = req.params;

  try {
    const relatedProducts = await Product.find({
      category: category,
      _id: { $ne: new mongoose.Types.ObjectId(id) }
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm liên quan' });
  }
});