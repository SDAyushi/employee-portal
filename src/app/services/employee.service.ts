import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { Employee } from '../employee-dtos/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private db = localforage.createInstance({
    name: 'employeeDB',
    storeName: 'employees'
  });

  constructor() { }

   // Add Employee
   addEmployee(employee: Employee): Promise<void> {
    return this.db.setItem(employee.id, employee).then(() => {
    });
  }

  // Get All Employees
  getAllEmployees(): Promise<Employee[]> {
    return this.db.keys().then((keys) => {
      const employeePromises = keys.map(key => this.db.getItem<Employee>(key));
      return Promise.all(employeePromises).then((employees) => {
        // Filter out any null values
        return employees.filter((employee): employee is Employee => employee !== null);
      });
    });
  }
  

  // Edit Employee
  editEmployee(employee: Employee): Promise<void> {
    return this.db.setItem(employee.id, employee).then(() => {
      // Return nothing (void)
    });
  }

  // Delete Employee
  deleteEmployee(id: string): Promise<void> {
    return this.db.removeItem(id).then(() => {
      // Return nothing (void)
    });
  }
}

