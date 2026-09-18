export const API_KEY = 'fresher-Bro@1660440';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://gastric-stormi-seeutech-acc3c2d6.koyeb.app';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
});

// ==================== NOTIFICATIONS ====================

export const fetchNotifications = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications?limit=${limit}`);
    const result = await response.json();

    if (result.success) {
      return { success: true, data: result.data, count: result.count };
    }
    return { success: false, error: result.error || 'Failed to fetch notifications' };
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
};

export const fetchNotificationCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/count`);
    const result = await response.json();

    if (result.success) {
      return { success: true, count: result.count };
    }
    return { success: false, count: 0 };
  } catch (error) {
    return { success: false, count: 0 };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true };
    }
    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
