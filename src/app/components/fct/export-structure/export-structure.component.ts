import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-export-structure,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './export-structure.component.html',
  styleUrls: ['./export-structure.component.css']
})

export class ExportStructureComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';
  posts:any;
  delList:any=[];
  sessData:any;
  userData:any;
  programName:string;
  Datalist:any;
  result:any=[];
  displayTable:any;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.getData();
    //======================== authen =========
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "export_structure"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
  }

  getData(){
    this.SpinnerService.show();
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiCT/API/exportStructure', student).subscribe(posts => {
      let getDataOptions : any = JSON.parse(JSON.stringify(posts));
      console.log(getDataOptions.data);
      if(getDataOptions.result==1){
        this.displayTable = getDataOptions.data;
        this.SpinnerService.hide();
      }else{
        this.displayTable="";
        this.SpinnerService.hide();
      }
      
    });
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next(null);
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      // this.dtTrigger.unsubscribe();
    }
}
