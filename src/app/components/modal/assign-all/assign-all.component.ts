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
  selector: 'app-assign-all',
  templateUrl: './assign-all.component.html',
  styleUrls: ['./assign-all.component.css']
})
export class AssignAllComponent implements OnInit {
  @Input() items: any = [];
  @Input() run_seq: number;//run_id

  dtTrigger: Subject<any> = new Subject<any>();
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm', { static: true }) modalForm: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;

  formList: FormGroup;
  sessData: any;
  userData: any;
  result: any = [];
  arrData: any = [];
  getCaseType = [];
  getTitle = [];
  getRedTitle = [];
  getDocType: any;
  getSendFlag: any;
  myExtObject: any;
  getDepId: any;
  getRcvUserId: any;
  
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  states: any = [];

  getParent :any;
  getDepCode :any;
  getProgram :any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public listFieldSelect: any;

  public loadComponent1: boolean = false;
  @ViewChild('openbutton1', { static: true }) openbutton1: ElementRef;
  @ViewChild('closebutton1', { static: true }) closebutton1: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild('stateInput', { static: true }) stateInput: ElementRef;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.stateCtrl = new FormControl();
  }

  ngOnInit(): void {

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result=[];
    // $("#exampleModal").find(".modal-header").html("<span>assign-all</span>");

    var student = JSON.stringify({
      "table_name": "pdepartment",
      "field_id": "dep_code",
      "field_name": "dep_name",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getDepCode = getDataOptions;
      },
      (error) => { this.SpinnerService.hide(); }
    )

    var student = JSON.stringify({
      "table_name": "pprogram",
      "field_id": "program_id",
      "field_name": "program_name",
      "field_name2": "url_name",
      "order_by" : " program_name ASC ",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getProgram = getDataOptions;
      },
      (error) => { this.SpinnerService.hide(); }
    )

    var student = JSON.stringify({
      "table_name": "pprogram",
      "field_id": "program_id",
      "field_name": "program_name",
      "condition": "AND main_menu_flag IN('S', 'Y')",
      "order_by" : " program_name ASC ",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getParent = getDataOptions;
      },
      (error) => { this.SpinnerService.hide(); }
    )
  
  }

  filterStates(name: string) {
      return this.states.filter((state: any) => state.fieldNameValue.includes(name));
  }

  onEnter(event: any) {
    // console.log(event);
      if (event.fieldIdValue){
        this.result.rea_id = event.fieldIdValue;
        this.result.reason = this.stateInput.nativeElement.value;
      }else{
        this.result.rea_id = "";
        this.result.reason = "";
      }
  }

  ClearAll() {
    this.result=[];
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  // clicksendDoc(event:any){
  //   this.result.send_doc_flag = event.target.checked;
  //   if (this.result.send_doc_flag) {
  //     this.result.dep_id = this.userData.depCode;
  //     this.result.dep_name = this.userData.depName;
  //   }else{
  //     this.result.dep_id = "";
  //     this.result.dep_name = "";
  //   }
  // }

  onClickSaveData(): void {
    if(!this.result.program_id){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุหน้าจอ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else{
      if(this.result.dep_code)
        this.result.dep_code = this.result.dep_code.toString();
      this.onClickList.emit(this.result)
    }
  }
}