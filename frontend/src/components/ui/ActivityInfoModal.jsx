import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, Monitor, Smartphone, MapPin, Clock, Shield, AlertTriangle, Filter, Search, Download, RefreshCw, ChevronDown } from 'lucide-react';
import { getActivityInfos, putActivityInfo } from '../../service/api/ActivityInfoService';

export default function ActivityInfoModal({ isDark = false, credential_id = "demo-123", onClose = () => {} }) {
  const [activityList, setActivityList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!credential_id) {
        setError("No credential ID provided");
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const res = await getActivityInfos(credential_id);
        // console.log(res)
        if (res) {
          setActivityList(res);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message || "Failed to fetch activities");
        setActivityList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [credential_id]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async (id, response) => {
    if (typeof id === 'undefined' || response === null || response === undefined) {
      console.error("Invalid parameters for handleConfirm");
      return;
    }

    try {
      // Call the API to update the activity info
      await putActivityInfo(credential_id, { id, confirmed: response });
      
      // Update the local state
      setActivityList(prev => prev.map(item => 
        item.id === id ? { ...item, confirmed: response } : item
      ));
      
      const toastMessage = response==='Yes' ? "Marked as 'Yes'" : "Marked as 'No'";
      console.log(toastMessage);
    } catch (error) {
      console.error("Error updating activity:", error);
      setError("Failed to update activity status");
    }
  };

  const handleTerminateSession = async (id) => {
    if (typeof id === 'undefined') {
      console.error("Invalid ID for handleTerminateSession");
      return;
    }

    try {
      // Call the API to terminate the session
      await putActivityInfo(credential_id, { id, sessionActive: false });
      
      // Update the local state
      setActivityList(prev => prev.map(item =>
        item.id === id ? { ...item, sessionActive: false } : item
      ));
      console.log('Session terminated for ID:', id);
    } catch (error) {
      console.error("Error terminating session:", error);
      setError("Failed to terminate session");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedActivities.size === 0) return;
    
    const validActions = ['confirm-yes', 'confirm-no', 'terminate'];
    if (!validActions.includes(action)) {
      console.error("Invalid bulk action:", action);
      return;
    }

    try {
      const updatePromises = Array.from(selectedActivities).map(async (id) => {
        let updateData = { id };
        switch (action) {
          case 'confirm-yes':
            updateData.confirmed = 'Yes';
            break;
          case 'confirm-no':
            updateData.confirmed = 'No';
            break;
          case 'terminate':
            updateData.sessionActive = false;
            break;
        }
        return putActivityInfo(credential_id, updateData);
      });

      await Promise.all(updatePromises);
      
      // Update local state after all API calls succeed
      setActivityList(prev => prev.map(item => {
        if (selectedActivities.has(item.id)) {
          switch (action) {
            case 'confirm-yes':
              return { ...item, confirmed: 'Yes' };
            case 'confirm-no':
              return { ...item, confirmed: 'No' };
            case 'terminate':
              return { ...item, sessionActive: false };
            default:
              return item;
          }
        }
        return item;
      }));
      
      setSelectedActivities(new Set());
      console.log(`Bulk action completed: ${action} on ${selectedActivities.size} items`);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      setError("Failed to perform bulk action");
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await getActivityInfos(credential_id);
      if (res) {
        setActivityList(res);
      }
    } catch (err) {
      console.error("Error refreshing activities:", err);
      setError("Failed to refresh activities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (activityList.length === 0) {
      console.log("No data to export");
      return;
    }

    try {
      const csvContent = activityList.map(item => {
        const confirmed = item.confirmed === null ? 'Pending' : (item.confirmed==='Yes' ? 'Yes' : 'No');
        const suspicious = item.suspicious ? 'Yes' : 'No';
        
        return `"${item.device || ''}","${item.city || ''}","${item.state || ''}","${item.country || ''}","${item.timestamp || ''}","${confirmed}","${item.ipAddress || ''}","${suspicious}"`;
      }).join('\n');
      
      const header = 'Device,City,State,Country,Timestamp,Confirmed,IP Address,Suspicious\n';
      const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      console.log("Export completed successfully");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const filteredAndSortedActivities = useMemo(() => {
    if (!Array.isArray(activityList)) return [];

    let filtered = activityList.filter(item => {
      if (!item) return false;

      const searchFields = [
        item.device || '',
        item.city || '',
        item.state || '',
        item.country || '',
        item.location || ''
      ];
      
      const matchesSearch = searchTerm === '' || 
        searchFields.some(field => 
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilter = filterType === 'all' ||
                           (filterType === 'suspicious' && item.suspicious === true) ||
                           (filterType === 'confirmed' && item.confirmed !== null) ||
                           (filterType === 'unconfirmed' && item.confirmed === null);
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (!a || !b) return 0;

      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp || 0) - new Date(b.timestamp || 0);
        case 'device':
          return (a.device || '').localeCompare(b.device || '');
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'state':
          return (a.state || '').localeCompare(b.state || '');
        case 'country':
          return (a.country || '').localeCompare(b.country || '');
        default: // newest
          return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      }
    });

    return filtered;
  }, [activityList, searchTerm, filterType, sortBy]);

  const getDeviceIcon = (deviceType) => {
    return deviceType === 'mobile' ? Smartphone : Monitor;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const getLocationString = (entry) => {
    const parts = [entry.city, entry.state, entry.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  const suspiciousCount = activityList.filter(item => item && item.suspicious === true).length;
  const unconfirmedCount = activityList.filter(item => item && item.confirmed === null).length;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
      
      {/* Modal */}
      <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden animate-modal-in ${
        isDark 
          ? 'bg-black/40 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]' 
          : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900'
      }`}>
        <div className="p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl p-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border border-cyan-400/30'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500'
              }`}>
                <Globe className={`w-5 h-5 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
              </div>
              
              <div>
                <h3 className={`text-xl font-bold ${
                  isDark 
                    ? 'bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent' 
                    : 'text-gray-900'
                }`}>
                  Recent Activity
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {suspiciousCount > 0 && (
                    <span className="text-red-400 font-medium">
                      {suspiciousCount} suspicious • 
                    </span>
                  )} {unconfirmedCount} pending review
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-blue-500/20 text-gray-300 hover:text-blue-400' 
                    : 'hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                } ${isLoading ? 'animate-spin' : 'hover:scale-110'}`}
                title="Refresh"
                aria-label="Refresh activities"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleExport}
                disabled={activityList.length === 0}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-green-500/20 text-gray-300 hover:text-green-400' 
                    : 'hover:bg-green-100 text-gray-600 hover:text-green-600'
                } hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                title="Export CSV"
                aria-label="Export activity data as CSV"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400 hover:border hover:border-red-400/30 hover:scale-110' 
                    : 'hover:bg-red-100 text-gray-600 hover:text-red-600 hover:border hover:border-red-200 hover:scale-110'
                }`}
                title="Close"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Error: {error}</span>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search devices or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-black/20 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400/50'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-500'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                  isDark
                    ? 'bg-black/20 border-white/10 text-white hover:bg-black/30'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
                aria-expanded={showFilters}
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className={`flex flex-wrap gap-4 p-4 rounded-xl border animate-fade-in ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-black/20 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  aria-label="Filter by activity type"
                >
                  <option value="all">All Activities</option>
                  <option value="suspicious">Suspicious Only</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="unconfirmed">Unconfirmed</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-black/20 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  aria-label="Sort activities by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="device">By Device</option>
                  <option value="city">By City</option>
                  <option value="state">By State</option>
                  <option value="country">By Country</option>
                </select>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedActivities.size > 0 && (
              <div className={`flex items-center justify-between p-4 rounded-xl border animate-fade-in ${
                isDark ? 'bg-blue-500/10 border-blue-400/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  {selectedActivities.size} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('confirm-yes')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isDark
                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    Mark as Yes
                  </button>
                  <button
                    onClick={() => handleBulkAction('confirm-no')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isDark
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Mark as No
                  </button>
                  <button
                    onClick={() => handleBulkAction('terminate')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isDark
                        ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    Terminate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading activities...
              </div>
            ) : filteredAndSortedActivities.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {activityList.length === 0 ? 'No activities found.' : 'No activities match your current filters.'}
              </div>
            ) : (
              filteredAndSortedActivities.map((entry) => {
                if (!entry || !entry.id) return null;
                
                const DeviceIcon = getDeviceIcon(entry.deviceType);
                const isSelected = selectedActivities.has(entry.id);
                
                return (
                  <div 
                    key={entry.id}
                    className={`rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? (isDark 
                            ? 'bg-blue-500/20 border-blue-400/50' 
                            : 'bg-blue-50 border-blue-300')
                        : (isDark
                            ? 'bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/25'
                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100')
                    } ${entry.suspicious ? (isDark ? 'ring-1 ring-red-400/30' : 'ring-1 ring-red-300') : ''}`}
                    onClick={() => {
                      const newSelected = new Set(selectedActivities);
                      if (isSelected) {
                        newSelected.delete(entry.id);
                      } else {
                        newSelected.add(entry.id);
                      }
                      setSelectedActivities(newSelected);
                    }}
                  >
                    <div className="space-y-4">
                      {/* Top Row: Device Info */}
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newSelected = new Set(selectedActivities);
                            if (e.target.checked) {
                              newSelected.add(entry.id);
                            } else {
                              newSelected.delete(entry.id);
                            }
                            setSelectedActivities(newSelected);
                          }}
                          className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                          aria-label={`Select ${entry.device || 'activity'}`}
                        />
                        
                        <div className={`w-10 h-10 rounded-xl p-2 flex items-center justify-center flex-shrink-0 ${
                          isDark 
                            ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border border-cyan-400/30'
                            : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                        }`}>
                          <DeviceIcon className={`w-5 h-5 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {entry.device || 'Unknown Device'}
                            </div>
                            {entry.suspicious && (
                              <AlertTriangle className="w-4 h-4 text-red-400" title="Suspicious activity" />
                            )}
                            {entry.sessionActive && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-xs text-green-400">Active</span>
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <MapPin className="w-4 h-4 text-teal-400" />
                            {getLocationString(entry)}
                            <span className="text-xs">• {entry.ip || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg ${
                            isDark ? 'bg-black/30 text-gray-400' : 'bg-gray-200 text-gray-600'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(entry.timestamp)}
                          </div>
                          <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {entry.loginMethod || ''}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Row: Action Buttons */}
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Was this you?
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {entry.sessionActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTerminateSession(entry.id);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDark
                                  ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30'
                                  : 'bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200'
                              }`}
                            >
                              <Shield className="w-3 h-3 inline mr-1" />
                              End Session
                            </button>
                          )}
                          
                          {entry.confirmed === null ? (
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirm(entry.id, 'Yes');
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                                  isDark
                                    ? 'bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30'
                                    : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirm(entry.id, 'No');
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                                  isDark
                                    ? 'bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30'
                                    : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                                }`}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-medium border ${
                              entry.confirmed==='Yes'
                                ? (isDark ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-green-100 text-green-700 border-green-200')
                                : (isDark ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-red-100 text-red-700 border-red-200')
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                entry.confirmed==='Yes'
                                  ? 'bg-green-400' 
                                  : 'bg-red-400'
                              }`}></div>
                              Marked: {entry.confirmed==='Yes' ? 'Yes' : 'No'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-modal-in {
          animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(20, 184, 166, 0.5)' : 'rgba(20, 184, 166, 0.6)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(20, 184, 166, 0.7)' : 'rgba(20, 184, 166, 0.8)'};
        }

        /* Checkbox styling */
        input[type="checkbox"] {
          appearance: none;
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 4px;
          position: relative;
        }
        
        input[type="checkbox"]:checked {
          background-color: rgb(20, 184, 166);
          border-color: rgb(20, 184, 166);
        }
        
        input[type="checkbox"]:checked::after {
          content: '✓';
          color: white;
          font-size: 12px;
          position: absolute;
          top: -1px;
          left: 1px;
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 16px;
          padding-right: 32px;
        }
      `}</style>
    </div>
  );
}