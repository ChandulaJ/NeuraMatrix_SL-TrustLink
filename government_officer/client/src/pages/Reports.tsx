import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Reports = () => {
  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-government-800">Reports</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Last 30 days</Button>
            <Button variant="outline" size="sm">Last 90 days</Button>
            <Button variant="outline" size="sm">Last 12 months</Button>
            <Button variant="outline" size="sm">Compare period</Button>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm">
          <div><span className="font-medium">Total</span> 4</div>
          <div><span className="font-medium">Approved</span> 1</div>
          <div><span className="font-medium">Rejected</span> 3</div>
          <div><span className="font-medium">Approval rate</span> 25%</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Approvals vs Rejections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Approvals vs Rejections</CardTitle>
            <p className="text-sm text-government-500">Last 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button variant="outline" size="sm">Print / Save PDF</Button>
              <Button variant="outline" size="sm">Export All CSV</Button>
              <Button variant="outline" size="sm">Download PNG</Button>
            </div>
            <div className="h-64 bg-government-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="flex gap-8 justify-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">Rejected</span>
                  </div>
                </div>
                <div className="text-government-500">Chart visualization would be implemented here</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Time-in-Stage by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Average Time-in-Stage by Region (days)</CardTitle>
            <p className="text-sm text-government-500">Approved only - submission → approval</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-government-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-government-500">
                Regional time analysis chart
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditor Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Auditor Performance Summary</CardTitle>
            <p className="text-sm text-government-500">Pass percentage on audited applications</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-government-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">Pass %</span>
                </div>
                <div className="text-government-500">Auditor performance metrics</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Applications by Status</CardTitle>
            <p className="text-sm text-government-500">Current filtered period</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-government-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Audit Passed (8)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Pending (4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Approved (1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Rejected (3)</span>
                  </div>
                </div>
                <div className="text-government-500">Status distribution pie chart</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};