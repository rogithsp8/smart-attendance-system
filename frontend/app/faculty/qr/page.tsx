'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, Clock, RefreshCw } from 'lucide-react';

export default function FacultyQRPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleGenerateQR = () => {
    setSessionActive(true);
    setTimer(300); // 5 minutes
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout userRole="faculty" pageTitle="QR Attendance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geo-Fenced QR Attendance</h1>
          <p className="mt-2 text-muted-foreground">Generate QR code for location-based attendance marking</p>
        </div>

        {/* QR Generation Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* QR Code Display */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="mb-6 text-lg font-semibold text-foreground">QR Code</h2>
            {sessionActive ? (
              <div className="flex flex-col items-center gap-6">
                {/* Placeholder QR Code */}
                <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary-light">
                  <div className="text-center">
                    <QrCode className="mx-auto h-16 w-16 text-primary" />
                    <p className="mt-2 text-sm font-medium text-primary">QR Code Active</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Session ID: SESS-2024-001</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{formatTime(timer)}</p>
                </div>
                <Button onClick={handleEndSession} variant="destructive" className="w-full">
                  End Session
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-muted">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <Button onClick={handleGenerateQR} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate QR
                </Button>
              </div>
            )}
          </div>

          {/* Session Details */}
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Location Status</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-success" />
                <span className="text-sm">Location verified (Classroom A)</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Coordinates: 28.7041° N, 77.1025° E</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Session Info</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subject</span>
                  <span className="font-medium">Data Structures</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <span className="font-medium">CS-201 A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students Present</span>
                  <span className="font-medium">32 / 45</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Session Schedule</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">10:00 AM - 11:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
