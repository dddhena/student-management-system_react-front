import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherProfile() {
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Load profile once on mount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/profile', { headers })
      .then(res => {
        const { full_name, email, phone } = res.data;
        setProfile({ full_name, email, phone });
      })
      .catch(err => {
        alert('Failed to load profile');
        console.error('Profile fetch error:', err.response?.data || err.message);
      });
  }, []);

  // ✅ Handle input changes
  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Update profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put('http://127.0.0.1:8000/api/teacher/profile', profile, { headers });
      alert('Profile updated');
      setEditing(false);
      const { full_name, email, phone } = res.data.teacher;
      setProfile({ full_name, email, phone });
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || 'Unknown error'));
      console.error('Profile update error:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      {editing ? (
        <>
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || '—'}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}
