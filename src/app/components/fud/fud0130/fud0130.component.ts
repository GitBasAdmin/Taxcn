import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable,ViewChildren,Input, QueryList,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../fdo/modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fud0130',
  templateUrl: './fud0130.component.html',
  styleUrls: ['./fud0130.component.css']
})


export class Fud0130Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  @Input() run_id :any;
  @Input() appeal_running :any;
  @Input() notice_running :any;
  @Input() n_type :any;

  title = 'datatables';
  sessData:any;
  userData:any;
  programName:any;
  programId:any;

  result:any = [];
  tmpResult:any = [];
  appealData:any = [];
  notice:any = [];
  dData:any = [];
  sendData:any = [];
  data:any = [];
  myExtObject:any;
  modalType:any;
  delIndex:any;
  event:any;

  getDep:any;
  pdep_code:any;
  ptype:any;
  masterTmp:any;
  getAssign:any;
  //run_id:any;
  //notice_running:any;
  //appeal_running:any;
  getLitType:any;
  //n_type:any;

  getPostHead:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent : boolean = false;
  public loadModalLitComponent : boolean = false;
  public loadModalConfComponent : boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChildren('send_date') send_date: QueryList<ElementRef>;
  @ViewChildren('permit_to') permit_to: QueryList<ElementRef>;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      //lengthChange : false,
      //info : false,
      //paging : false,
      //searching : false,
      destroy : true,
      retrieve: true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id'])
        this.run_id = params['run_id'];
      if(params['appeal_running'])
        this.appeal_running = params['appeal_running'];
      if(params['notice_running'])
        this.notice_running = params['notice_running'];
      if(params['n_type'])
        this.n_type = params['n_type'];
    });
    

      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.litType();
    this.getDataForm('');
    this.getNoticeData();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fud0130"
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

  litType(){
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    console.log(student)
     this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getLitType = getDataOptions;
      },
      (error) => {}
      )
  }

  runSeq(dataObj:any){
    console.log(dataObj)
    if(dataObj.length){
      const item = dataObj.reduce((prev:any, current:any) => (+prev.send_item > +current.send_item) ? prev : current)
      this.result.send_item = item.send_item+1;
    }else{
      this.result.send_item = 1;
    }
  }

  getDataForm(i:any){
    if(typeof i !='object'){
      var student = JSON.stringify({
        "appeal_running" : this.appeal_running,
        "notice_running" : this.notice_running,
        "userToken" : this.userData.userToken
      });
    }else{
      var student = JSON.stringify({
        "appeal_running" : this.appeal_running,
        "notice_running" : i.notice_running,
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0130/getNotice', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
          
          this.notice = getDataOptions.data[0]?getDataOptions.data[0]:[];
          this.result = getDataOptions.send_data[0]?getDataOptions.send_data[0]:[];
          if(!getDataOptions.send_data.length)
            this.notice.notice_result_by = this.notice.copy_type = 1;
          this.dData = getDataOptions.extend_data?getDataOptions.extend_data:[];
          var bar = new Promise((resolve, reject) => {
            this.dData.forEach((x : any ) => x.dRunning = true);
          });
          if(bar){
            var items = 0;
            if(this.dData.length){
              const item = this.dData.reduce((prev:any, current:any) => (+prev.item > +current.item) ? prev : current)
              items = item.item+1;
            }else{
              items = 1;
            }
            this.dData.push({'item':items,'send_date':'','permit_to':''});
            setTimeout(() => {
              this.ngAfterContentInit();
            }, 500);
          }
        }
      },
      (error) => {}
    )
  }
  getNoticeData(){
    var student = JSON.stringify({
      "run_id" : this.run_id?this.run_id:0,
      "appeal_running" : this.appeal_running?this.appeal_running:0,
      "n_type" : this.n_type?this.n_type:0,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/getAppealNotice', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            //-----------------------------//
              this.appealData = getDataOptions.data?getDataOptions.data:[];
              this.rerender();
            //-----------------------------//
        }
      },
      (error) => {}
    )
  }

  deldData(i:any){
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent,{ centered: true,windowClass: "center-modal" })
    modalRef.closed.subscribe((data) => {
      if(data) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูล');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            var student = JSON.stringify({
              "log_remark" : data,
              "extend_data": [this.dData[i]],
              "userToken" : this.userData.userToken
            });
            console.log(student)
            this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0130/delExtendNotice', student).subscribe(
              (response) =>{
                let getDataOptions : any = JSON.parse(JSON.stringify(response));
                console.log(getDataOptions)
                this.getDataForm('');
                this.event = 1;
              },
              (error) => {}
            );
          }
        })
      }
    })
  }

  adddData(i:any){
    if((i+1)==(this.dData.length) && this.permit_to.get(i).nativeElement.value){
      this.dData.push({'item':this.dData.length+1,'send_date':'','permit_to':''});
      setTimeout(() => {
        this.ngAfterContentInit();
      }, 500);
    }
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

      if(obj=='rcvnotice_date'){
        this.assignDate(); 
      }
    }

    assignDate(){
      if(this.result.notice_result_by==1){
        this.notice.revise_send_date = myExtObject.dayAdd(myExtObject.conDate(this.result.rcvnotice_date),15);
      }else if(this.result.notice_result_by==2){
        this.notice.revise_send_date = myExtObject.dayAdd(myExtObject.conDate(this.result.rcvnotice_date),30);
      }
    }

    directiveNoticeDate(date:any,obj:any){
      this.notice[obj] = date;

      if(obj=='revise_send_date'){
        if(!this.notice.revise_send_date)
          this.assignDate();
      }
    }

    directiveDateObj(index:any,obj:any){
      if(obj=='send_date')
        this.dData[index][obj] = this.send_date.get(index).nativeElement.value;
      else
        this.dData[index][obj] = this.permit_to.get(index).nativeElement.value;
    }

    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = [];
      var data = [this.notice];
      var extend_data = this.dData;
      var send_data = [$.extend({},this.result)];
      student['data'] = data;
      student['extend_data'] = extend_data.slice(0, -1);;
      student['send_data'] = send_data;
      student['appeal_running'] = this.appeal_running;
      student['notice_running'] = this.notice_running;
      student['run_id'] = this.run_id;
      student['userToken'] = this.userData.userToken;
      student = $.extend({},student);
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0130/saveData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  //this.setDefPage();
                  this.getDataForm('');
                  this.event = 1;
                  this.getNoticeData();
                }
                subscription.unsubscribe();
              });
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                }
                subscription.unsubscribe();
              });
              
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }

    editData(i:any){
      this.getDataForm(this.appealData[i]);
      //console.log(this.appealData[i])
      //แก้ไข หน้าจอซ้อนทับกันทำให้ปิดหน้าจอไม่ได้ค่ะ 1/11/2565
      // location.replace(window.location.href.split("/#/")[0]+"/#/fud0130?run_id="+this.run_id+'&appeal_running='+this.appeal_running+'&notice_running='+this.appealData[i].notice_running+'&n_type='+this.n_type);
      // this.notice_running = this.appealData[i].notice_running;
    }

    closeWin(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      if(this.run_id && this.appeal_running){
        var url = 'fud0100?run_id='+this.run_id+'&appeal_running='+this.appeal_running;
        window.opener.myExtObject.openerReloadUrl(url);
      }else
        window.opener.myExtObject.openerReloadUrl('fud0100');
      window.close();
    }

    closeModal(){
      if(this.event)
        this.activeModal.close(1)
      else
        this.activeModal.close();
    }

}







