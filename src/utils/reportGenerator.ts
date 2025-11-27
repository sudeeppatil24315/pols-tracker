import jsPDF from 'jspdf';
import type { Vehicle } from '../types';
import { calculateVehicleStatus } from './statusCalculations';

export const generateFleetReport = (vehicles: Vehicle[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Header
  doc.setFillColor(249, 215, 28); // Yellow
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text('🐔 LOS POLLOS TRACKER', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Fleet Status Report', pageWidth / 2, 30, { align: 'center' });

  yPosition = 50;

  // Report metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const reportDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  doc.text(`Generated: ${reportDate}`, 20, yPosition);
  yPosition += 10;

  // Summary Statistics
  const statusCounts = {
    total: vehicles.length,
    onTime: vehicles.filter((v) => v.status === 'on-time').length,
    warning: vehicles.filter((v) => v.status === 'warning').length,
    critical: vehicles.filter((v) => v.status === 'critical').length,
  };

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Fleet Summary', 20, yPosition);
  yPosition += 10;

  // Summary boxes
  doc.setFontSize(12);
  
  // Total
  doc.setFillColor(50, 50, 50);
  doc.roundedRect(20, yPosition, 40, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Total', 40, yPosition + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.text(statusCounts.total.toString(), 40, yPosition + 16, { align: 'center' });

  // On-Time
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(70, yPosition, 40, 20, 3, 3, 'F');
  doc.setFontSize(12);
  doc.text('On-Time', 90, yPosition + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.text(statusCounts.onTime.toString(), 90, yPosition + 16, { align: 'center' });

  // Warning
  doc.setFillColor(234, 179, 8);
  doc.roundedRect(120, yPosition, 40, 20, 3, 3, 'F');
  doc.setFontSize(12);
  doc.text('Warning', 140, yPosition + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.text(statusCounts.warning.toString(), 140, yPosition + 16, { align: 'center' });

  // Critical
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(170, yPosition, 40, 20, 3, 3, 'F');
  doc.setFontSize(12);
  doc.text('Critical', 190, yPosition + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.text(statusCounts.critical.toString(), 190, yPosition + 16, { align: 'center' });

  yPosition += 35;

  // Vehicle Details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Vehicle Details', 20, yPosition);
  yPosition += 10;

  // Sort vehicles by status (critical first)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const statusOrder = { critical: 0, warning: 1, 'on-time': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  sortedVehicles.forEach((vehicle, index) => {
    checkNewPage(60);

    const statusCalc = calculateVehicleStatus(vehicle);

    // Vehicle card background
    const bgColor: [number, number, number] = 
      vehicle.status === 'critical' ? [254, 242, 242] :
      vehicle.status === 'warning' ? [254, 252, 232] :
      [240, 253, 244];
    
    doc.setFillColor(...bgColor);
    doc.roundedRect(20, yPosition, pageWidth - 40, 55, 3, 3, 'F');

    // Status indicator
    const statusColor: [number, number, number] =
      vehicle.status === 'critical' ? [239, 68, 68] :
      vehicle.status === 'warning' ? [234, 179, 8] :
      [34, 197, 94];
    
    doc.setFillColor(...statusColor);
    doc.circle(25, yPosition + 5, 3, 'F');

    // Vehicle info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${vehicle.driverName}`, 32, yPosition + 7);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Vehicle ID: ${vehicle.id}`, 32, yPosition + 13);

    // Details in two columns
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Left column
    doc.text(`Status: ${vehicle.status.toUpperCase()}`, 25, yPosition + 22);
    doc.text(`Speed: ${Math.round(vehicle.currentSpeed)} km/h`, 25, yPosition + 28);
    doc.text(`Cargo: ${vehicle.cargoStatus}`, 25, yPosition + 34);
    if (vehicle.cargoTemperature) {
      doc.text(`Temp: ${vehicle.cargoTemperature.toFixed(1)}°C`, 25, yPosition + 40);
    }

    // Right column
    const scheduledETA = vehicle.scheduledETA?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) || 'N/A';
    const projectedETA = statusCalc.projectedETA.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    doc.text(`Scheduled ETA: ${scheduledETA}`, 110, yPosition + 22);
    doc.text(`Projected ETA: ${projectedETA}`, 110, yPosition + 28);
    doc.text(`Distance: ${statusCalc.remainingDistance.toFixed(1)} km`, 110, yPosition + 34);
    doc.text(`Required Speed: ${Math.round(statusCalc.requiredAverageSpeed)} km/h`, 110, yPosition + 40);

    // Destination
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Destination: ${vehicle.destination.address}`, 25, yPosition + 48);

    // ETA difference indicator
    if (Math.abs(statusCalc.etaDifferenceMinutes) > 1) {
      const delayText = statusCalc.etaDifferenceMinutes > 0 
        ? `Delayed by ${Math.round(statusCalc.etaDifferenceMinutes)} min`
        : `Ahead by ${Math.round(Math.abs(statusCalc.etaDifferenceMinutes))} min`;
      
      doc.setFontSize(9);
      doc.setTextColor(...statusColor);
      doc.text(delayText, pageWidth - 25, yPosition + 48, { align: 'right' });
    }

    yPosition += 60;
  });

  // Footer on last page
  checkNewPage(20);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Los Pollos Hermanos - Taste the Family... On Time',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `LosPollos_Fleet_Report_${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);

  return filename;
};
