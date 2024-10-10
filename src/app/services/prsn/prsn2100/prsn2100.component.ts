import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil, timeout } from 'rxjs/operators';
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
  selector: 'app-prsn2100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prsn2100.component.html',
  styleUrls: ['./prsn2100.component.css']
})


export class Prsn2100Component implements AfterViewInit, OnInit, OnDestroy {
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
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;
  getDateType:any;
  getNoMoney:any;
  getOwnCourt:any;
  getInOutFlag:any;
  getOrder:any;
  getOff:any;
  getCase:any;
  getSendBy:any;
  getType:any;
  getSumary:any;
  pprint_type:any;
  getPrintType:any;
  getTranferFlag:any;
  result:any = [];
  getTitle:any;
  modalType:any;

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

  @ViewChild('prsn2100',{static: true}) prsn2100 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup : NgSelectComponent;


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

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "dep_code",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        console.log(this.getOff)
        var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        if(Off.length!=0){
          this.result.preport_id = this.result.preport_id = Off[0].fieldIdValue;
          this.result.preport_name = Off[0].fieldNameValue;
        }
      },
      (error) => {}
    )
    //----------------------end pofficer -------------------

    this.getNoMoney = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'หมายศาล'},{id:'2',text:'หมายนำ'}];
    this.getInOutFlag = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ในเขต'},{id:'2',text:'ข้ามเขต'}];
    this.getOrder = [{id:'1',text:'เลขคดีดำ'},{id:'2',text:'ใบเสร็จ'},{id:'3',text:'จังหวัด/อำเภอ'},{id:'4',text:'ศาล'},{id:'5',text:'ผู้เดินหมาย'}];
    this.getSendBy = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ไปรษณีย์'},{id:'2',text:'เจ้าหนาที่'},{id:'3',text:'คู่ความสงเอง'},{id:'4',text:'หนังสือนำส่ง'}];
    this.getType = [{id:'0',text:'รวม'},{id:'1',text:'แยกตามเขต'}];
    this.getDateType = [{id:'1',text:'วันที่จ่ายหมาย'},{id:'2',text:'วันที่บันทึกผลหมาย'},{id:'3',text:'วันที่ส่งหมาย'},{id:'4',text:'วันที่รับเงิน'}];
    this.getSumary = [{id:'0',text:'พิมพ์สรุป'},{id:'1',text:'พิมพ์แยกตามค่านำหมาย'}];
    this.getTranferFlag =  [{id:'0',text:'ทั้งหมด'},{id:'1',text:'เฉพาะเงินโอน'},{id:'2',text:'ไม่รวมเงินโอน'}];
    this.getOwnCourt =  [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ศาลนี้'},{id:'2',text:'ศาลอื่น'}];
    this.result.print_type = '1';
    this.result.pdate_type = '1';
    this.result.pno_money = '0';
    this.result.pinout_flag = '0';
    this.result.psend_by = '0';
    this.result.ptype2 = '0';
    this.result.psumary = '0';
    this.result.porder = '1';
    this.result.ptranfer_flag = '0';
    this.result.pown_court = '0';
  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prsn2100"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/crimApi/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
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

    getMessage(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุข้อมูล ตั้งแต่วันที่ ถึงวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }

    checkParam(type:any){
      if(!this.result.pdate_start || !this.result.pdate_end){
      //  alert('กรุณาระบุข้อมูลตั้งแต่วันที่ ถึงวันที่');
      // $("input[name='pdate_start']")[0].focus();
        this.getMessage();

     }else{
         this.getWithdrawRunning(type);
        // setTimeout(() =>{
        //       this.checkWithdraw(type);
        // },100);



      // if(this.result.withdraw_running){
      //  await this.printReport(type);
      //       console.log('printreport');
      //  }else{
      //        console.log('notprint');
      //  }
      //    setTimeout(() => {
      //    if(this.result.withdraw_running){
      //       this.printReport(type);
      //       console.log('printreport');
      //     }else{
      //       console.log('notprint');
      //     }
      // },5000 );
    }
 }

 checkWithdraw(type:any){
     console.log('checkwithdraw');
  if(this.result.withdraw_running){
    this.printReport(type);
         console.log('printreport');
    }else{
          console.log('notprint');
    }
 }

  async getWithdrawRunning(type:any){
      var student = JSON.stringify({
      "print_type" : this.result.print_type ? this.result.print_type : null,
      "pdep_code" : this.result.pdep_code ? this.result.pdep_code : null,
      "pdate_type" : this.result.pdate_type ? this.result.pdate_type : null,
      "pdate_start" : this.result.pdate_start ? this.result.pdate_start : null ,
      "pdate_end" : this.result.pdate_end ? this.result.pdate_end : null,
      "pno_money" : this.result.pno_money ? this.result.pno_money : null,
      "pinout_flag" : this.result.pinout_flag ? this.result.pinout_flag : null ,
      "psend_by" : this.result.psend_by ? this.result.psend_by : null,
      "porder" : this.result.porder ? this.result.porder : null,
      "ptype2" : this.result.ptype2 ? this.result.ptype2 : null,
      "ptranfer_flag" : this.result.ptranfer_flag ? this.result.ptranfer_flag : null,
      "ps_officer_id" : this.result.ps_officer_id ? this.result.ps_officer_id : null,
      "pown_court" : this.result.pown_court ? this.result.pown_court : null,
      "pto_court" : this.result.pto_court ? this.result.pto_court : null,
      "passign_off_id" : this.result.passign_off_id ? this.result.passign_off_id : null,
      "premark" : this.result.premark ? this.result.premark : null,
      "preport_id" : this.result.preport_id ? this.result.preport_id : null,
      "pcheck_id" : this.result.pcheck_id ? this.result.pcheck_id : null,
      "ppayee_id" : this.result.ppayee_id ? this.result.ppayee_id : null,
      "checkbox" : this.result.checkbox ? this.result.checkbox : null,
      "psumary" : this.result.psumary ? this.result.psumary : null,
      "userToken" : this.userData.userToken
    });
    console.log(student);
    this.SpinnerService.show();
    // this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/printReport', student ).subscribe((response) =>{
     let getDataOptions : any;
     if(type==6){
      getDataOptions = await this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/printOutReport', student ).toPromise()
    }else if(type==4){
      getDataOptions = await this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/searchRunNo', student ).toPromise()
    }else{
      getDataOptions = await this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/printReport', student ).toPromise()
     }

        getDataOptions = JSON.parse(JSON.stringify(getDataOptions));
        this.getCase = getDataOptions;
        console.log(this.getCase);
        if(getDataOptions.result==0){
          this.SpinnerService.hide();
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.result.withdraw_running = '';
              console.log(this.result.withdraw_running);
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          this.result.withdraw_running = this.getCase.withdraw_running;
          console.log(this.result.withdraw_running);
          await this.checkWithdraw(type);
          // this.printReport(1);
        }
        // if(this.getCase.result == 1){
        //   this.result.withdraw_running = this.getCase.withdraw_running;
        // }else{
        //   //alert('ไม่พบข้อมูลที่ต้องการพิมพ์');
        //   this.getMessage();
        //   this.result.withdraw_running = '';
        // }

        // console.log(this.result.withdraw_running);

      // (error) => {this.SpinnerService.hide();}
    }

    changeTitle(caseType:number,type:any){
      this.title = '';
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title_id",
        "field_name": "title",
        "field_name2": "title_group",
        "condition": " AND case_type="+caseType+ " And title_flag=1",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
      console.log("fTitle :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/crimApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
          console.log(this.getTitle);
          if(type>0)
            this.title = type;
          //this.fDefCaseStat(caseType,title);
        },
        (error) => {}
      )
      });
      return promise;
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
      }else if(id=='ps_officer_id' || id=='passign_off_id' || id=='preport_id' || id=='pcheck_id' || id=='ppayee_id'){
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

    getPost(post_id:any,modalType:any){
      if(post_id){
        var student = JSON.stringify({
          "table_name" : "pposition",
          "field_id" : "post_id",
          "field_name" : "post_name",
          "condition" : " AND post_id='"+post_id+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              if(modalType==2)
                this.result.poff_post = productsJson[0].fieldNameValue;
              else if (modalType==3)
                this.result.psign_post = productsJson[0].fieldNameValue;
              else if (modalType==4)
                this.result.preport_judge_post = productsJson[0].fieldNameValue;
            }else{
              if(modalType==2)
                this.result.poff_post = '';
              else if (modalType==3)
                this.result.psign_post = '';
              else if (modalType==4)
                this.result.preport_judge_post = '';
            }
            },
            (error) => {}
          )
      }
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
              this.loadPrintSendNotice = false;
              this.loadSwitchSendNotice = false;
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
              this.loadPrintSendNotice = false;
              this.loadSwitchSendNotice = false;
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
              this.loadPrintSendNotice = false;
              this.loadSwitchSendNotice = false;
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
              this.loadPrintSendNotice = false;
              this.loadSwitchSendNotice = false;
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
              this.loadPrintSendNotice = false;
              this.loadSwitchSendNotice = false;
          },
          (error) => {}
        )
    }else if(this.modalType==13){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadPrintSendNotice = true;
      this.loadSwitchSendNotice = false;
    }else if(this.modalType==14){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadPrintSendNotice = false;
      this.loadSwitchSendNotice = true;
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
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==3 || this.modalType==5){
        this.result.ps_officer_id=event.fieldIdValue;
        this.result.ps_officer_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      // }else if(this.modalType==4){
      //   this.result.passign_off_id=event.fieldIdValue;
      //   this.result.passign_off_name=event.fieldNameValue;
      //   this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==6 || this.modalType==7){
        this.result.passign_off_id=event.fieldIdValue;
        this.result.passign_off_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==8){
        this.result.pcheck_id=event.fieldIdValue;
        this.result.pcheck_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==9 || this.modalType==10){
        this.result.ppayee_id=event.fieldIdValue;
        this.result.ppayee_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==11){
        this.result.pto_court=event.fieldIdValue;
        this.result.pto_courtname=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }
      this.closebutton.nativeElement.click();
    }
    receiveJudgeListData(event:any){
      this.result.pid=event.judge_id;
      this.result.pstat_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    assignOffChk(event:any){
      if(event==true){
        this.result.poff_id = this.userData.userCode;
        this.result.poff_name = this.userData.offName;
        this.result.poff_post = this.userData.postName;
      }else{
        this.result.poff_id = '';
        this.result.poff_name = '';
        this.result.poff_post = '';
      }
    }

    assignSignChk(event:any){
      if(event==true){
        this.result.psign_id = this.userData.directorId;
        this.result.psign_name = this.userData.directorName;
        this.result.psign_post = this.userData.directorPostName;
      }else{
        this.result.psign_id = '';
        this.result.psign_name = '';
        this.result.psign_post = '';
      }
    }

    assignReportChk(event:any){
      if(event==true){
        this.result.preport_judge_id = this.userData.headJudgeId;
        this.result.preport_judge_name = this.userData.headJudgeName;
        this.result.preport_judge_post = this.userData.headJudgePost;
      }else{
        this.result.preport_judge_id = '';
        this.result.preport_judge_name = '';
        this.result.preport_judge_post = '';
      }
    }

    printReport(type:any){

      var rptName = 'rsn3100';
      if(type==2){
        rptName = 'rsn3100V';
      }else if(type==3){
        rptName = 'rsn3120';
      }else if(type==6){
        rptName = 'rsn2100';
      }

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        //  "pcase_type" : this.selCaseType,
        "pown_court" : this.result.pown_court ? this.result.pown_court : '',
        "pwithdraw_running" : this.result.withdraw_running ? this.result.withdraw_running.toString() : '',
        "psize" : type ? type.toString() : '',
        "pcheck_name" : this.result.pcheck_name ? this.result.pcheck_name : '',
        "preport_name" : this.result.preport_name ? this.result.preport_name : '',
        "premark" : this.result.premark ? this.result.premark : '',
        "ptype2" : this.result.ptype2 ? this.result.ptype2 : '',
        "pdate_type" : this.result.pdate_type ? this.result.pdate_type : '',
        "psumary" : this.result.psumary ? this.result.psumary : '',

        "ppayee_name" : this.result.ppayee_name ? this.result.ppayee_name : '',
        "print_type" : this.result.print_type ? this.result.print_type : '',
        "pdep_code" : this.result.pdep_code ? this.result.pdep_code : '',
        "pdate_start" : this.result.pdate_start ? myExtObject.conDate(this.result.pdate_start) : '' ,
        "pdate_end" : this.result.pdate_end ? myExtObject.conDate(this.result.pdate_end) : '',
        "pno_money" : this.result.pno_money ? this.result.pno_money : '',
        "pinout_flag" : this.result.pinout_flag ? this.result.pinout_flag : '',
        "psend_by" : this.result.psend_by ? this.result.psend_by : '',
        "porder" : this.result.porder ? this.result.porder : '',

        "ptranfer_flag" : this.result.ptranfer_flag ? this.result.ptranfer_flag : '',
        "ps_officer_id" : this.result.ps_officer_id ? this.result.ps_officer_id : '',

        "pto_court" : this.result.pto_court ? this.result.pto_court : '',
        "passign_off_id" : this.result.passign_off_id ? this.result.passign_off_id : '',
        "pcheck_id" : this.result.pcheck_id ? this.result.pcheck_id : '',
        "ppayee_id" : this.result.ppayee_id ? this.result.ppayee_id : '',
        "pcheckbox" : this.result.checkbox ? this.result.checkbox : '',

       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

 }






