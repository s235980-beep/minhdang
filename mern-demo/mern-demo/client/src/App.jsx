import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Loi khi lay danh sach:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(API_URL + '/' + editingId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Loi khi luu sinh vien:', err);
    }
  };

  const handleEditClick = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
    setEditingId(student._id);
  };

  const handleCancelEdit = () => {
    setForm({ studentId: '', name: '', email: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(API_URL + '/' + id, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Quan ly sinh vien - Version 2.0</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          name="name"
          placeholder="Ho ten"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">
          {editingId ? 'Cap nhat' : 'Them sinh vien'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
            Huy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Ho ten</th>
            <th>Email</th>
            <th>Hanh dong</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEditClick(s)} style={{ marginRight: 8 }}>
                  Sua
                </button>
                <button onClick={() => handleDelete(s._id)}>Xoa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;