import React, { useState } from 'react';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result) => {
    if (result) {
      onScanSuccess(result);
      setIsScanning(false);
    }
  };

  const handleError = (error) => {
    onScanError(error);
  };

  return (
    <div className="qr-scanner">
      <div className="text-center">
        <h3>📱 QR Attendance Scanner</h3>
        
        {!isScanning ? (
          <div className="scanner-placeholder">
            <div className="scanner-icon">
              📷
            </div>
            <p>Click below to start scanning</p>
            <button
              onClick={() => setIsScanning(true)}
              className="btn btn-primary"
            >
              Start Scanner
            </button>
          </div>
        ) : (
          <div className="scanner-active">
            <div className="scanner-container placeholder">
              <div className="scanner-icon">📷</div>
              <p>Camera scanning is not available in this minimal build.</p>
            </div>
            <button
              onClick={() => setIsScanning(false)}
              className="btn btn-danger mt-3"
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
