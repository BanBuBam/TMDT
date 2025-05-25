import React, { useState } from 'react'
import'./CSS/Loginsignup.css'
import ReCAPTCHA from "react-google-recaptcha";

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null); // Trạng thái lưu giá trị CAPTCHA

  const validateForm = () => {
    const newErrors = {};

    // Validate fullName - chấp nhận chữ cái, khoảng trắng và dấu tiếng Việt
    if (!/^[A-Za-zÀ-ỹ\s]+$/u.test(formData.fullName)) {
      newErrors.fullName = 'Full name should only contain letters and Vietnamese characters';
    }

    // Validate email - phải có đuôi @gmail.com
    if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid Gmail address';
    }

    // Validate phone - 10 hoặc 11 chữ số
    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 or 11 digits';
    }

    // Validate password - ít nhất 8 ký tự, có chữ hoa và chữ thường
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain both uppercase and lowercase letters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Xóa lỗi khi user bắt đầu gõ
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value); // Lưu giá trị CAPTCHA khi người dùng xác thực
  };

  const login = async()=>{
    if (!captchaValue) {
      alert('Please complete the CAPTCHA verification.');
      return;
    }
    console.log("Login Funtion Executed",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response)=> response.json()).then((data)=>responseData=data)
    
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  const signup = async() => {
    if (!validateForm()) {
      return;
    }
    
    if (!formData.username || !formData.email || !formData.password || !formData.phone || !formData.address || !formData.fullName) {
        alert('Please fill in all required fields');
        return;
    }

    console.log("Sending data:", formData); // Debug log

    try {
        const response = await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData) // Send the complete formData object
        });

        const data = await response.json();
        console.log("Server response:", data); // Debug log

        if (data.success) {
            localStorage.setItem('auth-token', data.token);
            window.location.replace("/");
        } else {
            alert(data.error || "Registration failed");
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Error during signup. Please try again.");
    }
  }

    return (
      <div className='loginsignup'>
        <div className="loginsignup-container">
            <h1>{state}</h1>
            <div className="loginsignup-fields">
                {state==="Sign Up" ? (
                  <>
                    <div className="input-group">
                      <input
                        name='fullName'
                        value={formData.fullName}
                        onChange={changeHandler}
                        type="text"
                        placeholder='Full Name'
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>
                    <div className="input-group">
                      <input
                        name='username'
                        value={formData.username}
                        onChange={changeHandler}
                        type="text"
                        placeholder='Username'
                      />
                    </div>
                    <div className="input-group">
                      <input
                        name='email'
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        placeholder='Email Address'
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                      <input
                        name='phone'
                        value={formData.phone}
                        onChange={changeHandler}
                        type="tel"
                        placeholder='Phone Number'
                        maxLength="11"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    <div className="input-group">
                      <input
                        name='address'
                        value={formData.address}
                        onChange={changeHandler}
                        type="text"
                        placeholder='Address'
                      />
                    </div>
                    <div className="input-group">
                      <input
                        name='password'
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        placeholder='Password'
                      />
                      {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                  </>
                ) : (
                  <>
                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
                    <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
                  </>
                )}
            </div>
            <ReCAPTCHA sitekey="6LfN1QgrAAAAAMRTXz4UEZVl50PSk0DzRaf6qT0Z" onChange={onCaptchaChange}/>
            <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
            {state==="Sign Up"
            ?<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
            :<p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}

            <div className="loginsignup-agree">
                <input type="checkbox" name ='' id='' />
                <p>By continuing, i agree to the items of use & privacy policy.</p>
            </div>
        </div>  
      </div>
    );
  }

export default LoginSignup
