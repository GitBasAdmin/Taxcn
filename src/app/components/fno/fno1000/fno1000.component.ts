import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ChangeDetectorRef,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

import {Observable,of, Subject  } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fno1000',
  templateUrl: './fno1000.component.html',
  styleUrls: ['./fno1000.component.css']
})


export class Fno1000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  runId:any;
  run_id:any;
  dataHead:any = [];
  dataNotice:any = [];
  dataNoticeTmp:any = [];
  sendEditData:any;
  highligth:number = 0;
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
  noticeType:any;
  notice:any = [];
  noticeJson:any;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  @ViewChild('t',{static: true}) t : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.activatedRoute.queryParams.subscribe(params => {
      if(typeof params['run_id'] !='undefined'){
        //this.runId = {'run_id' : params['run_id'],'counter' : Math.ceil(Math.random()*10000),'sendCase':1}
        this.runId = {'run_id' : params['run_id'],'counter' : Math.ceil(Math.random()*10000)}
        //this.getNoticeNo(1,params['run_id'],'');
      }
    });


    this.successHttp();
    this.setDefPage();
  }

  setDefPage(){
    this.getNoticeType();
  }

  getNoticeType(){
    var student = JSON.stringify({
      "table_name" : "pnotice_type",
      "field_id" : "notice_type_id",
      "field_name" : "notice_type_name",
      "condition" : " AND (notice_type_id BETWEEN 9 AND 16 ) OR (notice_type_id = 90 )",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: '----- เลือกประเภทหมาย ------'});
        this.noticeType = getDataOptions;
        this.notice.notice_type_id = 0;
        this.notice.pprint_by = 1;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0200"
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

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.run_id = {'run_id' : event.run_id }
      this.t.nativeElement.value=0;
      this.ChangeHighligth(0,2);
      
    }
    this.getNoticeNo(1,event.run_id,'');
    location.replace(window.location.href.split("/#/")[0]+"/#/fno1000?run_id="+event.run_id);
  }

  getNoticeNo(type:number,run_id:any,noticeType:any){
    if(type==1){
      var student = JSON.stringify({
        "run_id" : run_id,
        "userToken" : this.userData.userToken
      });
      this.sendEditData = {'data' : {},'counter' : Math.ceil(Math.random()*10000)}
    }else{
      var student = JSON.stringify({
        "run_id" : run_id,
        "notice_type_id" : noticeType,
        "userToken" : this.userData.userToken
      });
    }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/getNoticeCData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            this.dataNotice = productsJson.data;
            this.dataNoticeTmp = JSON.parse(JSON.stringify(productsJson.data));
            console.log(this.dataNotice)
            this.rerender();
          }else{
            this.dataNotice = [];
            this.dataNoticeTmp = [];
            this.rerender();
          }
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
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  ChangeHighligth(obj:any,type:any){
    //console.log(obj.target.value)
    setTimeout(() => {
      if(type==1)
        this.highligth = parseInt(obj.target.value);
      else
        this.highligth = parseInt(obj);
    }, 200);
    
  }

  sendValue(event:any){
    this.noticeJson = {'notice_type_id':event.target.value,'alle_desc':this.dataHead.alle_desc,'counter' : Math.ceil(Math.random()*10000)}
    console.log(this.noticeJson)
    if(typeof this.runId !='undefined')
     this.getNoticeNo(2,this.runId.run_id,event.target.value);
  }

  delNoticeData(i:any){
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = 1;
    modalRef.closed.subscribe((res) => {
      if(res) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูล');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            var dataDel = [];
            dataDel['log_remark'] = res;
            dataDel['userToken'] = this.userData.userToken;
            dataDel['data'] = [this.dataNotice[i]];
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/deleteNoticeC', data).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                console.log(alertMessage)
                if(alertMessage.result==0){
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  confirmBox2.setMessage(alertMessage.error);
                  confirmBox2.setButtonLabels('ตกลง');
                  confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      
                    }
                    subscription2.unsubscribe();
                  });
                }else{
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  confirmBox2.setMessage(alertMessage.error);
                  confirmBox2.setButtonLabels('ตกลง');
                  confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.getNoticeNo(1,this.runId.run_id,'');
                    }
                    subscription2.unsubscribe();
                  });
                }
              },
              (error) => {this.SpinnerService.hide();}
            )
          }
          subscription.unsubscribe();
        })
      }
    })
  }

  editNotice(i:any){
    this.SpinnerService.show();
    this.t.nativeElement.value=this.dataNotice[i].notice_type_id;
    this.ChangeHighligth(this.dataNotice[i].notice_type_id,2);
    //console.log(this.dataNotice)
    this.loadEditData(i);
  }

  loadEditData(i:any){
    //this.sendEditData = $.extend({},this.dataNotice[i]);
    //var dataEdit = JSON.parse(JSON.stringify(this.dataNotice));
    console.log($.extend({},this.dataNoticeTmp[i]))
    this.sendEditData = {'data' : $.extend({},this.dataNoticeTmp[i]),'counter' : Math.ceil(Math.random()*10000)}
    //return false;
    this.run_id = {'run_id' : null}
    this.noticeJson = {'notice_type_id':this.t.nativeElement.value,'alle_desc':this.dataHead.alle_desc,'counter' : Math.ceil(Math.random()*10000)}
    this.getNoticeNo(2,this.runId.run_id,this.dataNoticeTmp[i].notice_type_id);
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  onReloadData(event:any){
    console.log(event)
    this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'sendCase':1}
    location.replace(window.location.href.split("/#/")[0]+"/#/fno1000?run_id="+event.run_id);
    if(event.notice_type_id)
      this.getNoticeNo(2,event.run_id,event.notice_type_id);
    else
      this.getNoticeNo(1,event.run_id,'');

  }

}







