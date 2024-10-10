import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-fud0100-tab4',
  templateUrl: './fud0100-tab4.component.html',
  styleUrls: ['./fud0100-tab4.component.css']
})
export class Fud0100Tab4Component implements OnInit {
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    console.log(getDataHead)
  }
  @Input() set sendEdit(sendEdit: any) {//รับจาก fju0100
    console.log(sendEdit)
    //if(typeof sendEdit !='undefined')
      //this.editData(sendEdit);
  }
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  constructor() { }

  ngOnInit(): void {
    this.dtOptions2 = {
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
    this.dtTrigger.next(null);
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

}
