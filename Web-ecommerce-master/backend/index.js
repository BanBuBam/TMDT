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
const CryptoJS = require("crypto-js");
const moment = require('moment');

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};
// Cho phép CORS cho tất cả các route
app.use(cors(corsOptions));
// Cho phép pre-flight cho tất cả các route
app.options("*", cors(corsOptions));

// Sau đó mới đến body-parser, multer, etc.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json());
// app.use(cors());
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




// APP INFO, STK TEST: 4111 1111 1111 1111
const zalopayconfig = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

// app.use(bodyParser.json());

/**
 * methed: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/create
 * Real	POST	https://openapi.zalopay.vn/v2/create
 * description: tạo đơn hàng, thanh toán
 */
app.post('/zalopay/payment', async (req, res) => {
  const { amount } = req.body;
  const embed_data = {
    //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
    redirecturl: 'http://localhost:3000/',
  };

  const items = [];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: zalopayconfig.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: 'user123',
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url: 'https://d989-42-1-77-72.ngrok-free.app/callback',
    description: `Payment for the order #${transID}`,
    bank_code: '',
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    zalopayconfig.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, zalopayconfig.key1).toString();

  try {
    const result = await axios.post(zalopayconfig.endpoint, null, { params: order });

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */
app.post('/zalopay/callback', (req, res) => {
  let result = {};
  console.log(req.body);
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, zalopayconfig.key2).toString();
    console.log('mac =', mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = 'mac not equal';
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, zalopayconfig.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson['app_trans_id'],
      );

      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (ex) {
    console.log('lỗi:::' + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

/**
 * method: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/query
 * Real	POST	https://openapi.zalopay.vn/v2/query
 * description:
 * Khi user thanh toán thành công,
 * ZaloPay sẽ gọi callback (notify) tới merchant để merchant cập nhật trạng thái
 * đơn hàng Thành Công trên hệ thống. Trong thực tế callback có thể bị miss do lỗi Network timeout,
 * Merchant Service Unavailable/Internal Error...
 * nên Merchant cần hiện thực việc chủ động gọi API truy vấn trạng thái đơn hàng.
 */

app.post('/zalopay/check-status-order', async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: zalopayconfig.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + '|' + postData.app_trans_id + '|' + zalopayconfig.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, zalopayconfig.key1).toString();

  let postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
    /**
     * kết quả mẫu
      {
        "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
        "return_message": "",
        "sub_return_code": 1,
        "sub_return_message": "",
        "is_processing": false,
        "amount": 50000,
        "zp_trans_id": 240331000000175,
        "server_time": 1711857138483,
        "discount_amount": 0
      }
    */
  } catch (error) {
    console.log('lỗi');
    console.log(error);
  }
});

// // schema
// const Banner = mongoose.model('Banner', {
//   imageUrl:  { type: String, required: true },
//   type:      { type: String, required: true },   // 'hero' | 'offer' | 'carousel'
//   createdAt: { type: Date,   default: Date.now }
// });

// // 1) Lấy tất cả banner (có thể query ?type=hero)
// app.get('/banners', async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.type) filter.type = req.query.type;
//     const list = await Banner.find(filter).sort({ createdAt: -1 });
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2) Lấy banner mới nhất của 1 type
// app.get('/banners/:type/latest', async (req, res) => {
//   const { type } = req.params;
//   if (!['hero','offer','carousel'].includes(type)) {
//     return res.status(400).json({ error: 'Invalid banner type' });
//   }
//   try {
//     const b = await Banner.findOne({ type }).sort({ createdAt: -1 });
//     if (!b) return res.status(404).json({ message: 'No banner found' });
//     res.json(b);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3) Thêm banner
// app.post('/banners', async (req, res) => {
//   const { imageUrl, type } = req.body;
//   if (!imageUrl || !type) {
//     return res.status(400).json({ error: 'Thiếu imageUrl hoặc type' });
//   }
//   try {
//     const banner = new Banner({ imageUrl, type });
//     await banner.save();
//     res.status(201).json(banner);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 4) Xóa banner theo ID
// app.delete('/banners/:id', async (req, res) => {
//   try {
//     await Banner.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// thêm field `type` vào schema
const Banner = mongoose.model('Banner', {
  imageUrl: { type: String, required: true },
  type:     { type: String, required: true },    // 'hero' hoặc 'offer'
  createdAt:{ type: Date,   default: Date.now }
});

// Lấy toàn bộ banners
app.get('/banners', async (req, res) => {
  const list = await Banner.find().sort({ createdAt: -1 });
  res.json(list);
});

// mới: trả về mảng tất cả banner, sắp xếp mới nhất trước
app.get('/banners/:type', async (req, res) => {
  try {
    const list = await Banner
      .find({ type: req.params.type })
      .sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Thêm banner
app.post('/banner', async (req, res) => {
  const { imageUrl, type } = req.body;
  if (!imageUrl || !type) return res.status(400).json({ error:'Thiếu imageUrl hoặc type' });
  const banner = new Banner({ imageUrl, type });
  await banner.save();
  res.status(201).json(banner);
});

// Xoá banner theo _id
app.delete('/banner/:id', async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success:true });
});


app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port"+port)
    }
})

