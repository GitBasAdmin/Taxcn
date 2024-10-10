import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList    } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ExcelService } from 'src/app/services/excel.service.ts';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { Utilities } from '@shared/utilities';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


pdfMake.fonts = {
  'Roboto' : {
    normal: `Roboto-Regular.ttf`,
    bold: `Roboto-Medium.ttf`,
    italics: `Roboto-Italic.ttf`,
    bolditalics: `Roboto-MediumItalic.ttf`
  },
  'THSarabunNew' : {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  }
}
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkb0400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0400.component.html',
  styleUrls: ['./fkb0400.component.css']
})


export class Fkb0400Component implements AfterViewInit, OnInit, OnDestroy {
  getInOut:any;selInOut:any;
  getSendBy:any;selSendBy:any;
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;

  sessData:any;
  userData:any;
  programName:any;
  dataSearch:any = [];
  myExtObject: any;
  result:any= [];
  items:any= [];
  getPost:any;
  modalType:any;
  textCheckPrint:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;
  public loadPrintSendNotice: boolean = false;
  public loadSwitchSendNotice: boolean = false;
  public loadModalJudgeComponent: boolean = false;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private excelService: ExcelService,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
      },
      (error) => {}
    )
    //======================== pnotice_send_by ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_send_by",
      "field_id" : "send_by",
      "field_name" : "send_by_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendBy = getDataOptions;
        this.selSendBy = 2;
      },
      (error) => {}
    )
    this.getInOut = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];
    this.selInOut = this.getInOut.find((x:any) => x.fieldIdValue === 0).fieldNameValue
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  changeProv(province:any){
    this.sAmphur.clearModel();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        console.log(this.getAmphur)
        this.selProv = province;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkb0400"
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
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
    });
    this.dtTrigger.next(null);
}

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      myExtObject.callCalendar();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    searchData(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      if((!this.result.app_date1 || !this.result.app_date2) && (!this.result.notice_date1 || !this.result.notice_date2)){
        confirmBox.setMessage('กรุณาป้อนวันที่นัด/วันที่จ่ายหมายเพื่อค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        this.SpinnerService.show();
        var dataTmp= this.result;
        dataTmp['search_type'] = type;
        dataTmp['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataTmp);
        console.log(data)
        let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0400', data , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              this.dataSearch = [];
              this.rerender();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }else{
              this.dataSearch = alertMessage.data;
              this.items = alertMessage.data;
              this.rerender();
              this.SpinnerService.hide();
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

    retToPage(notice_running:any){
      let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/fkb0301';
      myExtObject.OpenWindowMax(winURL+'?notice_running='+notice_running);
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pdepartment';
      this.listFieldId='dep_code';
      this.listFieldName='dep_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
        },
        (error) => {}
      )

    }if(this.modalType==2 || this.modalType==3 || this.modalType==7 || this.modalType==8 || this.modalType==10){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
        },
        (error) => {}
      )

    }else if(this.modalType==4){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
        },
        (error) => {}
      )
    }else if(this.modalType==11){
      var student = JSON.stringify({
        "table_name" : "pcourt",
        "field_id" : "court_running",
        "field_name" : "court_name",
        "field_name2" : "court_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pcourt';
      this.listFieldId='court_running';
      this.listFieldName='court_name';
      this.listFieldName2='court_id';
      this.listFieldNull='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
         },
        (error) => {}
      )
    }else if(this.modalType==5 || this.modalType==6 || this.modalType==9){
      var student = JSON.stringify({
        "table_name" : "psentnotice_officer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "head_flag",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='psentnotice_officer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='head_flag';
      this.listFieldNull='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
            },
        (error) => {}
      )
  }else if(this.modalType==13){
    $("#exampleModal").find(".modal-content").css("width","800px");
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }else if(this.modalType==14){
    $("#exampleModal").find(".modal-content").css("width","800px");
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }

}

tabChangeInput(id:any,name:any,event:any){
  if(name=='pdep_code'){
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "condition" : " AND dep_code='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.result.dep_name = productsJson[0].fieldNameValue;
        }else{
          this.result.pdep_code = '';
          this.result.dep_name = '';
        }
        },
        (error) => {}
      )
  }else if(id=='notice_to_id' || id=='passign_off_id' || id=='preport_id' || id=='pcheck_id' || id=='ppayee_id'){
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "post_id",
      "condition" : " AND off_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result[name] = productsJson[0].fieldNameValue;
          this.getPost(productsJson[0].fieldNameValue2,2);
        }else{
          this.result[id] = '';
          this.result[name] = '';
        }
        },
        (error) => {}
      )
  }else if(id=='pto_court'){
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_running",
      "field_name" : "court_name",
      "field_name2" : "court_id",
      "condition" : " AND court_running='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result[name] = productsJson[0].fieldNameValue;
          this.getPost(productsJson[0].fieldNameValue2,3);
        }else{
          this.result[id] = '';
          this.result[name] = '';
        }
        },
        (error) => {}
      )
  }else if(name=='preport_judge_id'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "field_name2" : "post_id",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.preport_judge_name = productsJson[0].fieldNameValue;
          this.getPost(productsJson[0].fieldNameValue2,4);
        }else{
          this.result.preport_judge_id = '';
          this.result.preport_judge_name = '';
        }
        },
        (error) => {}
      )
  }
}

  closeModal(){
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }


  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.pdep_code=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.preport_id=event.fieldIdValue;
      this.result.preport_name=event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==3 || this.modalType==5){
      this.result.notice_to_id = event.fieldIdValue;
      this.result.notice_to_name = event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    // }else if(this.modalType==4){
    //   this.result.passign_off_id=event.fieldIdValue;
    //   this.result.passign_off_name=event.fieldNameValue;
    //   this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==6 || this.modalType==7){
      this.result.passign_off_id=event.fieldIdValue;
      this.result.passign_off_name=event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==8){
      this.result.pcheck_id=event.fieldIdValue;
      this.result.pcheck_name=event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==9 || this.modalType==10){
      this.result.ppayee_id=event.fieldIdValue;
      this.result.ppayee_name=event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==11){
      this.result.pto_court=event.fieldIdValue;
      this.result.pto_courtname=event.fieldNameValue;
      // this.getPost(event.fieldNameValue2,this.modalType);
    }
    this.closebutton.nativeElement.click();
  }

  exportAsXLSX(): void {
    if(this.dataSearch){
      var excel =  JSON.parse(JSON.stringify(this.dataSearch));
      console.log(excel)
      var data = [];var extend = [];
      var bar = new Promise((resolve, reject) => {

        for(var i = 0; i < excel.length; i++){
          // if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
          //   excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
          // else
          //   excel[i]['case_no'] = "";
          // if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
          //   excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
          // else
          //   excel[i]['red_no'] = "";
          // if(excel[i]['date_appoint'])
          //   excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
          // else
          //   excel[i]['dateAppoint'] = "";
          // if(excel[i]['old_red_no'])
          //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
          // else
          //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

          for(var x=0;x<15;x++){
            if(x==0)
              data.push(excel[i]['court_name']);
            if(x==1)
              data.push(excel[i]['case_no']);
            if(x==2)
              data.push(excel[i]['red_no']);
            if(x==3)
              data.push(excel[i]['notice_no']);
            if(x==4)
              data.push(excel[i]['send_date']);
            if(x==5)
              data.push(excel[i]['send_item']);
            if(x==6)
              data.push(excel[i]['notice_type_name']);
            if(x==7)
              data.push(excel[i]['noticeto_name']);
            if(x==8)
              data.push(excel[i]['remark']);
            if(x==9)
              data.push(excel[i]['amphur_name']);
            if(x==10)
              data.push(excel[i]['send_by_desc']);
            if(x==12)
              data.push(excel[i]['send_by_name']);
            if(x==12)
              data.push(excel[i]['ems_barcode']);
            if(x==13)
              data.push(excel[i]['receive_off_name']);
            if(x==14)
              data.push(excel[i]['s_off_name']);
            // if(x==15)
            //   data.push(excel[i]['admit_desc']);
            // if(x==17)
            //   data.push(excel[i]['transfer_court_name']);
          }

          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if(bar){
        var objExcel = [];
        // objExcel['deposit'] = this.deposit;
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel,'fkb0400' ,this.programName);
      }

    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  checkPrint(){
    if(this.result.app_date1 && this.result.app_date2){
      this.textCheckPrint = 'วันที่นัด ' + this.result.app_date1 + ' ถึงวันที่ ' + this.result.app_date2 + '; ';
    }
    if(this.result.notice_date1 && this.result.notice_date2){
      this.textCheckPrint += 'วันที่จ่ายหมาย ' + this.result.notice_date1 + ' ถึงวันที่ ' + this.result.notice_date2 + ';';
    }
  }


  onPrint = () => {
    if(this.items.length < 0) {
      return
    }
    this.checkPrint();
    var datatime =  this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    var datauser =  JSON.parse(JSON.stringify(this.userData));
    let dataReduce = this.items.reduce((previousValue, currentValue) => {
      const position = previousValue.findIndex(val => {
        return val.app_date1 == currentValue.app_date1
      });

      if (position == -1) {
        const obj = {
          court_name: currentValue.court_name,
          case_no: currentValue.case_no,
          red_no : currentValue.red_no,
          notice_no: currentValue.notice_no,
          send_date : currentValue.send_date,
          send_item : currentValue.send_item,
          notice_type_name : currentValue.notice_type_name,
          noticeto_name : currentValue.noticeto_name,
          remark : currentValue.remark,
          amphur_name : currentValue.amphur_name,
          send_by_desc : currentValue.send_by_desc,
          send_by_name : currentValue.send_by_name,
          ems_barcode : currentValue.ems_barcode,
          receive_off_name : currentValue.receive_off_name,
          s_off_name : currentValue.s_off_name,
          details: [{
          court_name: currentValue.court_name,
          case_no: currentValue.case_no,
          red_no : currentValue.red_no,
          notice_no: currentValue.notice_no,
          send_date : currentValue.send_date,
          send_item : currentValue.send_item,
          notice_type_name : currentValue.notice_type_name,
          noticeto_name : currentValue.noticeto_name,
          remark : currentValue.remark,
          amphur_name : currentValue.amphur_name,
          send_by_desc : currentValue.send_by_desc,
          send_by_name : currentValue.send_by_name,
          ems_barcode : currentValue.ems_barcode,
          receive_off_name : currentValue.receive_off_name,
          s_off_name : currentValue.s_off_name
          }]
        }
        previousValue.push(obj)
      } else {
        const obj = {
          court_name: currentValue.court_name,
          case_no: currentValue.case_no,
          red_no : currentValue.red_no,
          notice_no: currentValue.notice_no,
          send_date : currentValue.send_date,
          send_item : currentValue.send_item,
          notice_type_name : currentValue.notice_type_name,
          noticeto_name : currentValue.noticeto_name,
          remark : currentValue.remark,
          amphur_name : currentValue.amphur_name,
          send_by_desc : currentValue.send_by_desc,
          send_by_name : currentValue.send_by_name,
          ems_barcode : currentValue.ems_barcode,
          receive_off_name : currentValue.receive_off_name,
          s_off_name : currentValue.s_off_name
          // item: currentValue.item,
          // case_no: currentValue.case_no,
          // black: currentValue.black,
          // lit_type_desc: currentValue.lit_type_desc,
          // due_return: currentValue.due_return,
          // doc_no: currentValue.doc_no,
          // page_no: currentValue.page_no,
          // doc_desc: currentValue.doc_desc,
          // black2: currentValue.black,
          // lit_type_desc2: currentValue.lit_type_desc,
          // due_return2: currentValue.due_return,
          // doc_no2: currentValue.doc_no,
          // page_no2: currentValue.page_no,
          // doc_desc2: currentValue.doc_desc
        }
        previousValue[position].details.push(obj)
      }
      return previousValue

    }, [])

    dataReduce.forEach((items, index) => {
      let data = [];
      items.details.forEach((item, i) => {
        data.push([
          {
            text: i+1 , alignment: 'center'
          }, {
            text: item.court_name || ""
          }, {
            text: item.red_no ? item.case_no + '\n' + item.red_no : item.case_no, alignment: 'center' || ""
          }, {
            text: item.notice_no || ""
          }, {
            text: item.send_date || ""
          }, {
            text: item.send_item || ""
          }, {
            text: item.notice_type_name || ""
          }, {
            text: item.noticeto_name || ""
          }, {
            text: item.amphur_name || ""
          }, {
            text: item.send_by_desc || ""
          }, {
            text: item.send_by_name || ""
          }, {
            text: item.s_off_name ? item.receive_off_name + '\n' + item.s_off_name : item.s_off_name || ""
          }]
        )
      })

      let docDefinition = {
        defaultStyle: {font: 'THSarabunNew', fontSize: '16'},
        // pageSize:  {
        //   width: 297,
        //   height: 210,
        // },
        pageSize: 'A4',
        pageOrientation: 'landscape',

        header: function(currentPage, pageCount, pageSize) {
          return [
            {
              margin: [32, 15],
              layout: 'noBorders',
              table: {
                headerRows: 1,
                widths: [ 'auto', 'auto', '*', 100 ],
                body: [
                  [
                    {
                      text: `${datauser.shortCourtName}`,
                      style: 'tableHeader', colSpan: 4,
                    },
                    {},
                    {},
                    {}
                  ],
                  [
                    'ผู้พิมพ์',
                    `${datauser.userName}`,
                    { text: 'ตรวจสอบหมายที่ยังไม่ลงผลการส่งหมาย', fontSize: 23, alignment: 'center' },
                    { text: '(RFKB0400)', alignment: 'right' }
                  ],
                  [
                    'วันที่พิมพ์',
                    `${myExtObject.curDate()} ${datatime}`,
                    // { text:`${myExtObject.curDate()} ${myExtObject.curTime()}`},
                    ``,
                    { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right' }
                  ],
                ]
              }
            },
          ]
        },
        content: [
          {
            table: {
              headerRows: 1,
              pageBreak: 'before',
              widths: [ 20, 50 , 70, 65, 65, 'auto', 60, 85 ,'auto', 'auto', 90, 80 ],
              body: [
                [
                  { text: `เงื่อนไข : ${this.textCheckPrint}`, colSpan: 12, fillColor: '#dee2e6', },{},{},{},{},{},{},{},{},{},{},{}
                ],
                [
                { text: 'ลำดับที่', alignment: 'center', style: 'header'},
                { text: 'คดีของศาล', alignment: 'center', style: 'header'},
                { text: 'คดีหมายเลขดำ'+'\n'+'คดีหมายเลขแดง', alignment: 'center', style: 'header'},
                { text: 'รหัสหมาย', alignment: 'center', style: 'header'},
                { text: 'วันที่จ่ายหมาย', alignment: 'center', style: 'header'},
                { text: 'ครั้งที่', alignment: 'center', style: 'header'},
                { text: 'ประเภทหมาย', alignment: 'center', style: 'header'},
                { text: 'ส่งถึง', alignment: 'center', style: 'header'},
                { text: 'เขตการส่ง', alignment: 'center', style: 'header'},
                { text: 'ส่งโดย', alignment: 'center', style: 'header'},
                { text: 'คำสั่งหมาย', alignment: 'center', style: 'header'},
                { text: 'ผู้รับหมาย'+'\n'+'ผู้เดินหมาย', alignment: 'center', style: 'header'},
                 ],
                ...data,
                [
                  { text: `รวม     ${this.items.length}     รายการ` , colSpan: 12}
                ]
              ]
            }
          }
        ],
        // showfoot
        // footer: {
        //   columns: [
        //     'Left part',
        //     { text: 'Right part', alignment: 'right' }
        //   ]
        // },
        pageMargins: [20,100,5,10],
        pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          //check if signature part is completely on the last page, add pagebreak if not
          if (currentNode.id === 'signature' && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
            return true;
          }
          //check if last paragraph is entirely on a single page, add pagebreak if not
          else if (currentNode.id === 'closingParagraph' && currentNode.pageNumbers.length != 1) {
            return true;
          }
          return false;
        }
      };
      pdfMake.createPdf(docDefinition).open()
    })
  }

  printPDF(){

    var docDefinition = {
      defaultStyle: {fontSize : '16', font : 'THSarabunNew'},
      pageSize: 'A4',
      pageOrientation: 'landscape',
      header: function(currentPage, pageCount, pageSize) {
        return [
          {
            margin: [32, 15],
            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: [ 'auto', 'auto', '*', 100 ],
              body: [
                [
                  {
                    text: 'xxxxx',
                    style: 'tableHeader', colSpan: 4,
                  },
                  {},
                  {},
                  {}
                ],
                [
                  'ผู้พิมพ์',
                  'pppppppp',
                  // `${data.userName}`,
                  // `${datauser.userName}`,
                  { text: 'ตรวจสอบหมายที่ยังไม่ได้ลงผลหมาย', fontsize: 20, alignment: 'center' },
                  { text: '(RFKB0400)', alignment: 'right' }
                ],
                [
                  'วันที่พิมพ์',
                  ``,
                  ``,
                  { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right' }
                ],
              ]
            }
          },
        ]
      },
      // content: [
      //   {
      //     table: {
      //       headerRows: 1,
      //       pageBreak: 'before',
      //       widths: [ 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', '*' ,'auto', 'auto', 'auto', '*', 'auto' ],
      //       body: [
      //         [
      //           { text: 'เงื่อนไข : วันที่นัด ตั้งแต่ 01/04/2564 ถึงวันที่ 31/05/2564', colSpan: 13, fillColor: '#dee2e6', },{},{},{},{},{},{},{},{},{},{},{},{}
      //         ],
      //         [
      //           { text: 'ลำดับที่', alignment: 'center', style: 'header'},
      //           { text: 'คดีของศาล', alignment: 'center', style: 'header'},
      //           { text: 'คดีหมายเลขดำ<br>คดีหมายเลขแดง', alignment: 'center', style: 'header'},
      //           { text: 'รหัสหมาย', alignment: 'center', style: 'header'},
      //           { text: 'วันที่จ่ายหมาย', alignment: 'center', style: 'header'},
      //           { text: 'ครั้งที่', alignment: 'center', style: 'header'},
      //           { text: 'ประเภทหมาย', alignment: 'center', style: 'header'},
      //           { text: 'ส่งถึง', alignment: 'center', style: 'header'},
      //           { text: 'เขตการส่ง', alignment: 'center', style: 'header'},
      //           { text: 'ส่งโดย', alignment: 'center', style: 'header'},
      //           { text: 'คำสั่งหมาย', alignment: 'center', style: 'header'},
      //           { text: 'ผู้รับหมาย<br>ผู้เดินหมาย', alignment: 'center', style: 'header'},
      //          ],
      //         //  ...data,
      //       ]
      //     }
      //   }
      // ],
      content: [
        { text: 'สร้าง PDF ภาษาไทยด้วย pdfmake ', fontSize: 15 },
       ],
     };
    pdfMake.createPdf(docDefinition).open()
 }

}







