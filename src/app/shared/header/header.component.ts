import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string = ''
  @Input() isEdit:any;
  @Output() delete_emp = new EventEmitter<string>();

  delete(){
    this.delete_emp.emit();
  }

}
