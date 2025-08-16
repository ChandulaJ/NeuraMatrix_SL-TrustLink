import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Check } from "lucide-react";
import { format } from "date-fns";
import { AdminScheduleList } from "@/components/dashboard/AdminScheduleList";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Api } from "@/lib/api";
import { API_SCHEDULE_CREATE, API_APPLICATION_ACCEPT_APPOINTMENT, API_APPLICATION_APPROVE } from "@/lib/api-endpoints";

interface Props {
  applicationId?: string;
  onSuccess?: () => Promise<void> | void;
}

export const ScheduleDialog = ({ applicationId, onSuccess }: Props) => {
  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const [isOpen, setIsOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(defaultDate);
  const [scheduleTime, setScheduleTime] = useState<string>("09:00");
  const [endDate, setEndDate] = useState<Date | undefined>(defaultDate);
  const [endTime, setEndTime] = useState<string>("10:00");
  const [scheduleTitle, setScheduleTitle] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!scheduleDate || !scheduleTime || !endDate || !endTime || !scheduleTitle || !applicationId) {
      toast({ title: "Missing Information", description: "Please select start/end date/time and enter a title.", variant: "destructive" });
      return;
    }
    try {
      setCreating(true);
      const [hours, minutes] = scheduleTime.split(":");
      const scheduledFor = new Date(scheduleDate);
      scheduledFor.setHours(Number(hours), Number(minutes), 0, 0);
      const startIso = scheduledFor.toISOString();

      const [eh, em] = endTime.split(":");
      const ed = new Date(endDate);
      ed.setHours(Number(eh), Number(em), 0, 0);
      const endIso = ed.toISOString();
  const scheduleRes = (await Api.post(API_SCHEDULE_CREATE, { start: startIso, end: endIso, title: scheduleTitle })) as { id?: number };

      await Api.post(API_APPLICATION_ACCEPT_APPOINTMENT(String(applicationId)), { scheduledFor: startIso, force: true });

  type ApproveResponse = { status?: string; licenseNumber?: string };
  const approveRes = (await Api.post(API_APPLICATION_APPROVE(String(applicationId)), { appointment: { scheduledFor: startIso, force: true } })) as ApproveResponse;

  const success = approveRes?.status === "APPROVED";
      toast({
        title: success ? "Application Approved" : "Approval Result",
        description: success
          ? `Scheduled ${format(scheduledFor, "PPP")} ${scheduleTime}. Schedule id: ${scheduleRes?.id || "-"}. License #: ${approveRes?.licenseNumber || "-"}`
          : `Approve returned: ${approveRes?.status || "UNKNOWN"}`,
      });
      setIsOpen(false);
      setCreating(false);
      if (onSuccess) await onSuccess();
    } catch (err) {
      setCreating(false);
      toast({ title: "Error", description: (err as Error).message || "Failed to schedule/approve.", variant: "destructive" });
    }
  };

  // Keep confirm button disabled if the form is incomplete or start >= end
  const isFormValid = (() => {
    if (!scheduleDate || !scheduleTime || !endDate || !endTime || !scheduleTitle) return false;
    const [sh, sm] = scheduleTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const s = new Date(scheduleDate);
    s.setHours(sh, sm, 0, 0);
    const e = new Date(endDate);
    e.setHours(eh, em, 0, 0);
    return s < e;
  })();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-status-approved hover:bg-status-approved/90 text-white">
          <Check className="h-4 w-4 mr-2" />
          Approve & Schedule License
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-government-800">Schedule License Minting</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="p-2 border border-government-200 rounded-md bg-white">
            <div className="font-semibold mb-2">Your Schedules</div>
            <div className="max-h-[60vh] overflow-auto pr-2">
              <AdminScheduleList />
            </div>
          </div>

          <div className="p-4 border border-government-200 rounded-md bg-white">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-government-700">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduleDate && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduleDate}
                      onSelect={(d) => {
                        const ds = d as Date;
                        setScheduleDate(ds);
                        // if end date is before start, bump end date to start
                        if (!endDate || (endDate && ds > endDate)) {
                          setEndDate(ds);
                        }
                        (document.activeElement as HTMLElement | null)?.blur?.();
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

                <div>
                  <label className="text-sm font-medium text-government-700">Start Time</label>
                  <div>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        setScheduleTime(newTime);
                        // auto adjust end time to +1 hour when user changes start
                        const [h, m] = newTime.split(":").map(Number);
                        const dt = new Date();
                        dt.setHours(h + 1, m, 0, 0);
                        const pad = (n: number) => n.toString().padStart(2, "0");
                        setEndTime(`${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
                        (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full px-3 py-2 border border-government-300 rounded-md text-sm"
                    />
                  </div>
                </div>

              <div>
                <label className="text-sm font-medium text-government-700">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => {
                        setEndDate(d as Date);
                        (document.activeElement as HTMLElement | null)?.blur?.();
                      }}
                      disabled={(date) => scheduleDate ? date < scheduleDate : date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

                <div>
                  <label className="text-sm font-medium text-government-700">End Time</label>
                  <div>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full px-3 py-2 border border-government-300 rounded-md text-sm"
                    />
                  </div>
                </div>

              <div>
                <label className="text-sm font-medium text-government-700">Schedule Title</label>
                <input type="text" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} placeholder="Enter schedule title" className="w-full px-3 py-2 border border-government-300 rounded-md text-sm" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleConfirm} className="flex-1 bg-status-approved hover:bg-status-approved/90 text-white" disabled={creating || !isFormValid}>{creating ? "Processing..." : "Confirm Schedule"}</Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={creating}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
