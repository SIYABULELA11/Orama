import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Palette, Download, FileImage, FileText } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ScheduleEvent {
  id: string;
  title: string;
  date: number;
  month: number;
  year: number;
  time?: string;
  type: 'lecture' | 'tutorial' | 'test' | 'exam' | 'assignment' | 'culture' | 'work';
  color: string;
  location?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringUntil?: Date;
}

interface ColorOption {
  name: string;
  value: string;
  bg: string;
}

const MySchedules = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use current date
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'semester'>('monthly');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedColor, setSelectedColor] = useState('blue');

  const colorOptions: ColorOption[] = [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-500' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500' },
    { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500' },
  ];

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    month: '',
    year: '',
    time: '',
    type: 'lecture' as ScheduleEvent['type'],
    color: 'blue',
    location: '',
    isRecurring: false,
    recurringType: 'weekly' as 'daily' | 'weekly' | 'monthly',
  });
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Work shifts will be dynamically generated from work events
  const workShifts = scheduleEvents
    .filter(event => event.type === 'work')
    .map(event => ({
      day: new Date(currentDate.getFullYear(), currentDate.getMonth(), event.date).toLocaleDateString('en-US', { weekday: 'long' }),
      time: event.time || 'All day',
      color: event.color,
      title: event.title,
    }));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevPeriod = () => {
    switch (viewMode) {
      case 'daily':
        setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
        break;
      case 'weekly':
        setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        break;
      case 'semester':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1));
        break;
      default:
        handlePrevMonth();
    }
  };

  const handleNextPeriod = () => {
    switch (viewMode) {
      case 'daily':
        setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
        break;
      case 'weekly':
        setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        break;
      case 'semester':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 1));
        break;
      default:
        handleNextMonth();
    }
  };

  const generateRecurringEvents = (baseEvent: Omit<ScheduleEvent, 'id'>) => {
    if (!baseEvent.isRecurring) return [baseEvent];
    
    const events: Omit<ScheduleEvent, 'id'>[] = [];
    const startDate = new Date(baseEvent.year, baseEvent.month, baseEvent.date);
    // currentDate is reassigned in the loop, so it needs to be let
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(startDate);
    
    // Generate events for the next 6 months
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
    
    while (currentDate <= endDate) {
      events.push({
        ...baseEvent,
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      });
      
      switch (baseEvent.recurringType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
    
    return events;
  };

  const handleAddEvent = () => {
    const eventDate = newEvent.date ? parseInt(newEvent.date) : selectedDate;
    const eventMonth = newEvent.month ? parseInt(newEvent.month) - 1 : currentDate.getMonth();
    const eventYear = newEvent.year ? parseInt(newEvent.year) : currentDate.getFullYear();
    
    if (newEvent.title && eventDate) {
      const baseEvent: Omit<ScheduleEvent, 'id'> = {
        title: newEvent.title,
        date: eventDate,
        month: eventMonth,
        year: eventYear,
        time: newEvent.time,
        type: newEvent.type,
        color: newEvent.color,
        location: newEvent.location,
        isRecurring: newEvent.isRecurring,
        recurringType: newEvent.recurringType,
      };
      
      const eventsToAdd = generateRecurringEvents(baseEvent);
      const newEvents = eventsToAdd.map(event => ({
        ...event,
        id: `${Date.now()}-${Math.random()}`,
      }));
      
      setScheduleEvents([...scheduleEvents, ...newEvents]);
      setNewEvent({ 
        title: '', date: '', month: '', year: '', time: '', 
        type: 'lecture', color: 'blue', location: '', 
        isRecurring: false, recurringType: 'weekly' 
      });
      setIsAddingEvent(false);
      setSelectedDate(null);
    }
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date.toString(),
      month: (event.month + 1).toString(),
      year: event.year.toString(),
      time: event.time || '',
      type: event.type,
      color: event.color,
      location: event.location || '',
      isRecurring: event.isRecurring || false,
      recurringType: event.recurringType || 'weekly',
    });
    setIsAddingEvent(true);
  };

  const handleUpdateEvent = () => {
    if (editingEvent && newEvent.title) {
      const updatedEvent: ScheduleEvent = {
        ...editingEvent,
        title: newEvent.title,
        date: parseInt(newEvent.date),
        month: parseInt(newEvent.month) - 1,
        year: parseInt(newEvent.year),
        time: newEvent.time,
        type: newEvent.type,
        color: newEvent.color,
        location: newEvent.location,
      };
      
      setScheduleEvents(scheduleEvents.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      ));
      setEditingEvent(null);
      setNewEvent({ 
        title: '', date: '', month: '', year: '', time: '', 
        type: 'lecture', color: 'blue', location: '', 
        isRecurring: false, recurringType: 'weekly' 
      });
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setScheduleEvents(scheduleEvents.filter(event => event.id !== eventId));
  };

  // Export functions
  const generatePDFContent = () => {
    const title = `Schedule - ${getViewTitle()}`;
    const currentEvents = getCurrentViewEvents();
    
    let content = `${title}\n\n`;
    
    if (currentEvents.length === 0) {
      content += "No events scheduled for this period.";
    } else {
      currentEvents.forEach(event => {
        content += `📅 ${monthNames[event.month]} ${event.date}, ${event.year}\n`;
        content += `📌 ${event.title}\n`;
        if (event.time) content += `⏰ ${event.time}\n`;
        content += `📚 ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}\n`;
        if (event.location) content += `📍 ${event.location}\n`;
        if (event.isRecurring) content += `🔄 Recurring: ${event.recurringType}\n`;
        content += `🎨 Color: ${event.color}\n\n`;
      });
    }
    
    return content;
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'weekly': {
        const weekDates = getCurrentWeekDates();
        return `Week of ${weekDates[0].toLocaleDateString()} - ${weekDates[6].toLocaleDateString()}`;
      }
      case 'semester':
        return getSemesterRange().name;
      default:
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const getCurrentViewEvents = () => {
    switch (viewMode) {
      case 'daily':
        return getEventsForDay(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
      case 'weekly': {
        const weekDates = getCurrentWeekDates();
        return scheduleEvents.filter(event => {
          const eventDate = new Date(event.year, event.month, event.date);
          return eventDate >= weekDates[0] && eventDate <= weekDates[6];
        });
      }
      case 'semester': {
        const semesterRange = getSemesterRange();
        return scheduleEvents.filter(event => 
          event.month >= semesterRange.start && 
          event.month <= semesterRange.end && 
          event.year === currentDate.getFullYear()
        );
      }
      default:
        return scheduleEvents.filter(event => 
          event.month === currentDate.getMonth() && 
          event.year === currentDate.getFullYear()
        );
    }
  };

  const downloadAsPDF = async () => {
    setIsExporting(true);
    try {
      // Find the main schedule content element
      const element = document.querySelector('[data-schedule-content]') as HTMLElement;
      if (!element) {
        throw new Error('Schedule content not found');
      }

      // Temporarily hide download buttons during capture
      const downloadButtons = document.querySelectorAll('.download-button, button[data-exclude-pdf]');
      const originalDisplay: string[] = [];
      downloadButtons.forEach((btn, index) => {
        const element = btn as HTMLElement;
        originalDisplay[index] = element.style.display;
        element.style.display = 'none';
      });

      // Use html2canvas to capture the visual layout
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
      });

      // Restore download buttons visibility
      downloadButtons.forEach((btn, index) => {
        const element = btn as HTMLElement;
        element.style.display = originalDisplay[index];
      });

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit PDF
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
      
      // Center the image on the page
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(30, 64, 175); // Orama blue color
      pdf.text('Orama Schedule', pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128); // Gray color
      pdf.text(getViewTitle(), pdfWidth / 2, 25, { align: 'center' });

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/png');
      
      // Adjust y position to account for title
      const adjustedY = Math.max(y, 30);
      const adjustedHeight = Math.min(imgHeight, pdfHeight - 35);
      
      pdf.addImage(imgData, 'PNG', x, adjustedY, imgWidth, adjustedHeight);

      // Save the PDF
      const title = getViewTitle();
      pdf.save(`Orama-Schedule-${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsImage = async () => {
    setIsExporting(true);
    try {
      // Find the main schedule content element
      const element = document.querySelector('[data-schedule-content]') as HTMLElement;
      if (!element) {
        throw new Error('Schedule content not found');
      }

      // Use html2canvas to capture the actual visual layout
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Could not generate image');
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Orama-Schedule-${getViewTitle().replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    setNewEvent({ 
      ...newEvent, 
      date: day.toString(),
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString()
    });
    setIsAddingEvent(true);
  };

  const getSemesterRange = () => {
    const month = currentDate.getMonth();
    if (month >= 1 && month <= 5) { // Feb-Jun (months 1-5)
      return { start: 1, end: 5, name: '1st Semester (Feb - Jun)' };
    } else { // Jul-Nov (months 6-10)  
      return { start: 6, end: 10, name: '2nd Semester (Jul - Nov)' };
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getEventsForDate = (date: Date) => {
    return scheduleEvents.filter(event => 
      event.date === date.getDate() && 
      event.month === date.getMonth() &&
      event.year === date.getFullYear()
    );
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white', 
      red: 'bg-red-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      pink: 'bg-pink-500 text-white',
      yellow: 'bg-yellow-500 text-black',
      cyan: 'bg-cyan-500 text-white',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white';
  };

  const getBackgroundColor = (color: string) => {
    const backgroundMap = {
      blue: '#dbeafe',
      green: '#dcfce7',
      red: '#fee2e2',
      orange: '#fed7aa',
      purple: '#f3e8ff',
      pink: '#fce7f3',
      yellow: '#fef3c7',
      cyan: '#cffafe',
    };
    return backgroundMap[color as keyof typeof backgroundMap] || '#f3f4f6';
  };

  const renderDailyView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDay(currentDate.getDate());
    
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {hours.map(hour => (
              <div key={hour} className="flex border-b border-gray-200 hover:bg-gray-50">
                <div className="w-20 p-2 text-sm text-gray-600 border-r border-gray-200">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 min-h-12">
                  {dayEvents
                    .filter(event => event.time && parseInt(event.time.split(':')[0]) === hour)
                    .map(event => (
                      <div 
                        key={event.id} 
                        onClick={() => handleEditEvent(event)}
                        className={`inline-block px-2 py-1 rounded text-xs text-white mr-2 cursor-pointer hover:opacity-80 ${getColorClasses(event.color)}`}
                        title="Click to edit"
                      >
                        {event.title} ({event.time})
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getCurrentWeekDates();
    
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-gray-300">
            <div className="p-3 text-sm font-medium text-gray-600 border-r">Time</div>
            {weekDates.map((date, index) => (
              <div key={index} className="p-3 text-sm font-medium text-gray-600 text-center border-r last:border-r-0">
                <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-2 text-xs text-gray-600 border-r border-gray-200">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {weekDates.map((date, dayIndex) => {
                  const dayEvents = getEventsForDate(date)
                    .filter(event => event.time && parseInt(event.time.split(':')[0]) === hour);
                  return (
                    <div key={dayIndex} className="p-1 border-r border-gray-100 last:border-r-0 min-h-10">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          onClick={() => handleEditEvent(event)}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate mb-1 cursor-pointer hover:opacity-80 ${getColorClasses(event.color)}`}
                          title="Click to edit"
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSemesterView = () => {
    const semesterRange = getSemesterRange();
    const months = [];
    
    for (let month = semesterRange.start; month <= semesterRange.end; month++) {
      months.push(new Date(currentDate.getFullYear(), month, 1));
    }
    
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{semesterRange.name}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPeriod}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {months.map((monthDate, index) => {
              const monthEvents = scheduleEvents.filter(event => 
                event.month === monthDate.getMonth() && event.year === monthDate.getFullYear()
              );
              
              return (
                <div key={index} className="border rounded-lg p-3">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {monthEvents.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No events</p>
                    ) : (
                      monthEvents.map(event => (
                        <div 
                          key={event.id} 
                          onClick={() => handleEditEvent(event)}
                          className={`text-xs px-2 py-1 rounded text-white cursor-pointer hover:opacity-80 ${getColorClasses(event.color)}`}
                          title="Click to edit"
                        >
                          {monthDate.toLocaleDateString('en-US', { month: 'short' })} {event.date} - {event.title}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderListView = () => {
    const sortedEvents = [...scheduleEvents].sort((a, b) => a.date - b.date);
    
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle>Schedule List - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No events scheduled. Click "Add Schedule" to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedEvents.map(event => (
                <div 
                  key={event.id} 
                  onClick={() => handleEditEvent(event)}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded-full ${getColorClasses(event.color).split(' ')[0]}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {monthNames[event.month]} {event.date}, {event.year}
                      {event.time && ` at ${event.time}`}
                      {event.location && ` - ${event.location}`}
                      {event.isRecurring && ` (${event.recurringType})`}
                    </div>
                  </div>
                  <Badge className={`${getColorClasses(event.color)} border-0`}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getEventsForDay = (day: number, month?: number, year?: number) => {
    return scheduleEvents.filter(event => 
      event.date === day && 
      event.month === (month ?? currentDate.getMonth()) &&
      event.year === (year ?? currentDate.getFullYear())
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();
    
    // Previous month's trailing days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDayOfMonth + i + 1).getDate();
      days.push(
        <div key={`prev-${i}`} className="h-24 p-1 text-gray-400 text-xs border border-gray-200">
          <div className="font-medium">{prevMonthDate}</div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const dayEvents = getEventsForDay(day);
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 p-1 text-xs border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.length === 0 && (
              <div className="text-xs text-gray-400 italic mt-2">
                Click to add event
              </div>
            )}
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
                className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 ${getColorClasses(event.color)}`}
                title={`Click to edit: ${event.title} ${event.time ? `@ ${event.time}` : ''}`}
              >
                • {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      days.push(
        <div key={`next-${day}`} className="h-24 p-1 text-gray-400 text-xs border border-gray-200">
          <div className="font-medium">{day}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
              My Schedules
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Manage your academic schedule and track your classes</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              onClick={downloadAsPDF}
              disabled={isExporting}
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white download-button flex-1 sm:flex-none text-xs sm:text-sm"
              data-exclude-pdf="true"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {isExporting ? 'Exporting...' : 'PDF'}
            </Button>
            <Button 
              onClick={downloadAsImage}
              disabled={isExporting}
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white download-button flex-1 sm:flex-none text-xs sm:text-sm"
              data-exclude-pdf="true"
            >
              <FileImage className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {isExporting ? 'Exporting...' : 'Image'}
            </Button>
            <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
              <DialogTrigger asChild>
                <Button className="bg-orama-primary hover:bg-orama-primary-light text-white flex-1 sm:flex-none text-xs sm:text-sm">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Day</Label>
                      <Input
                        id="date"
                        value={newEvent.date}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                            setNewEvent({ ...newEvent, date: value });
                          }
                        }}
                        placeholder="Day (1-31)"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="month">Month</Label>
                      <Input
                        id="month"
                        value={newEvent.month}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                            setNewEvent({ ...newEvent, month: value });
                          }
                        }}
                        placeholder="Month (1-12)"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={newEvent.year}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '' || (parseInt(value) >= 2024 && parseInt(value) <= 2099)) {
                            setNewEvent({ ...newEvent, year: value });
                          }
                        }}
                        placeholder="Year"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Time (Optional)</Label>
                      <Input
                        id="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        placeholder="e.g. 10:00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Event Type</Label>
                      <Select value={newEvent.type} onValueChange={(value: ScheduleEvent['type']) => setNewEvent({ ...newEvent, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Lecture</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="culture">Culture</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Select value={newEvent.color} onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${color.bg}`}></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={newEvent.isRecurring}
                        onChange={(e) => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isRecurring">Recurring Event</Label>
                    </div>
                  </div>
                  {newEvent.isRecurring && (
                    <div>
                      <Label htmlFor="recurringType">Recurring Type</Label>
                      <Select value={newEvent.recurringType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setNewEvent({ ...newEvent, recurringType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    {editingEvent ? (
                      <>
                        <Button onClick={handleUpdateEvent} className="flex-1 bg-orama-primary hover:bg-orama-primary-light">
                          Update Event
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDeleteEvent(editingEvent.id);
                            setEditingEvent(null);
                            setIsAddingEvent(false);
                          }} 
                          className="flex-1"
                        >
                          Delete Event
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleAddEvent} className="flex-1 bg-orama-primary hover:bg-orama-primary-light">
                        {newEvent.isRecurring ? 'Add Recurring Events' : 'Add Event'}
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => {
                      setIsAddingEvent(false);
                      setEditingEvent(null);
                      setNewEvent({ 
                        title: '', date: '', month: '', year: '', time: '', 
                        type: 'lecture', color: 'blue', location: '', 
                        isRecurring: false, recurringType: 'weekly' 
                      });
                    }} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* View Mode Selector */}
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'semester'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'outline'}
                onClick={() => setViewMode(mode)}
                className={viewMode === mode ? 'bg-orama-primary hover:bg-orama-primary-light' : 'border-orama-primary text-orama-primary hover:bg-orama-primary hover:text-white'}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          {/* Display Mode Selector */}
          <div className="flex gap-2">
            {(['grid', 'list'] as const).map((mode) => (
              <Button
                key={mode}
                variant={displayMode === mode ? 'default' : 'outline'}
                onClick={() => setDisplayMode(mode)}
                className={displayMode === mode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white'}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          {/* Color Selector */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-orama-primary" />
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color.bg}`}></div>
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main View Content */}
        <div data-schedule-content>
        {displayMode === 'list' ? (
          renderListView()
        ) : viewMode === 'daily' ? (
          renderDailyView()
        ) : viewMode === 'weekly' ? (
          renderWeeklyView()
        ) : viewMode === 'semester' ? (
          renderSemesterView()
        ) : (
          /* Monthly Grid View (Default) */
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl uppercase tracking-wider">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevPeriod}
                    className="text-white hover:bg-white/20 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPeriod}
                    className="text-white hover:bg-white/20 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Week Day Headers */}
              <div className="grid grid-cols-7 bg-gray-100">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="py-3 text-center font-semibold text-gray-600 text-sm border-r border-gray-300 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-4">
        {/* Key Notes */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">Key Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduleEvents.length === 0 ? (
              <p className="text-sm text-purple-100 italic">No events scheduled yet. Click on a date to add your first event!</p>
            ) : (
              scheduleEvents.filter(event => event.type === 'lecture' || event.type === 'work').slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <span className="text-sm">{event.title} {event.time && `@${event.time}`}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Work Shifts */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-700">Work Shifts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workShifts.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No work shifts scheduled. Add work events to see them here.</p>
            ) : (
              workShifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: getBackgroundColor(shift.color)}}>
                  <div>
                    <div className="font-medium text-gray-700">{shift.title}</div>
                    <div className="text-sm text-gray-500">{shift.day} - {shift.time}</div>
                  </div>
                  <div className={`w-3 h-8 rounded-full ${getColorClasses(shift.color).split(' ')[0]}`}></div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-700">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleEvents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No events to display</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Events:</span>
                  <Badge className="bg-orama-primary">{scheduleEvents.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tests & Exams:</span>
                  <Badge className="bg-red-500">{scheduleEvents.filter(e => e.type === 'test' || e.type === 'exam').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assignments:</span>
                  <Badge className="bg-orange-500">{scheduleEvents.filter(e => e.type === 'assignment').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lectures:</span>
                  <Badge className="bg-blue-500">{scheduleEvents.filter(e => e.type === 'lecture').length}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MySchedules;
