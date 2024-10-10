import { Component, OnInit ,Output ,ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,EventEmitter, Input} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-fco0400-main',
  templateUrl: './fco0400-main.component.html',
  styleUrls: ['./fco0400-main.component.css']
})
export class Fco0400MainComponent implements AfterViewInit, OnInit, OnDestroy {
  widthSet:any;
  caseData:any;
  onUpdateCase:any;
  param:any;

  @Input() set sendParam(sendParam: any) {
    if(sendParam){
      this.param = sendParam;
    }
  }
  
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
 
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  constructor(
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    assignWidth(obj:any){
      console.log(obj.index)
      if(obj.index==0)
        this.widthSet="100%";
      else if(obj.index==1)
        this.widthSet="3050px";
      else if(obj.index==2)
        this.widthSet="3050px";
        else if(obj.index==3)
        this.widthSet="3050px";
      else if(obj.index==4)
        this.widthSet="100%";
    }

  fnDataHead(event:any){
    this.caseData = event;
  }

  receiveObjData(event:any){
    this.onUpdateCase = event;
  }
}
