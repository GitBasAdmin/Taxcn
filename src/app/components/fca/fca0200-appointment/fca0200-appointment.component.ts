import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-fca0200-appointment',
  templateUrl: './fca0200-appointment.component.html',
  styleUrls: ['./fca0200-appointment.component.css']
})
export class Fca0200AppointmentComponent implements OnInit {
  visibleAppointment:boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @Input() set visibleApp(visibleApp: boolean) {
    this.visibleAppointment=visibleApp;
  }
  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    //this.rerender();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next('');
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next('');
    }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

}
