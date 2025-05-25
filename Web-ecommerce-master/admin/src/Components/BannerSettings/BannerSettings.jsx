import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BannerSettings.css';

const BannerSettings = () => {
  const [type, setType] = useState('hero');       // 'hero' hoặc 'offer'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [banners, setBanners] = useState([]);

  // 1. Fetch all banners
  const fetchBanners = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/banners');
      setBanners(data);
    } catch (err) {
      console.error('❌ Lỗi khi fetch banners:', err);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. Handle file select
  const onFileChange = e => {
    const f = e.target.files[0];
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  // 3. Save new banner
  const onSave = async () => {
    if (!file) return alert('Chọn ảnh trước!');
    try {
      // gửi Base64 string lên server
      await axios.post('http://localhost:4000/banner', {
        imageUrl: preview,
        type
      });
      alert('✔ Đã thêm banner');
      setFile(null);
      setPreview(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi lưu banner');
    }
  };

  // 4. Delete banner
  const onDelete = async id => {
    if (!window.confirm('Xác nhận xóa?')) return;
    try {
      await axios.delete(`http://localhost:4000/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xóa banner');
    }
  };

  return (
    <div className="banner-settings">
      <h2>Quản lý Banner</h2>

      <div className="form-group">
        <label>Chọn loại:</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="hero">Hero</option>
          <option value="offer">Offer</option>
        </select>
      </div>

      <div className="form-group">
        <label>Chọn ảnh banner:</label>
        <input type="file" accept="image/*" onChange={onFileChange} />
      </div>
      {preview && <img src={preview} className="preview-img" alt="preview" />}

      <button className="btn-save" onClick={onSave}>Lưu banner</button>

      <h3>Danh sách Banner</h3>
      <div className="banner-list">
        {banners.map(b => (
          <div className="banner-item" key={b._id}>
            <img src={b.imageUrl} alt={b.type} />
            <div className="banner-info">
              <span className="type">{b.type}</span>
              <span className="date">{new Date(b.createdAt).toLocaleString()}</span>
            </div>
            <button className="btn-del" onClick={() => onDelete(b._id)}>
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSettings;
