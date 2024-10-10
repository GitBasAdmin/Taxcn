import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Inject, Injectable,OnChanges,Input,ChangeDetectorRef,AfterContentInit   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkn0720,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0720.component.html',
  styleUrls: ['./fkn0720.component.css']
})


export class Fkn0720Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  title = 'datatables';
  
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  caseCateId :any;
  caseCateName :any;
  caseCateFlag :any;
  caseType:any;
  courtFee:any;
  courtProvince:any;
  dataHead:any;

  displaySectionB:boolean=false;
  displaySectionC:boolean=false;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){
    //this.parentFormGroup.valueChanges.subscribe(console.log);
    
   }
   
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkn0720"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
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
  ngAfterContentInit(): void{

  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
  }


  receiveCaseCateId(event:any){
    //console.log(event)
    this.caseCateId = event;
  }

  receiveCaseCateName(event:any){
    //console.log(event)
    this.caseCateName = event;
  }
  receiveCaseCateFlag(event:any){
    //console.log(event)
    this.caseCateFlag = event;
  }

  receiveCaseType(event:any){
    //console.log(event)
    this.caseType = event;
  }


}







