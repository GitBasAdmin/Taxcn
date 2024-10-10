import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Fca0200Component } from 'src/app/components/fca/fca0200/fca0200.component';
@Component({
  selector: 'app-fco0300-case',
  templateUrl: './fco0300-case.component.html',
  styleUrls: ['./fco0300-case.component.scss']
})


export class Fco0300CaseComponent implements AfterViewInit, OnInit, OnDestroy {

  //@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
  sessData:any;
  userData:any;

  aCaseType:any;

  getTitle:any;
  getRedTitle:any;
  getCaseCate:any;
  getCourt:any;
  getCaseType:any;
  getCaseCourtType:any;
  getCaseStatus:any;
  getCaseSpecial:any;

  selTitle:any;
  selRedTitle:any;
  selCourt:any;
  selCaseType:any;
  selCaseCate:any;
  selCaseCourtType:any;
  selCaseStatus:any;

  hCaseType:any;

  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle : NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus : NgSelectComponent;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fca0200Service : Fca0200Component,
    //private config: NgSelectConfig
  ){ 
    //this.config.bindValue = 'value';
  }

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

  
}
