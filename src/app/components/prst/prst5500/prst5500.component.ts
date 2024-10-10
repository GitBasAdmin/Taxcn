import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prst5500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prst5500.component.html',
  styleUrls: ['./prst5500.component.css']
})


export class Prst5500Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  title = 'datatables';


  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  result:any = [];
  tmpResult:any = [];
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  selCaseType:any;
  selCaseId:any;

  //---
  getDep:any;
  getPoffId:any;
  getOffId:any;
  getToId:any;
  getFlag:any;

  txt_date_start:any;
  txt_date_end:any;
  pcreate_dep_code:any;
  puser_post:any;
  phead_off_name:any;
  phead_off_id:any;
  puser_id:any;
  off_name:any;
  puser_to_id:any;
  puser_to:any;
  pChk4:any;
  pflag:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prst5500',{static: true}) prst5500 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.successHttp();
    //======================== pdepartment ======================================
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "field_name2" : "print_dep_name",
        "userToken" : this.userData.userToken
      });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getDep = getDataOptions;

          if(this.getDep.length!=0){
              this.pcreate_dep_code = this.userData.depCode;
              this.puser_post = this.userData.depName;
          }

      },
      (error) => {}
    )

    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getPoffId = getDataOptions;
          this.getOffId = getDataOptions;
          this.getToId = getDataOptions;

          if(this.getOffId.length!=0){
            this.puser_id = this.userData.userCode;
            this.off_name = this.userData.offName;
        }
      },
      (error) => {}
    )

    this.getFlag = [{fieldIdValue:1,fieldNameValue: 'ผลงานแผนก'},
                    {fieldIdValue:2,fieldNameValue: 'ผลงานรายบุคคล'},
                    {fieldIdValue:3,fieldNameValue: 'ผลงานส่งสำนวน'},
                    {fieldIdValue:4,fieldNameValue: 'ผลงานเพิ่มเติม (ไม่อยู่ในระบบ)'}];
    this.pflag = 3;

  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prst5500"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          // console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          this.defaultTitle = getDataAuthen.defaultTitle;
          this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ClearAll(){
    window.location.reload();
  }

  directiveDate(date:any,obj:any){
    this[obj] = date;
    // console.log("directiveDate", this[obj]);
  }


  printReport(){
    var rptName = 'rst5520';

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!myExtObject.conDate($("#txt_date_start").val())){
      confirmBox.setMessage('กรุณาระบุข้อมูลตั้งแต่วันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          //this.setFocus('req_send_id');
        }
        subscription.unsubscribe();
      });

    }else if(!myExtObject.conDate($("#txt_date_end").val())){
      confirmBox.setMessage('กรุณาระบุข้อมูลถึงวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          //this.setFocus('req_send_name');
        }
        subscription.unsubscribe();
      });
    }else{

      // var paramData ='{}';
      // if(typeof(this.txt_date_start)=='undefined'){
      //   this.txt_date_start = '';
      // }
      // if(typeof(this.txt_date_end)=='undefined'){
      //   this.txt_date_end = '';
      // }
      // if(typeof(this.pcreate_dep_code)=='undefined'){
      //   this.pcreate_dep_code = '';
      //   this.puser_post = '';
      // }else{
      //   this.puser_post = this.getDep.find((o:any) => o.fieldIdValue === this.pcreate_dep_code).fieldNameValue;
      // }
      // if(typeof(this.phead_off_id)=='undefined'){
      //   this.phead_off_id = '';
      //   this.phead_off_name = '';
      // }else{
      //   this.phead_off_name = this.getPoffId.find((o:any) => o.fieldIdValue === this.phead_off_id).fieldNameValue;
      // }
      // if(typeof(this.puser_id)=='undefined'){
      //   this.puser_id = '';
      //   this.off_name = '';
      // }else{
      //   this.off_name = this.getOffId.find((o:any) => o.fieldIdValue === this.puser_id).fieldNameValue;
      // }
      // if(typeof(this.puser_to_id)=='undefined'){
      //   this.puser_to_id = '';
      //   this.puser_to = '';
      // }else{
      //   this.puser_to = this.getOffId.find((o:any) => o.fieldIdValue === this.puser_to_id).fieldNameValue;
      // }
      // if(typeof(this.pChk4)=='undefined'){
      //   this.pChk4 = '';
      // }
      // if(typeof(this.pflag)=='undefined'){
      //   this.pflag = '';
      // }

      // // For no parameter : paramData ='{}'
      // // For set parameter to report
      // var paramData = JSON.stringify({
      //   "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),//วันที่ปฏิบัติงานตั้งแต่วันที่
      //   "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),//ถึงวันที่

      //   "pcreate_dep_code" : this.pcreate_dep_code,//หน่วยงานที่บันทึก
      //   "puser_post" : this.puser_post,//หน่วยงานที่บันทึก

      //   "phead_off_id" : this.phead_off_id,//ผู้ตรวจสอบ
      //   //"phead_off_name" : this.phead_off_name,//ผู้ตรวจสอบ

      //   "puser_id" : this.puser_id,//ผู้ปฏิบัติ
      //   //"off_name" : this.off_name,//ผู้ปฏิบัติ

      //   "puser_to_id" : this.puser_to_id,//เสนอ ผ.อ.
      //   "puser_to" : this.puser_to,//เสนอ ผ.อ.
      //   "pchk4" : this.pChk4,//เสนอ ผ.อ.

      //   "pflag" : this.pflag,//เลือกแบบรายงาน
      // });


      var paramData ='{}';
      if(typeof(this.txt_date_start)=='undefined'){
        this.txt_date_start = '';
      }
      if(typeof(this.txt_date_end)=='undefined'){
        this.txt_date_end = '';
      }
      if(typeof(this.pcreate_dep_code)=='undefined'){
        this.pcreate_dep_code = '';
      }
      if(typeof(this.phead_off_id)=='undefined'){
        this.phead_off_id = '';
      }
      if(typeof(this.puser_id)=='undefined'){
        this.puser_id = '';
      }
      // if(typeof(this.puser_to_id)=='undefined'){
      //     this.puser_to_id = '';
      // }
      // if(typeof(this.puser_to)=='undefined'){
      //   this.puser_to = '';
      // }

      var paramData ='{}';
      var paramData = JSON.stringify({
        "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),//วันที่ปฏิบัติงานตั้งแต่วันที่
        "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),//ถึงวันที่
        "pcreate_dep_code" : this.pcreate_dep_code ? this.pcreate_dep_code.toString() : '',//หน่วยงานที่บันทึก
        "puser_post" : this.puser_post ? this.puser_post : '',//หน่วยงานที่บันทึก
        "phead_off_id" : this.phead_off_id ? this.phead_off_id : '',//ผู้ตรวจสอบ
        "puser_id" : this.puser_id ? this.puser_id : '',//ผู้ปฏิบัติ
        "puser_to_id" : this.puser_to_id ? this.puser_to_id : '',//เสนอ ผ.อ.
        "pflag" : this.pflag ?this.pflag.toString():'',
      });
        console.log(paramData);

      this.printReportService.printReport(rptName,paramData);
    }
  }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }

    tabChangeSelect(objName:any,objData:any,event:any,type:any){
      if(typeof objData!='undefined'){
        if(type==1){
          var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
        }else  if(type==3){
          var val = objData.filter((x:any) => x.fieldIdValue === parseInt(event.target.value)) ;
        }else{
            var val = objData.filter((x:any) => x.fieldIdValue === event);
        }
        // console.log(objData)
        //console.log(event.target.value)
        //console.log(val)
        if(val.length!=0){
          //this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
        }else{
          //this.result[objName] = null;
          this[objName] = null;
        }
      }else{
        //this.result[objName] = null;
        this[objName] = null;
      }
    }

    chkUser(){
      if(this.pChk4==true){
        this.puser_to_id = this.userData.directorId;
        this.puser_to = this.userData.directorName;
      }else{
        this.puser_to_id = null;
        this.puser_to = null;
      }
    }
}






