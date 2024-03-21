function getToday() {
  const today = new Date().toLocaleDateString('lt-LT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return today;
}

export default getToday;
