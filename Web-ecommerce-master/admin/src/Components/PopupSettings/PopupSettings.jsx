// admin/src/Components/PopupSettings/PopupSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupSettings.css';

const PopupSettings = () => {
  const [image, setImage]       = useState(null);
  const [effect, setEffect]     = useState('animate__zoomIn');
  const [position, setPosition] = useState('center');
  const [popups, setPopups]     = useState([]);
  const [editId, setEditId]     = useState(null);

  // load tất cả popup
  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/popups');
      setPopups(data);
    } catch (err) {
      console.error(err);
      setPopups([]);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!image) return alert('Chọn ảnh trước!');
    const payload = { imageUrl: image, effect, position };
    try {
      if (editId) {
        await axios.put(`http://localhost:4000/popup/${editId}`, payload);
        alert('✏️ Cập nhật popup thành công!');
      } else {
        await axios.post('http://localhost:4000/popup', payload);
        alert('✅ Đã thêm popup mới!');
      }
      setImage(null);
      setEffect('animate__zoomIn');
      setPosition('center');
      setEditId(null);
      fetchPopups();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi lưu popup');
    }
  };

  const handleEdit = p => {
    setImage(p.imageUrl);
    setEffect(p.effect);
    setPosition(p.position);
    setEditId(p._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    try {
      await axios.delete(`http://localhost:4000/popup/${id}`);
      alert('🗑️ Đã xóa popup');
      fetchPopups();
    } catch (err) {
      console.error(err);
      alert('❌ Xóa thất bại');
    }
  };

  return (
    <div className="popup-settings">
      <h2>{editId ? 'Sửa Popup' : 'Thêm Popup'}</h2>

      <div className="form-group">
        <label>Chọn ảnh:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Preview" className="preview-img" />}
      </div>

      <div className="form-group">
        <label>Hiệu ứng:</label>
        <select value={effect} onChange={e => setEffect(e.target.value)}>
          <option value="animate__zoomIn">Zoom In</option>
          <option value="animate__fadeInDown">Fade In Down</option>
          <option value="animate__bounceIn">Bounce In</option>
          <option value="animate__lightSpeedInLeft">Light Speed Left</option>
        </select>
      </div>

      <div className="form-group">
        <label>Vị trí:</label>
        <select value={position} onChange={e => setPosition(e.target.value)}>
          <option value="left">Trái</option>
          <option value="right">Phải</option>
          <option value="bottom">Dưới</option>
          <option value="center">Giữa</option>
        </select>
      </div>

      <button onClick={handleSave}>
        {editId ? 'Cập nhật' : 'Lưu cài đặt'}
      </button>

      <h3>Danh sách popup</h3>
      <div className="popup-list">
        {popups.map(p => (
          <div key={p._id} className="popup-item">
            <img src={p.imageUrl} alt="" />
            <div>{p.effect} — {p.position}</div>
            <button onClick={() => handleEdit(p)}>✏️ Sửa</button>
            <button onClick={() => handleDelete(p._id)}>🗑️ Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopupSettings;
