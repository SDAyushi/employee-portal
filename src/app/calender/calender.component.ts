import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent {
  @Output() dateSelected = new EventEmitter<string>();
  @Output() NodateSelected = new EventEmitter<string>();
  @Input() isSecondaryCalendar: boolean = false;
  @Input() initialDate: Date | null = null; // Add this input
  @Output() onDateSaved = new EventEmitter<void>();
  @Input() disableToday: boolean = false;
  weeks: Date[][] = [];
  currentDate = new Date();
  selectedDate: Date | null = null;  // Initialize as null for secondary calendar
  currentMonthDate: string = '';
  currentMonth: number;
  currentYear: number;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  @Input() minDate: Date | null = null; // Minimum date for the calendar
  id: any;
  menuConfig = {
    backdropClass: 'cdk-overlay-dark-backdrop',
    panelClass: 'calendar-menu'
  };
  constructor(private activatedRoute:ActivatedRoute) {
    this.activatedRoute.queryParamMap.subscribe((res:any) =>{
     this.id = res.params?.id      
       })
    
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit() {
    if (this.initialDate && this.id) {
      this.selectedDate = new Date(this.initialDate);
      this.currentMonth = this.selectedDate.getMonth();
      this.currentYear = this.selectedDate.getFullYear();
      this.currentMonthDate = moment(this.selectedDate).format('DD MMM YYYY');
    } else if (!this.isSecondaryCalendar) {
      this.selectedDate = this.getToday();
      this.currentMonthDate = 'Today';
    } else {
      this.currentMonthDate = 'No Date';
    }
    this.generateCalendar();
  }

  generateCalendar() {
    this.weeks = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
  
    let currentWeek = new Array(7).fill(null);
    let dayOfWeek = firstDay.getDay();
    let currentDate = new Date(firstDay);
    currentDate.setDate(currentDate.getDate() - dayOfWeek);
  
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek[i] = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    currentDate = new Date(firstDay);
    while (currentDate <= lastDay) {
      dayOfWeek = currentDate.getDay();
  
      if (dayOfWeek === 0 && currentWeek.some(d => d !== null)) {
        this.weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
  
      currentWeek[dayOfWeek] = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    if (currentWeek.some(d => d !== null)) {
      for (let i = dayOfWeek + 1; i < 7; i++) {
        currentWeek[i] = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.weeks.push(currentWeek);
    }
  }

  selectDate(event: MouseEvent, date: Date) {
    event.stopPropagation();
    if (this.isSecondaryCalendar && this.isTodayDisabled() && this.isToday(date)) {
      return; // Prevent selecting today if it's disabled
    }
    this.selectedDate = date;
  }

  previousMonth(event: MouseEvent) {
    event.stopPropagation();
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(event: MouseEvent) {
    event.stopPropagation();
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    if (!date || !this.selectedDate) return false;
    return date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth;
  }

  getToday() {
    return new Date();
  }

  getNextMonday() {
    const day = this.currentDate.getDay();
    const diff = (8 - day) % 7;
    return new Date(this.currentDate.getTime() + diff * 24 * 60 * 60 * 1000);
  }

  getNextTuesday() {
    const day = this.currentDate.getDay();
    const diff = (9 - day) % 7;
    return new Date(this.currentDate.getTime() + diff * 24 * 60 * 60 * 1000);
  }

  getAfterOneWeek() {
    return new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  save() {
    this.currentMonthDate = moment(this.selectedDate).format('DD MMM YYYY');    
    if (!this.selectedDate) {
      this.NodateSelected.emit('No Date');
      this.currentMonthDate = 'No Date'
    } else {
      this.dateSelected.emit(this.currentMonthDate); 
      this.NodateSelected.emit((this.currentMonthDate));
      this.onDateSaved.emit(); // Emit when date is saved
    }
  }

  isDisabled(date: Date): boolean {
    if (!date || !this.minDate) return false;
  
    // Strip the time part (set hours to 00:00:00) to compare only date
    const strippedDate = new Date(date);
    strippedDate.setHours(0, 0, 0, 0);
  
    const strippedMinDate = new Date(this.minDate);
    strippedMinDate.setHours(0, 0, 0, 0);
  
    return strippedDate < strippedMinDate; // Disable dates before the selected date (excluding the selected date itself)
  }
  


  isTodayDisabled(): boolean {
    if (!this.minDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDate = new Date(this.minDate);
    minDate.setHours(0, 0, 0, 0);
    
    return today.getTime() < minDate.getTime();
  }

  calenderGrid(event:MouseEvent){
    event.stopPropagation();
  }

  noDate(event:MouseEvent){
    event.stopPropagation();
    this.selectedDate = null;
  }

  cancel(){
    if(this.isSecondaryCalendar){
      this.currentMonthDate = 'No Date';
      this.selectedDate = null
  }
  
  else{
    this.selectedDate = this.currentMonthDate == 'Today' ? new Date() : new Date(this.currentMonthDate);    
  }
  }
  
}
