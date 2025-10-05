const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return;
  try {
    await axios.delete(`http://127.0.0.1:8000/api/teachers/${id}`, { headers });
    alert('Deleted successfully');
    fetchTeachers(); // refresh list
  } catch (err) {
    alert('Delete failed');
  }
};
