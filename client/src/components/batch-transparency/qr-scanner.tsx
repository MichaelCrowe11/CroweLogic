import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

type QRScannerProps = {
  onScan: (data: string) => void;
  onClose: () => void;
};

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [scannerLoading, setScannerLoading] = useState<boolean>(true);
  const [scannerError, setScannerError] = useState<string | null>(null);
  
  useEffect(() => {
    // Load the html5-qrcode library dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.async = true;
    script.onload = () => {
      setScannerLoading(false);
      initializeScanner();
    };
    script.onerror = () => {
      setScannerError("Failed to load QR scanner library");
      setScannerLoading(false);
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const initializeScanner = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (videoDevices.length === 0) {
        setHasCamera(false);
        setScannerError("No camera found on your device");
        return;
      }
      
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      
      startScanner();
    } catch (error) {
      console.error("Camera permission error:", error);
      setHasPermission(false);
      setScannerError("Camera permission denied");
    }
  };
  
  const startScanner = () => {
    // @ts-ignore - html5QrCode is loaded dynamically
    if (typeof Html5Qrcode === "undefined") {
      setScannerError("QR scanner library not loaded");
      return;
    }
    
    const scannerId = "qr-reader";
    const scannerElement = document.getElementById(scannerId);
    
    if (!scannerElement) return;
    
    try {
      // @ts-ignore - html5QrCode is loaded dynamically
      const html5QrCode = new Html5Qrcode(scannerId);
      const qrCodeSuccessCallback = (decodedText: string) => {
        html5QrCode.stop();
        onScan(decodedText);
      };
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        () => {}
      ).catch((err: any) => {
        console.error("QR scanner error:", err);
        setScannerError("Failed to start scanner: " + err.message);
      });
      
      // Clean up on component unmount
      return () => {
        html5QrCode.stop().catch(console.error);
      };
    } catch (error) {
      console.error("QR scanner initialization error:", error);
      setScannerError("Failed to initialize scanner");
    }
  };

  return (
    <Card className="mt-4 relative">
      <CardContent className="p-4">
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 z-10" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {scannerLoading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-neutral-600">Loading camera...</p>
          </div>
        )}
        
        {!scannerLoading && scannerError && (
          <div className="text-center py-6">
            <p className="text-sm text-red-600 mb-2">{scannerError}</p>
            <Button variant="outline" onClick={onClose}>Close Scanner</Button>
          </div>
        )}
        
        {!scannerLoading && !scannerError && (
          <>
            {hasPermission === false && (
              <div className="text-center py-6">
                <p className="text-sm text-red-600 mb-2">
                  Camera access was denied. Please allow camera access to scan QR codes.
                </p>
                <Button onClick={initializeScanner}>Request Permission Again</Button>
              </div>
            )}
            
            {hasPermission === true && (
              <div>
                <div className="relative">
                  <div id="qr-reader" style={{ width: '100%' }}></div>
                  <div className="text-center text-sm text-neutral-600 mt-2">
                    Position the QR code within the frame to scan
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
