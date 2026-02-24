import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [0, 2]
        },
        false
      );
      
      qrScanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
        },
        (error) => {
          onScanError(error);
        }
      );
      
      setScanner(qrScanner);
    }, 100);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setIsScanning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6">
        <h3 className="text-xl font-bold mb-2">📱 QR Attendance Scanner</h3>
        <p className="text-indigo-100">Scan QR code to mark attendance</p>
      </div>
      
      <div className="p-6">
        {!isScanning ? (
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📷</span>
            </div>
            <p className="text-gray-600 mb-6">Click below to start scanning QR codes</p>
            <button
              onClick={startScanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Start Scanner
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div id="qr-reader" className="mb-4"></div>
            <button
              onClick={stopScanning}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Stop Scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
