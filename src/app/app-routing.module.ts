import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeesComponent } from './add-employees/add-employees.component';
import { CalenderComponent } from './calender/calender.component';

const routes: Routes = [
  {path:'',redirectTo:'/list',pathMatch:'full'},
  {path:'list',component:EmployeeListComponent},
  {path:'add',component:AddEmployeesComponent},
  {path:'calender',component:CalenderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
