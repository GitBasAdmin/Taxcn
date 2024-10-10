import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList  } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var myExtObject: any;
@Component({
  selector: 'app-fca0800-tab3',
  templateUrl: './fca0800-tab3.component.html',
  styleUrls: ['./fca0800-tab3.component.css']
})
export class Fca0800Tab3Component implements OnInit {
  myExtObject: any;
  headData:any;
  caseTypeValue:any;
  getJudgeBy:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if(typeof getTab !='undefined' && getTab.index==1){
      myExtObject.callCalendar();
    }
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100-main
    console.log(getDataHead)
    if(typeof getDataHead !='undefined'){
      this.headData = getDataHead;
      this.caseTypeValue = this.headData.case_type;
      //this.getAppealJudgeData(0);
    }
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
    this.getJudgeBy = [
    {fieldIdValue:1,fieldNameValue: 'ห้องพิจารณา'},
    {fieldIdValue:2,fieldNameValue: 'ต่างจังหวัด'},
    {fieldIdValue:3,fieldNameValue: 'VDO conference'},
    {fieldIdValue:4,fieldNameValue: 'Net meeting'}];
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
