function confirmDelete(e) {
  if (!confirm('Are you sure you want to delete this item?')) {
    e.preventDefault();
    return false;
  }
  return true;
}
