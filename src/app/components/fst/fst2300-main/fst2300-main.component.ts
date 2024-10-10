import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-fst2300-main',
  templateUrl: './fst2300-main.component.html',
  styleUrls: ['./fst2300-main.component.css']
})
export class Fst2300MainComponent implements AfterViewInit, OnInit, OnDestroy {
  caseData:any;
  widthSet:any;
  onUpdateData:any;
  tab_index:any;

  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @Output() eventUpdate = new EventEmitter<any>();
  @Input() set sendCaseData(sendCaseData: any) {
    // console.log(sendCaseData)
    if(sendCaseData){
      sendCaseData.sendData['tab_index'] = this.tab_index;
      this.caseData = sendCaseData;
    }
  }

  constructor(
  ) { }

  ngOnInit(): void {
    this.tab_index = 0;
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
    // console.log(obj.index)
    this.tab_index = obj.index;

    if(obj.index==0)
      this.widthSet="100%";
    else if(obj.index==1)
      this.widthSet="100%";
    else if(obj.index==2)
      this.widthSet="3050px";
      else if(obj.index==3)
      this.widthSet="3050px";
    else if(obj.index==4)
      this.widthSet="100%";
  }

  receiveEventData(event:any){
    // console.log(event)
    this.eventUpdate.emit(event);
  }
}
