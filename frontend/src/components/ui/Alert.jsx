import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Clock,
  Eye,
  Trash2,
  Check,
  CheckCheck,
  Search,
  Filter,
  X,
  Info,
  AlertCircle,
  Lock,
  Key,
  Globe,
  Calendar,
  ChevronDown,
  Bell,
  Activity,
  Zap
} from 'lucide-react';
import { setAlertCount } from '../../store/alertSlice';
import { useDispatch } from 'react-redux';

const sampleAlerts = [
  {
    id: 1,
    type: 'security',
    title: 'Weak Password Detected',
    message: 'Your password for github.com contains common patterns and should be strengthened immediately to prevent unauthorized access.',
    site: 'github.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    severity: 'high',
    isRead: false,
    action: 'password_update',
    category: 'Security'
  },
  {
    id: 2,
    type: 'breach',
    title: 'Data Breach Alert',
    message: 'LinkedIn reported a security incident affecting user credentials. We recommend changing your password immediately as a precautionary measure.',
    site: 'linkedin.com',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    severity: 'critical',
    isRead: false,
    action: 'immediate_action',
    category: 'Breach'
  },
  {
    id: 3,
    type: 'activity',
    title: 'Suspicious Login Activity',
    message: 'New login detected from an unrecognized location: New York, USA. If this wasn\'t you, please secure your account immediately.',
    site: 'gmail.com',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    severity: 'medium',
    isRead: true,
    action: 'review_activity',
    category: 'Activity'
  },
  {
    id: 4,
    type: 'expiry',
    title: 'Password Expiry Warning',
    message: 'Your corporate password will expire in 7 days. Update it now to maintain uninterrupted access to company resources.',
    site: 'company-portal.com',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    severity: 'medium',
    isRead: false,
    action: 'password_renewal',
    category: 'System'
  },
  {
    id: 5,
    type: 'duplicate',
    title: 'Password Reuse Detected',
    message: 'You\'re using identical passwords across multiple accounts. This significantly increases your security risk if one account is compromised.',
    site: 'multiple accounts',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    severity: 'low',
    isRead: true,
    action: 'password_diversify',
    category: 'Security'
  },
  {
    id: 6,
    type: 'security',
    title: 'Two-Factor Authentication Recommended',
    message: 'Enable 2FA for your Twitter account to add an extra layer of security and protect against unauthorized access attempts.',
    site: 'twitter.com',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    severity: 'low',
    isRead: false,
    action: 'enable_2fa',
    category: 'Security'
  }
];

export default function Alerts({ isDark = true, user }) {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const dispatch = useDispatch();

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: isDark ? 'border-red-400/70 bg-gradient-to-r from-red-500/25 to-red-600/15' : 'border-red-300 bg-gradient-to-r from-red-50 to-red-100/60',
          textColor: isDark ? 'text-red-300' : 'text-red-700',
          badgeColor: isDark ? 'bg-red-500/25 text-red-300 border-red-400/40' : 'bg-red-100 text-red-700 border-red-200',
          icon: AlertTriangle
        };
      case 'high':
        return {
          color: isDark ? 'border-orange-400/70 bg-gradient-to-r from-orange-500/25 to-orange-600/15' : 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100/60',
          textColor: isDark ? 'text-orange-300' : 'text-orange-700',
          badgeColor: isDark ? 'bg-orange-500/25 text-orange-300 border-orange-400/40' : 'bg-orange-100 text-orange-700 border-orange-200',
          icon: Zap
        };
      case 'medium':
        return {
          color: isDark ? 'border-yellow-400/70 bg-gradient-to-r from-yellow-500/25 to-yellow-600/15' : 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100/60',
          textColor: isDark ? 'text-yellow-300' : 'text-yellow-700',
          badgeColor: isDark ? 'bg-yellow-500/25 text-yellow-300 border-yellow-400/40' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Info
        };
      case 'low':
        return {
          color: isDark ? 'border-cyan-400/70 bg-gradient-to-r from-cyan-500/25 to-cyan-600/15' : 'border-cyan-300 bg-gradient-to-r from-cyan-50 to-cyan-100/60',
          textColor: isDark ? 'text-cyan-300' : 'text-cyan-700',
          badgeColor: isDark ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40' : 'bg-cyan-100 text-cyan-700 border-cyan-200',
          icon: Info
        };
      default:
        return {
          color: isDark ? 'border-gray-400/70 bg-gradient-to-r from-gray-500/25 to-gray-600/15' : 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100/60',
          textColor: isDark ? 'text-gray-300' : 'text-gray-700',
          badgeColor: isDark ? 'bg-gray-500/25 text-gray-300 border-gray-400/40' : 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Info
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'security': return Shield;
      case 'breach': return AlertTriangle;
      case 'activity': return Activity;
      case 'expiry': return Clock;
      case 'duplicate': return Key;
      default: return Bell;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Now';
  };

  const getFavicon = (site) => {
    if (site === 'multiple accounts') return null;
    const domain = site.replace(/(https?:\/\/)?(www\.)?/, '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  const handleSelectAlert = (id) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(alertId => alertId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredAlerts.map(alert => alert.id);
    setSelectedAlerts(prev => prev.length === filteredIds.length ? [] : filteredIds);
  };

  const handleMarkAsRead = (ids) => {
    dispatch(setAlertCount(-ids.length));
    setAlerts(prev => prev.map(alert => 
      ids.includes(alert.id) ? { ...alert, isRead: true } : alert
    ));
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = alerts.filter(alert => !alert.isRead).map(alert => alert.id);
    if (unreadIds.length === 0) {
      return;
    }
    handleMarkAsRead(unreadIds);
  };

  const handleDeleteAlerts = (idsToDelete) => {
    if (idsToDelete.length === 0) return;

    setAlerts(prev => prev.filter(alert => !idsToDelete.includes(alert.id)));

    const unreadDeletedCount = alerts.reduce(
      (acc, alert) => acc + (idsToDelete.includes(alert.id) && !alert.isRead ? 1 : 0),
      0
    );
    dispatch(setAlertCount(-unreadDeletedCount));

    setSelectedAlerts(prev => prev.filter(id => !idsToDelete.includes(id)));
  };

  const handleDeleteSelected = () => {
    if (selectedAlerts.length === 0) return;
    handleDeleteAlerts(selectedAlerts);
  };

  const handleDeleteAll = () => {
    const allIds = alerts.map(alert => alert.id);
    handleDeleteAlerts(allIds);
  };

  const handleDeleteSingle = (id) => {
    handleDeleteAlerts([id]);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(search.toLowerCase()) ||
                         alert.message.toLowerCase().includes(search.toLowerCase()) ||
                         alert.site.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'read' && alert.isRead) ||
                       (filterType === 'unread' && !alert.isRead);
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="flex justify-center items-start h-full pt-8 pb-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Alert Container */}
        <div className={`rounded-3xl border-2 shadow-2xl p-8 h-[80vh] flex flex-col transition-all duration-500 ${
          isDark 
            ? 'bg-black/40 backdrop-blur-3xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)]'
            : 'bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-gray-900/15'
        }`}>

          {/* Enhanced Controls */}
          <div className="flex flex-col gap-6 mb-8 flex-shrink-0">
            {/* Search and Primary Actions */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                  isDark ? 'text-teal-400 group-hover:text-teal-300 group-hover:scale-110' : 'text-teal-500 group-hover:text-teal-600 group-hover:scale-110'
                }`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alerts, sites, or messages..."
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    isDark
                      ? 'bg-black/30 backdrop-blur-xl border-white/20 text-white placeholder-gray-400 focus:border-cyan-400/60 focus:bg-black/40 hover:border-white/30'
                      : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:bg-white/90 hover:border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:scale-[1.01] shadow-lg hover:shadow-xl`}
                />
              </div>

              <div className="flex gap-3">
                <div className="relative group">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`appearance-none px-6 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isDark
                        ? 'bg-black/30 backdrop-blur-xl border-white/20 text-white focus:border-cyan-400/60 hover:bg-black/40'
                        : 'bg-white/80 border-gray-200 text-gray-900 focus:border-teal-500 hover:bg-white/90'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread ({unreadCount})</option>
                    <option value="read">Read</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
                    isDark ? 'text-teal-400' : 'text-teal-500'
                  }`} />
                </div>

                <div className="relative group">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className={`appearance-none px-6 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isDark
                        ? 'bg-black/30 backdrop-blur-xl border-white/20 text-white focus:border-cyan-400/60 hover:bg-black/40'
                        : 'bg-white/80 border-gray-200 text-gray-900 focus:border-teal-500 hover:bg-white/90'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    <option value="all">All Priority</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
                    isDark ? 'text-teal-400' : 'text-teal-500'
                  }`} />
                </div>
              </div>
            </div>

            {/* Enhanced Bulk Actions */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={handleSelectAll}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                    isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/30 hover:bg-cyan-500/30 backdrop-blur-xl hover:border-cyan-400/50'
                      : 'bg-cyan-100 text-cyan-700 border-2 border-cyan-200 hover:bg-cyan-200 hover:border-cyan-300'
                  }`}
                >
                  {selectedAlerts.length === filteredAlerts.length ? 'Deselect All' : 'Select All'}
                </button>

                {selectedAlerts.length > 0 && (
                  <>
                    <button
                      onClick={() => handleMarkAsRead(selectedAlerts)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${
                        isDark
                          ? 'bg-green-500/20 text-green-300 border-2 border-green-400/30 hover:bg-green-500/30 backdrop-blur-xl hover:border-green-400/50'
                          : 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200 hover:border-green-300'
                      }`}
                    >
                      <Check className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                      Mark Read ({selectedAlerts.length})
                    </button>

                    <button
                      onClick={handleDeleteSelected}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${
                        isDark
                          ? 'bg-red-500/20 text-red-300 border-2 border-red-400/30 hover:bg-red-500/30 backdrop-blur-xl hover:border-red-400/50'
                          : 'bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200 hover:border-red-300'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                      Delete ({selectedAlerts.length})
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleMarkAllAsRead}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border-2 border-teal-400/30 hover:from-teal-500/30 hover:to-cyan-500/30 backdrop-blur-xl hover:border-teal-400/50'
                      : 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-2 border-teal-200 hover:from-teal-200 hover:to-cyan-200 hover:border-teal-300'
                  }`}
                >
                  <CheckCheck className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                  Mark All Read
                </button>

                <button
                  onClick={handleDeleteAll}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-2 border-red-400/30 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-xl hover:border-red-400/50'
                      : 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-2 border-red-200 hover:from-red-200 hover:to-red-300 hover:border-red-300'
                  }`}
                >
                  <Trash2 className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Alert Entries - Enhanced */}
          <div className="flex-1 overflow-y-auto pr-2 pl-2 custom-scrollbar">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div
  className={`text-center py-20 px-6 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.015] shadow-md ${
    isDark
      ? 'bg-black/25 border-white/15 text-gray-400 hover:bg-black/30 backdrop-blur-xl'
      : 'bg-white/60 border-gray-200/60 text-gray-500 hover:bg-white/70 backdrop-blur-xl'
  }`}
>
  <div
    className={`w-24 h-24 mx-auto mb-6 rounded-3xl p-5 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
      isDark
        ? 'bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-300/30 shadow-rose-500/20 shadow-xl'
        : 'bg-gradient-to-br from-pink-500 to-rose-500 border border-white/30 shadow-lg'
    }`}
  >
    <AlertCircle className={`w-12 h-12 animate-pulse ${isDark ? 'text-pink-300' : 'text-white'}`} />
  </div>
  <p className="text-2xl font-semibold tracking-wide mb-2">No alerts found</p>
  <p className="text-base text-opacity-90">
    Your security alerts will appear here
  </p>
</div>


              ) : (
                filteredAlerts.map((alert, index) => {
                  const IconComponent = getTypeIcon(alert.type);
                  const isSelected = selectedAlerts.includes(alert.id);
                  const severityConfig = getSeverityConfig(alert.severity);
                  
                  return (
                    <div
                      key={alert.id}
                      className={`group rounded-3xl p-4 border-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.005] transition-all duration-300 ${
                        isDark 
                          ? `bg-black/50 backdrop-blur-3xl border-white/15 hover:border-cyan-400/50 hover:bg-black/60 ${!alert.isRead ? 'ring-2 ring-cyan-400/40 shadow-cyan-400/25' : ''}`
                          : `bg-white/70 backdrop-blur-xl border-gray-200/60 hover:border-teal-400/70 hover:bg-white/85 ${!alert.isRead ? 'ring-2 ring-teal-400/40 shadow-teal-400/25' : ''}`
                      } ${isSelected ? (isDark ? 'ring-2 ring-blue-400/70 bg-blue-500/15 border-blue-400/60' : 'ring-2 ring-blue-500/70 bg-blue-50 border-blue-400/60') : ''}`}
                      style={{
                        animationDelay: `${index * 80}ms`,
                        animation: 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex items-start gap-6">
                        {/* Enhanced Checkbox */}
                        <div className="flex items-center pt-2">
                          <label className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectAlert(alert.id)}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 border-teal-400 scale-110 shadow-lg'
                                : isDark 
                                  ? 'border-white/40 hover:border-teal-400/60 hover:scale-105' 
                                  : 'border-gray-300 hover:border-teal-500 hover:scale-105'
                            }`}>
                              {isSelected && (
                                <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5 animate-bounce" />
                              )}
                            </div>
                          </label>
                        </div>

                        {/* Enhanced Severity Indicator */}
                        <div className={`w-14 h-14 rounded-2xl p-3 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-105 ${
                          severityConfig.color
                        }`}>
                          <IconComponent className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${severityConfig.textColor}`} />
                        </div>

                        {/* Enhanced Site Icon */}
                        <div className={`w-14 h-14 rounded-2xl p-3 flex items-center justify-center shadow-xl flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
                          isDark 
                            ? 'bg-gradient-to-br from-slate-800/80 to-gray-900/60 backdrop-blur-xl border-2 border-cyan-400/30 group-hover:border-cyan-400/50'
                            : 'bg-gradient-to-br from-teal-500 to-cyan-500 border-2 border-white/30 group-hover:border-white/50'
                        }`}>
                          {getFavicon(alert.site) ? (
                            <img 
                              src={getFavicon(alert.site)} 
                              alt=""
                              className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <Globe className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${getFavicon(alert.site) ? 'hidden' : ''} ${isDark ? 'text-cyan-300' : 'text-white'}`} />
                        </div>

                        {/* Enhanced Content */}
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex items-start gap-3 flex-wrap">
                            <h3 className={`text-xl font-bold flex-1 transition-colors duration-300 ${
                              isDark ? 'text-white group-hover:text-cyan-300' : 'text-gray-900 group-hover:text-teal-600'
                            } ${!alert.isRead ? 'text-cyan-300' : ''}`}>
                              {alert.title}
                            </h3>
                            
                            <div className="flex items-center gap-2">
                              {!alert.isRead && (
                                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-pulse shadow-lg"></div>
                              )}
                              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-105 ${
                                severityConfig.badgeColor
                              }`}>
                                {alert.severity}
                              </span>
                            </div>
                          </div>
                          
                          <p className={`text-base leading-relaxed transition-colors duration-300 ${
                            isDark ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-700'
                          }`}>
                            {alert.message}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                              isDark ? 'bg-black/30 text-gray-400 hover:bg-black/40' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                              <Globe className="w-4 h-4" />
                              <span className="font-medium">{alert.site}</span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                              isDark ? 'bg-black/30 text-gray-400 hover:bg-black/40' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">{formatTimeAgo(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!alert.isRead && (
                            <button
                              onClick={() => handleMarkAsRead([alert.id])}
                              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                                isDark 
                                  ? 'hover:bg-green-500/20 text-gray-300 hover:text-green-300 hover:border-2 hover:border-green-400/30 backdrop-blur-xl'
                                  : 'hover:bg-green-100 text-gray-600 hover:text-green-600 hover:border-2 hover:border-green-200'
                              }`}
                              title="Mark as read"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteSingle(alert.id)}
                            className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                              isDark
                                ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-300 hover:border-2 hover:border-red-400/30 backdrop-blur-xl'
                                : 'hover:bg-red-100 text-gray-600 hover:text-red-600 hover:border-2 hover:border-red-200'
                            }`}
                            title="Delete alert"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Scrollbar Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          border-radius: 12px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'linear-gradient(to bottom, rgba(20, 184, 166, 0.6), rgba(6, 182, 212, 0.6))' : 'linear-gradient(to bottom, rgba(20, 184, 166, 0.7), rgba(6, 182, 212, 0.7))'};
          border-radius: 12px;
          border: 2px solid ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'linear-gradient(to bottom, rgba(20, 184, 166, 0.8), rgba(6, 182, 212, 0.8))' : 'linear-gradient(to bottom, rgba(20, 184, 166, 0.9), rgba(6, 182, 212, 0.9))'};
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}