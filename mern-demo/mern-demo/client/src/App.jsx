import { useState, useEffect } from 'react';

// ⚠️ Thay bằng URL public port 5000 của bạn (copy từ tab "Cổng")
const API_URL = 'https://<tên-codespace>-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // Câu 47: Lấy danh sách sinh viên từ API
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Câu 49: Gửi dữ liệu POST thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên</h1>

      {/* Câu 48: Form nhập MSSV, Họ tên, Email */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
        />{' '}
        <input
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />{' '}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />{' '}
        <button type="submit">Thêm sinh viên</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleDelete(s._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;