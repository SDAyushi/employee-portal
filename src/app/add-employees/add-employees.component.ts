import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from '../employee-dtos/employee';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { CalenderComponent } from '../calender/calender.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.scss'],
})
export class AddEmployeesComponent {
  @ViewChild('secondCalendar') secondCalendar?: CalenderComponent;
  form: NgForm | undefined;
  employee: Employee = { id: '', name: '', type: '', joinDate: '', tillDate: '' };
  selectedDate: Date | null = new Date();
  tillselectedDate: any;
  isEditMode = false;
  id: any;

  constructor(private employeeService: EmployeeService, private router: Router,private activatedRoute:ActivatedRoute,private snackBar: MatSnackBar) {
    this.activatedRoute.queryParamMap.subscribe((res:any) =>{
      this.id = res.params?.id      
        })
  }

  ngOnInit(): void {
    const employeeToEdit = history.state.employeeToEdit;

    if (employeeToEdit) {
      this.isEditMode = true;
      this.employee = { ...employeeToEdit };

      // Convert string dates to Date objects
      this.selectedDate = employeeToEdit.joinDate ? new Date(employeeToEdit.joinDate) : null;
      this.tillselectedDate = employeeToEdit.tillDate ? new Date(employeeToEdit.tillDate) : null;
    } else {
      this.employee.id = 'emp-' + Math.random().toString(36).substr(2, 9);
      this.selectedDate = new Date(); // Default to today for new employees
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.employee.joinDate = this.selectedDate;
      this.employee.tillDate = this.isValidDate(this.tillselectedDate) ? this.tillselectedDate : null;

      if (this.isEditMode) {
        this.employeeService.editEmployee(this.employee).then(() => {
          this.openSnackBar('✓ Employee details updated successfully', true);
          form.reset();
          this.router.navigateByUrl('/list');
        }).catch(err => {
          console.error(err);
          this.openSnackBar('✕ Failed to update employee details', false);
        });
      } else {
        this.employeeService.addEmployee(this.employee).then(() => {
          this.openSnackBar('✓ Employee added successfully', true);
          form.reset();
          this.router.navigateByUrl('/list');
        }).catch(err => {
          console.error(err);
          this.openSnackBar('✕ Failed to add employee', false);
        });
      }
    }
  }

  openSnackBar(message: string, isSuccess: boolean = true) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isSuccess ? ['success-snackbar', 'custom-snackbar'] : ['error-snackbar', 'custom-snackbar']
    });
  }

  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  cancel() {
    console.log('Form cancelled');
    this.router.navigateByUrl('/list');
  }

  handleNoDateSelected(date: string) {
    console.log(date);
    this.tillselectedDate = date ? new Date(date) : null;
  }


  handleDateSelected(date: string) {
    console.log(date);
    this.selectedDate = date ? new Date(date) : null;
    this.resetSecondCalendar();
  }
  resetSecondCalendar() {
    if (this.secondCalendar) {
      this.tillselectedDate = null;
      this.secondCalendar.selectedDate = null;
      this.secondCalendar.currentMonthDate = 'No Date';
    }
  }

  deleteEmployee(): void {
    this.employeeService.deleteEmployee(this.id).then(() => {
      this.openSnackBar('✓ Employee deleted successfully', true);
      this.router.navigateByUrl('/list');
    }).catch(err => {
      console.error(err);
      this.openSnackBar('✕ Failed to delete employee', false);
    });
  }
}
