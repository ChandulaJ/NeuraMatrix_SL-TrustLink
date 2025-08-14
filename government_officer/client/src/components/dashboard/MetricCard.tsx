import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: "blue" | "green" | "orange";
  clickable?: boolean;
  onClick?: () => void;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "blue",
  clickable = false,
  onClick 
}: MetricCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700", 
    orange: "bg-orange-50 border-orange-200 text-orange-700"
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={clickable ? { scale: 1.02 } : {}}
      className={`p-6 rounded-lg border ${colorClasses[color]} ${
        clickable ? "cursor-pointer hover:shadow-md transition-all duration-200" : ""
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {Icon && <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />}
            <h3 className="text-lg font-semibold text-government-800">{title}</h3>
          </div>
          <div className="text-3xl font-bold text-government-900 mb-1">{value}</div>
          {subtitle && (
            <p className="text-sm text-government-600">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};