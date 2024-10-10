import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { DataTableDirective } from 'angular-datatables';
import { Observable, of, Subject } from 'rxjs';
import { tap, map, catchError, startWith } from 'rxjs/operators';
declare var myExtObject: any;


@Component({
  selector: 'app-popup-send-document',
  templateUrl: './popup-send-document.component.html',
  styleUrls: ['./popup-send-document.component.css']
})
export class PopupSendDocComponent implements OnInit {
  @Input() items: any = [];
  @Input() case_running: number;//case_running

  dtTrigger: Subject<any> = new Subject<any>();
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm', { static: true }) modalForm: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;

  formList: FormGroup;
  sessData: any;
  userData: any;
  result: any = [];
  arrData: any = [];
  myExtObject: any;
  getRealDocTitle:any;


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public listFieldSelect: any;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.result = [];
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.genDocTitle();
  }

  genDocTitle() {
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/genDocTitle', student).subscribe(
      (response) => {
        let productsJson:any = JSON.parse(JSON.stringify(response));
        this.getRealDocTitle = productsJson.data;

        productsJson.data.forEach((ele, index, array) => {
          this.getRealDocTitle[index].fieldIdValue = ele.doc_title_id;
          this.getRealDocTitle[index].fieldNameValue = ele.doc_title;

          if (ele.dep_use == this.userData.depCode) {
            this.result.real_doc_title = ele.doc_title
            this.result.real_doc_id = ''
          }
        });
      },
      (error) => { }
    )
  }

  ClearAll() {
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
  }

  onClickSaveData(): void {
    this.onClickList.emit(this.result)
  }
}