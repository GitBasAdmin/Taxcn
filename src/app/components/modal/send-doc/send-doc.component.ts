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
  selector: 'app-send-doc',
  templateUrl: './send-doc.component.html',
  styleUrls: ['./send-doc.component.css']
})
export class SendDocComponent implements OnInit {
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
    this.getData();
    
    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name": "pdepartment", 
      "field_id": "dep_code", 
      "field_name": "dep_name", 
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDepId = getDataOptions;
      },
      (error) => {}
    )
    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name": "pofficer", 
      "field_id": "off_id", 
      "field_name": "off_name", 
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getRcvUserId = getDataOptions;
      },
      (error) => {}
    )

    this.getSendFlag = [{ fieldIdValue: 1, fieldNameValue: 'สำนวน' }, { fieldIdValue: 2, fieldNameValue: 'กากสำนวน' }, { fieldIdValue: 3, fieldNameValue: 'อื่นๆ' }];

    var student = JSON.stringify({
      "table_name": "prea_sendcase", 
      "field_id": "rea_id", 
      "field_name": "rea_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        //===================================
        // console.log(getDataOptions);
        getDataOptions.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
        this.states = getDataOptions;
        this.filteredStates = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(state => state ? this.filterStates(state) : this.states.slice())
        );
        //===================================
      },
      (error) => { }
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

  getData(){
    if(this.run_seq){
      var student = JSON.stringify({
        "run_seq": this.run_seq,
        "in_out": 1,//
        "userToken": this.userData.userToken
      });
      //console.log(student)
      this.http.post('/crimApiCO/API/CORRESP/fco0300/getDocData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          // console.log(productsJson.data[0]);
          this.result = productsJson.data[0];
          this.setDefForm();
        },
        (error) => {}
      )
    }
  }

  setDefForm() {
    this.result.send_flag = 1;
    this.result.event_date = myExtObject.curDate();
    this.result.event_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.dep_id = this.userData.depCode;
    this.result.dep_name = this.userData.depName;
    this.result.rcv_user_id = this.userData.userCode;
    this.result.rcv_user = this.userData.offName;
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  ClearAll() {
    this.ngOnInit();
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  clicksendDoc(event:any){
    this.result.send_doc_flag = event.target.checked;
    if (this.result.send_doc_flag) {
      this.result.dep_id = this.userData.depCode;
      this.result.dep_name = this.userData.depName;
    }else{
      this.result.dep_id = "";
      this.result.dep_name = "";
    }
  }

  onClickSaveData(): void {
    if(!this.result.dep_id){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนข้อมูลปลายทาง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });

    }else{

      if(this.result.dep_id)
        this.result.dep_name = this.getDepId.find((x:any) => x.fieldIdValue === this.result.dep_id).fieldNameValue;
      else
      this.result.dep_name = "";
      
      if(this.result.rcv_user_id)
        this.result.rcv_user = this.getRcvUserId.find((x:any) => x.fieldIdValue === this.result.rcv_user_id).fieldNameValue;
      else
        this.result.rcv_user = "";

      var doc_no = this.result.run_doc_title+this.result.run_doc_id+'/'+this.result.run_doc_yy;
      if(this.stateInput.nativeElement.value)
        this.result.reason = this.stateInput.nativeElement.value;

      // console.log(this.result);
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการส่งหนังสือรับเลขที่ '+doc_no+" ไปยังหน่วยงาน"+this.result.dep_name);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.onClickList.emit(this.result)
        }
        subscription.unsubscribe();
      });

      
    }
  }

  tabChangeSelect(objId: any, objName: any, event: any) {
    if(objId=="rea_id"){
      var student = JSON.stringify({
        "table_name": "prea_sendcase", 
        "field_id": "rea_id", 
        "field_name": "rea_desc",
        "condition": " AND rea_id='"+ event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    }
    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        if (getDataOptions.length) {
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;
          this.stateInput.nativeElement.value = getDataOptions[0].fieldNameValue;
        } else {
          this.result[objId] = "";
          this.result[objName] = "";
          this.stateInput.nativeElement.value = "";
        }
      },
      (error) => { }
    )
  }

  changeDep(event:any){
    this.result.rcv_user_id = '';
    
    var student = JSON.stringify({
      "table_name": "pofficer", 
      "field_id": "off_id", 
      "field_name": "off_name",
      "condition": " AND dep_code='"+ event + "' ",
      "userToken": this.userData.userToken
    });

    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getRcvUserId = getDataOptions;
      },
      (error) => { }
    )
  }

  clickOpenMyModalComponent() {
    this.openbutton1.nativeElement.click();
  }

  loadMyModalComponent() {
    var student = JSON.stringify({
      "table_name": "prea_sendcase", 
      "field_id": "rea_id", 
      "field_name": "rea_desc", 
      "userToken": this.userData.userToken
    });

    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
      (response) => {
        this.list = response;
        this.listTable = 'prea_sendcase';
        this.listFieldId = 'rea_id';
        this.listFieldName = 'rea_desc';

        this.loadComponent1 = true;
        $("#exampleModal1").find(".modal-content").css("display", "");
      },
      (error) => { }
    )
  }

  receiveFuncListData(event: any) {
    this.result.rea_id = event.fieldIdValue;
    this.result.reason = event.fieldNameValue;
    this.closebutton1.nativeElement.click();
  }

  closeModal() {
    this.loadComponent1 = false;
    $("#exampleModal1").find(".modal-content").css("display", "none");

  }
}