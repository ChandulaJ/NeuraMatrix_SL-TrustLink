import { QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  appointmentId: number;
  reference: string;
  qrcode?: string; // URL to the QR code image
}

export const QRCodeDisplay = ({ appointmentId, reference, qrcode }: QRCodeDisplayProps) => {
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
            {qrcode ? (
              <img
                src={qrcode} // URL from backend
                alt={`QR Code for ${reference}`}
                className="w-40 h-40 object-contain"
              />
            ) : (
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">QR Code</p>
                <p className="text-xs text-muted-foreground mt-1">{reference}</p>
              </div>
            )}
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
