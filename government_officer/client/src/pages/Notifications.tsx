import { motion } from "framer-motion";

const notifications = [
  {
    id: 1,
    time: "8/8/2025, 6:55:39 PM",
    type: "email",
    recipient: "anusha@example.com",
    subject: "Audit Passed",
    message: "Awaiting final review."
  },
  {
    id: 2,
    time: "8/4/2025, 6:55:39 PM", 
    type: "email",
    recipient: "kasun@example.com",
    subject: "Application Rejected",
    message: "Reason: Missing fire extinguisher and blocked exit."
  }
];

export const Notifications = () => {
  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-government-800">Notifications Log</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-government-200">
              {notifications.map((notification, index) => (
                <motion.tr
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-government-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-government-900">{notification.time}</td>
                  <td className="px-6 py-4 text-government-900">{notification.type}</td>
                  <td className="px-6 py-4 text-government-900">{notification.recipient}</td>
                  <td className="px-6 py-4 text-government-900">{notification.subject}</td>
                  <td className="px-6 py-4 text-government-700">{notification.message}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};