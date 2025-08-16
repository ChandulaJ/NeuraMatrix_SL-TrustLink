import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import Cookies from "js-cookie";
import { API_SCHEDULE_MY, API_SCHEDULE_DELETE } from "@/lib/api-endpoints";

export interface AdminScheduleItem {
  id: number;
  adminId: number;
  start: string;
  end: string;
  title: string;
}

interface AdminScheduleListProps {
  onDelete?: (id: number) => void;
}

export const AdminScheduleList = ({ onDelete }: AdminScheduleListProps) => {
  const [schedules, setSchedules] = useState<AdminScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");
        const res = await Api.get<AdminScheduleItem[]>(
          API_SCHEDULE_MY,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setSchedules(res);
      } catch (err) {
        setError((err as Error).message || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await Api.delete<{ ok: boolean }>(
        API_SCHEDULE_DELETE(String(id)),
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setSchedules((prev) => prev.filter((item) => item.id !== id));
      if (onDelete) onDelete(id);
    } catch (err) {
      alert((err as Error).message || "Failed to delete schedule");
    }
  };

  if (loading) return <div>Loading schedules...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {schedules.length === 0 ? (
        <div>No schedules found.</div>
      ) : (
        schedules.map((item) => (
          <div key={item.id} className="flex items-center justify-between border p-2 rounded">
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600">
                {new Date(item.start).toLocaleString()} - {new Date(item.end).toLocaleString()}
              </div>
            </div>
            <button
              className="text-red-500 hover:underline ml-4"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};
