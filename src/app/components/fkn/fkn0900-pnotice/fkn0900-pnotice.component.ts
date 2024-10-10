import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-fkn0900-pnotice,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0900-pnotice.component.html',
  styleUrls: ['./fkn0900-pnotice.component.css']
})


export class Fkn0900PnoticeComponent implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  delList: any = [];
  search: any;
  delValue: any;
  delValue2: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  programName: string;
  dep_code: any;
  dep_name: any;

  Datalist: any;
  defaultnoticeType: any;

  pData: any;
  searchFlag:boolean =false;
  tableData: any;



  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public dataSendHead:any
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  public loadModalComponent: boolean = false;

  @Input() set sendData(sendData: any) {
    console.log(sendData);
    this.tableData = sendData;
    if(typeof this.tableData !='undefined'){
      this.searchData(this.tableData);
    }
  }

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}]
    };
  }

  private getDataUser = () => {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }

    return userData
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
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  searchData(student:any){
    this.userData=this.getDataUser();

    this.SpinnerService.show();

    this.http.post('/' + this.userData.appName + 'ApiKN/API/KEEPN/fkn0900/getNotice', student.sendData,).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        if (productsJson.result == 1) {
          this.pData = productsJson.data;
          this.pData.forEach((ele, index, array) => {
            ele.tmp_create_date = ele.log_create_date ? myExtObject.conDate(ele.log_create_date) : '';
          });
        } else {
          this.pData=[];
        }
        this.rerender();
        this.SpinnerService.hide();
      },
      (error) => { this.SpinnerService.hide(); }
    );
  }

  closeModal(){
  }
}
