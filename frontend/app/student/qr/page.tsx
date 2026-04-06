'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function StudentQRPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);

  const handleStartScan = () => {
    setScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      setScanResult('success');
      setScanning(false);
    }, 2000);
  };

  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <AppLayout userRole="student" pageTitle="QR Attendance Scan">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Attendance Scan</h1>
          <p className="mt-2 text-muted-foreground">Scan QR code to mark your attendance</p>
        </div>

        {/* Camera/Scanner Area */}
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8">
          <h2 className="mb-6 text-center text-lg font-semibold text-foreground">Camera Feed</h2>

          {!scanning && !scanResult && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-muted">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <Button onClick={handleStartScan} size="lg" className="w-full">
                Start Camera Scan
              </Button>
            </div>
          )}

          {scanning && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary-light animate-pulse">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">Scanning camera...</p>
            </div>
          )}

          {scanResult === 'success' && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-success-light">
                <CheckCircle className="h-20 w-20 text-success" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-success">Attendance Marked!</p>
                <p className="text-sm text-muted-foreground">Session: SESS-2024-001</p>
              </div>
              <Button onClick={handleReset} variant="outline" className="w-full">
                Scan Again
              </Button>
            </div>
          )}

          {scanResult === 'error' && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-error-light">
                <AlertTriangle className="h-20 w-20 text-error" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-error">Scan Failed</p>
                <p className="text-sm text-muted-foreground">Invalid or expired QR code</p>
              </div>
              <Button onClick={handleReset} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Location & Session Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Location Verification</h3>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-success" />
              <span className="text-sm">Within geo-fence radius</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">You are in the correct classroom</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Current Class</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subject</span>
                <span className="font-medium">Data Structures</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="font-medium">10:00 AM - 11:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
