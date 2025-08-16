import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { API_REPORT_APPROVALS_VS_REJECTIONS, API_REPORT_AUDITOR_PERFORMANCE, API_REPORT_STATUS_BREAKDOWN } from "@/lib/api-endpoints";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ApprovalsVsRejections {
  approved: number;
  rejected: number;
  rangeDays: number;
}

interface AuditorPerformanceItem {
  _count: { _all: number };
  auditorId: number;
}

interface StatusBreakdown {
  auditPassed: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const Reports = () => {
  const [avr, setAvr] = useState<ApprovalsVsRejections | null>(null);
  const [auditorPerf, setAuditorPerf] = useState<AuditorPerformanceItem[] | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
    const [avrRes, perfRes, statusRes] = await Promise.all([
      Api.get<ApprovalsVsRejections>(API_REPORT_APPROVALS_VS_REJECTIONS),
      Api.get<AuditorPerformanceItem[]>(API_REPORT_AUDITOR_PERFORMANCE),
      Api.get<StatusBreakdown>(API_REPORT_STATUS_BREAKDOWN),
    ]);
        setAvr(avrRes);
        setAuditorPerf(perfRes);
        setStatusBreakdown(statusRes);
      } catch (err) {
        setError((err as Error).message || "Failed to load reports");
        toast({ title: "Error", description: (err as Error).message || "Failed to load reports", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [toast]);

  const pieData = statusBreakdown
    ? [
        { name: "Audit Passed", value: statusBreakdown.auditPassed },
        { name: "Pending", value: statusBreakdown.pending },
        { name: "Approved", value: statusBreakdown.approved },
        { name: "Rejected", value: statusBreakdown.rejected },
      ]
    : [];

  const avrData = avr ? [{ name: "Approved", value: avr.approved }, { name: "Rejected", value: avr.rejected }] : [];

  const colors = ["#2563EB", "#10B981", "#F97316", "#EF4444"]; // blue, green, orange, red

  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">

        <div className="flex gap-6 text-sm">
          <div><span className="font-medium">Total</span> {avr ? avr.approved + avr.rejected : "-"}</div>
          <div><span className="font-medium">Approved</span> {avr ? avr.approved : "-"}</div>
          <div><span className="font-medium">Rejected</span> {avr ? avr.rejected : "-"}</div>
          <div><span className="font-medium">Approval rate</span> {avr ? Math.round((avr.approved / Math.max(1, avr.approved + avr.rejected)) * 100) + "%" : "-"}</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Approvals vs Rejections</CardTitle>
            <p className="text-sm text-government-500">Last {avr?.rangeDays ?? "-"} days</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button variant="outline" size="sm">Print / Save PDF</Button>
              <Button variant="outline" size="sm">Export All CSV</Button>
              <Button variant="outline" size="sm">Download PNG</Button>
            </div>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : avr ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={avrData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563EB">
                      {avrData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#2563EB" : "#10B981"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">No data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Auditor Performance</CardTitle>
            <p className="text-sm text-government-500">Audits per auditor</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : auditorPerf && auditorPerf.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={auditorPerf.map((a) => ({ auditorId: a.auditorId, count: a._count._all }))}>
                    <XAxis dataKey="auditorId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">No auditor data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Applications by Status</CardTitle>
            <p className="text-sm text-government-500">Current filtered period</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : statusBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">No data</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};