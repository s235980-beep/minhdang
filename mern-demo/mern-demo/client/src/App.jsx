
import { useState, useEffect } from 'react';

const API_URL = 'https://mern-backend-minhdang.onrender.com/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`Lỗi tải danh sách: HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('API chưa trả về danh sách sinh viên.');
      }

      setStudents(data);
    } catch (err) {
      setError(err.message || 'Không kết nối được backend.');
      console.error('Lỗi lấy sinh viên:', err);
    } finally {
      setLoading(false);
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
    setError('');

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Không lưu được sinh viên: HTTP ${res.status}`);
      }

      setForm({ studentId: '', name: '', email: '' });
      setEditingId(null);
      await fetchStudents();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu sinh viên.');
      console.error('Lỗi lưu sinh viên:', err);
    }
  };

  const handleEditClick = (student) => {
    setForm({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
    });
    setEditingId(student._id);
  };

  const handleCancelEdit = () => {
    setForm({ studentId: '', name: '', email: '' });
    setEditingId(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      return;
    }

    setError('');

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Không xóa được: HTTP ${res.status}`);
      }

      await fetchStudents();
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa sinh viên.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên - Version 2.0</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
          style={{ marginRight: 8, marginBottom: 8 }}
        />

        <input
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 8, marginBottom: 8 }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: 8, marginBottom: 8 }}
        />

        <button type="submit">
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: 8 }}
          >
            Hủy
          </button>
        )}
      </form>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      <button onClick={fetchStudents} disabled={loading}>
        {loading ? 'Đang tải...' : 'Tải lại danh sách'}
      </button>

      {loading && <p>Đang tải danh sách sinh viên...</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: 16, borderCollapse: 'collapse' }}
      >
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
                <button
                  onClick={() => handleEditClick(s)}
                  style={{ marginRight: 8 }}
                >
                  Sửa
                </button>

                <button onClick={() => handleDelete(s._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {!loading && students.length === 0 && (
            <tr>
              <td colSpan="4">Chưa có sinh viên hoặc chưa tải được dữ liệu.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
