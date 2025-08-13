import { QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  appointmentId: number;
  reference: string;
}

export const QRCodeDisplay = ({ appointmentId, reference }: QRCodeDisplayProps) => {
  // Generate QR code data - in a real app, this would be a proper QR code
  const qrData = `APPOINTMENT:${appointmentId}:${reference}`;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          <QrCode className="w-4 h-4 mr-2" />
          Show QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 bg-muted border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">QR Code</p>
              <p className="text-xs text-muted-foreground mt-1">{reference}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Appointment Reference</p>
            <p className="text-lg font-mono font-bold text-primary">{reference}</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Show this QR code at your appointment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};