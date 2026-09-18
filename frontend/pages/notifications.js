import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchNotifications, deleteNotification, fetchNotificationCount } from '../lib/api';

const READ_KEY = 'fresherbro_web_read_notifications';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load read IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(READ_KEY);
      if (saved) setReadIds(JSON.parse(saved));
    } catch {}
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await fetchNotifications(50);
    if (result.success) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const saveReadIds = (ids) => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(ids));
    } catch {}
  };

  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    saveReadIds(updated);
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n._id);
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const handleDismiss = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Dismiss this notification?')) return;

    const result = await deleteNotification(id);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    }
  };

  const handleTap = (notification) => {
    markAsRead(notification._id);
    const screen = notification.data?.screen;
    if (screen === 'Home') router.push('/');
    else if (screen === 'Resources') router.push('/resources');
    else if (screen === 'Referrals') router.push('/referrals');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'job':
        return { bg: '#eef2ff', color: '#4f6ef7', label: 'Job' };
      case 'walkin':
        return { bg: '#fffbeb', color: '#d97706', label: 'Walk-in' };
      case 'referral':
        return { bg: '#ecfdf5', color: '#059669', label: 'Referral' };
      case 'resource':
        return { bg: '#f5f3ff', color: '#8b5cf6', label: 'Resource' };
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: 'System' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job':
        return '💼';
      case 'walkin':
        return '🚶';
      case 'referral':
        return '👥';
      case 'resource':
        return '📚';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !readIds.includes(n._id);
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !readIds.includes(n._id)).length;

  return (
    <div className="notif-page">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <Link href="/" className="back-btn">
            ←
          </Link>
          <div>
            <h1 className="notif-title">Notifications</h1>
            {unreadCount > 0 && (
              <p className="notif-subtitle">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <div className="notif-header-right">
          <button
            className="refresh-btn"
            onClick={() => {
              setRefreshing(true);
              loadNotifications().finally(() => setRefreshing(false));
            }}
            disabled={refreshing}
          >
            {refreshing ? '...' : 'Refresh'}
          </button>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="notif-filters">
        {[
          { value: 'all', label: 'All' },
          { value: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          { value: 'job', label: 'Jobs' },
          { value: 'walkin', label: 'Walk-ins' },
          { value: 'referral', label: 'Referrals' },
          { value: 'resource', label: 'Resources' },
        ].map((f) => (
          <button
            key={f.value}
            className={`filter-pill ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="notif-loading">
          <div className="spinner"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="notif-empty">
          <div className="empty-icon">🔔</div>
          <h2>No notifications yet</h2>
          <p>You'll see job alerts, walk-ins, and referrals here</p>
        </div>
      ) : (
        <div className="notif-list">
          {filteredNotifications.map((item) => {
            const style = getTypeStyle(item.type);
            const isUnread = !readIds.includes(item._id);

            return (
              <div
                key={item._id}
                className={`notif-card ${isUnread ? 'unread' : ''}`}
                onClick={() => handleTap(item)}
                style={{ borderLeftColor: style.color }}
              >
                <div className="notif-icon" style={{ background: style.bg, color: style.color }}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <h3 className="notif-card-title">{item.title}</h3>
                    {isUnread && (
                      <span className="unread-dot" style={{ background: style.color }}></span>
                    )}
                  </div>
                  <p className="notif-card-body">{item.body}</p>
                  <div className="notif-meta">
                    <span>{formatTime(item.createdAt)}</span>
                    {item.data?.company && (
                      <>
                        <span className="divider">•</span>
                        <span>{item.data.company}</span>
                      </>
                    )}
                    <span className="type-tag" style={{ background: style.bg, color: style.color }}>
                      {style.label}
                    </span>
                  </div>
                </div>
                <button
                  className="dismiss-btn"
                  onClick={(e) => handleDismiss(e, item._id)}
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .notif-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 20px 60px;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .notif-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: white;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #111827;
          text-decoration: none;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .notif-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          letter-spacing: -0.4px;
        }

        .notif-subtitle {
          font-size: 13px;
          color: #4f6ef7;
          font-weight: 600;
          margin: 2px 0 0;
        }

        .notif-header-right {
          display: flex;
          gap: 8px;
        }

        .refresh-btn,
        .mark-all-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover,
        .mark-all-btn:hover {
          background: #f9fafb;
          border-color: #4f6ef7;
          color: #4f6ef7;
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notif-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .filter-pill {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #6b7280;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-pill:hover {
          border-color: #4f6ef7;
          color: #4f6ef7;
        }

        .filter-pill.active {
          background: #4f6ef7;
          color: white;
          border-color: #4f6ef7;
        }

        .notif-loading {
          display: flex;
          justify-content: center;
          padding: 60px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #4f6ef7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .notif-empty {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .notif-empty h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .notif-empty p {
          color: #6b7280;
          font-size: 14px;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notif-card {
          display: flex;
          gap: 14px;
          padding: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-left-width: 4px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .notif-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .notif-card.unread {
          background: #fafbff;
        }

        .notif-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-title-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 4px;
        }

        .notif-card-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .notif-card:not(.unread) .notif-card-title {
          font-weight: 600;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .notif-card-body {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 8px;
          white-space: pre-line;
        }

        .notif-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #9ca3af;
          font-weight: 500;
          flex-wrap: wrap;
        }

        .notif-meta .divider {
          opacity: 0.5;
        }

        .type-tag {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-left: auto;
        }

        .dismiss-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .notif-card:hover .dismiss-btn {
          opacity: 1;
        }

        .dismiss-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        @media (max-width: 640px) {
          .notif-page {
            padding: 16px 12px 40px;
          }
          .notif-title {
            font-size: 20px;
          }
          .notif-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .type-tag {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
