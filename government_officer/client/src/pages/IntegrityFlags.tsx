import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api-endpoints";
import { motion } from "framer-motion";
import { Api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IntegrityFlag {
  id: number;
  level: string;
  title: string;
  description: string;
  status: "OPEN" | "RESOLVED" | string;
  createdAt: string;
}

export const IntegrityFlags = () => {
  const [level, setLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [flags, setFlags] = useState<IntegrityFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFlags = async (lvl: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.get<IntegrityFlag[]>(
        `${API_BASE_URL}/integrity-flags?level=${lvl}`
      );
      setFlags(res || []);
    } catch (err) {
      setError((err as Error).message || "Failed to load integrity flags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags(level);
  }, [level]);

  const handleResolve = async (id: number) => {
    try {
      const res = await Api.post<IntegrityFlag>(
        `${API_BASE_URL}/integrity-flags/${id}/resolve`,
        {}
      );
      setFlags((prev) => prev.map((f) => (f.id === id ? res : f)));
      toast({ title: "Flag resolved", description: `${res.title} marked as RESOLVED` });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message || "Failed to resolve flag", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-government-800">Integrity Flags</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-government-600">Filter level</div>
            <Select value={level} onValueChange={(v) => setLevel(v as "HIGH" | "MEDIUM" | "LOW") }>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div>Loading flags...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : flags.length === 0 ? (
        <div>No flags found for level {level}.</div>
      ) : (
        <div className="space-y-4">
          {flags.map((f) => (
            <div key={f.id} className="bg-white border rounded p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold text-government-800">{f.title}</div>
                  <Badge className={`text-xs ${f.status === "OPEN" ? "bg-red-500" : "bg-green-500"}`}>{f.status}</Badge>
                </div>
                <div className="text-sm text-government-600 mt-1">{f.description}</div>
                <div className="text-xs text-government-500 mt-2">Created: {format(new Date(f.createdAt), "PPP p")}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {f.status !== "RESOLVED" ? (
                  <Button className="bg-status-approved text-white" onClick={() => handleResolve(f.id)}>
                    Resolve
                  </Button>
                ) : (
                  <div className="text-sm text-green-600">Resolved</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntegrityFlags;