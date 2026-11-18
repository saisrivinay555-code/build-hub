import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Package, 
  UserCheck, 
  HardHat, 
  FolderKanban,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NotificationDrawer() {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsRead 
  } = useApp();

  if (!isNotificationsOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'safety':
        return <div className="p-2 rounded-xl bg-red-50 text-red-600"><AlertTriangle size={16} /></div>;
      case 'inventory':
        return <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Package size={16} /></div>;
      case 'approval':
        return <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><UserCheck size={16} /></div>;
      case 'attendance':
        return <div className="p-2 rounded-xl bg-purple-50 text-purple-600"><HardHat size={16} /></div>;
      default:
        return <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Bell size={16} /></div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B2559]">Notifications Center</h3>
              <p className="text-xs text-gray-500">Live site alerts & approvals</p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-gray-50 flex items-center justify-between border-b border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold">
            {notifications.filter(n => !n.read).length} Unread
          </span>
          <button
            onClick={markAllNotificationsRead}
            className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-3.5 rounded-2xl transition cursor-pointer flex items-start gap-3 my-1 ${
                notif.read ? 'bg-white hover:bg-gray-50 opacity-75' : 'bg-blue-50/50 hover:bg-blue-50/80 border border-blue-100/60'
              }`}
            >
              {getIcon(notif.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${notif.read ? 'text-gray-800' : 'text-blue-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-gray-400">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-full py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
}
