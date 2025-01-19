// employee-list.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Employee } from '../employee-dtos/employee';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];
  swipedEmployee: Employee | null = null;
  private touchStart: number = 0;
  private readonly SWIPE_THRESHOLD = 80;
  private deletedEmployee: Employee | null = null;
  isMobileOrTablet: boolean = false;
  today = new Date();

  constructor(
    private employeeService: EmployeeService, 
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize() {
    this.isMobileOrTablet = window.innerWidth <= 1024;
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  isJoinDateValid(joinDate: string): boolean {
    return new Date(joinDate) <= this.today;
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().then((data) => {
      this.employees = data;
      this.categorizeEmployees();
    });
  }

  categorizeEmployees(): void {
    this.currentEmployees = this.employees.filter(employee => !employee.tillDate || new Date(employee.tillDate) > new Date());
    this.currentEmployees.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
  
    this.previousEmployees = this.employees.filter(employee => employee.tillDate && new Date(employee.tillDate) <= new Date());
    this.previousEmployees.sort((a, b) => new Date(b.tillDate).getTime() - new Date(a.tillDate).getTime());
  }

  deleteEmployee(id: string): void {
    this.deletedEmployee = this.employees.find(emp => emp.id === id) || null;
    
    this.employeeService.deleteEmployee(id).then(() => {
      this.loadEmployees();
      if(this.isMobileOrTablet){
        this.showUndoSnackbar();
      }
    });
  }

  showUndoSnackbar() {
    const snackBarRef = this.snackBar.open('Employee data has been deleted', 'Undo', {
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      panelClass: ['delete-snackbar', 'success-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      if (this.deletedEmployee) {
        this.undoDelete(this.deletedEmployee);
      }
    });
  }

  undoDelete(employee: Employee) {
    this.employeeService.addEmployee(employee).then(() => {
      this.loadEmployees();
      this.snackBar.open('Employee restored successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
    });
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/add'], { 
      queryParams: { id: employee.id }, 
      state: { employeeToEdit: employee } 
    });
  }

  openDeleteDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: 'auto',
      maxWidth: '90vw',
      minWidth: '280px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEmployee(employee.id);
      }
    });
  }

  onTouchStart(event: TouchEvent, employee: Employee) {
    if (!this.isMobileOrTablet) return;
    this.touchStart = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent, employee: Employee) {
    if (!this.isMobileOrTablet || !this.touchStart) return;

    const touch = event.touches[0];
    const diff = this.touchStart - touch.clientX;

    if (diff > 0) {
      event.preventDefault();
      
      if (diff > this.SWIPE_THRESHOLD) {
        this.swipedEmployee = employee;
      }
    } else if (this.swipedEmployee === employee) {
      this.swipedEmployee = null;
    }
  }

  onTouchEnd(event: TouchEvent, employee: Employee) {
    if (!this.isMobileOrTablet) return;

    const touch = event.changedTouches[0];
    const diff = this.touchStart - touch.clientX;
    
    if (diff > this.SWIPE_THRESHOLD) {
      this.deleteEmployee(employee.id);
    }
    
    this.touchStart = 0;
    this.swipedEmployee = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
      if (!event.target.closest('.delete-action')) {
        this.swipedEmployee = null;
      }
    }
  }
}