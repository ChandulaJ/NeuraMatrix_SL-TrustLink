import { motion } from "framer-motion";
import { useNotifications } from "@/contexts/useNotifications";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const Notifications = () => {
  const { notifications, markAsRead, refresh } = useNotifications();

  const items = notifications || [];

  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-government-800">Notifications</h1>
          <div>
            <Button variant="outline" size="sm" onClick={() => refresh()}>Refresh</Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg border border-government-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-government-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-government-200">
              {items.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-government-700" colSpan={5}>No notifications</td>
                </tr>
              ) : items.map((n, index) => (
                <motion.tr
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className={`transition-colors duration-150 ${!n.read ? 'bg-government-50' : ''}`}
                >
                  <td className="px-6 py-4 text-government-900">{n.createdAt ? format(new Date(n.createdAt), 'PPP p') : '-'}</td>
                  <td className="px-6 py-4 text-government-900">{n.type}</td>
                  <td className="px-6 py-4 text-government-900">{n.title}</td>
                  <td className="px-6 py-4 text-government-700">{n.body}</td>
                  <td className="px-6 py-4">
                    {!n.read ? (
                      <Button size="sm" onClick={() => markAsRead(n.id)}>Mark read</Button>
                    ) : (
                      <div className="text-sm text-green-600">Read</div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};