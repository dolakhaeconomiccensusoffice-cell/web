// Utility helper functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ne-NP');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ne-NP');
};

export const generateToken = (prefix, counter) => {
  return `${prefix}${new Date().getFullYear()}${String(counter).padStart(6, '0')}`;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getAttendanceStatus = (checkinTime) => {
  if (!checkinTime) return 'Absent';
  const [hour, minute] = checkinTime.split(':').map(Number);
  const timeInMinutes = hour * 60 + minute;
  if (timeInMinutes <= 10*60 + 30) return 'Present';
  return 'Half Day';
};

export const isCheckoutAllowed = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  return timeInMinutes >= 16*60;
};