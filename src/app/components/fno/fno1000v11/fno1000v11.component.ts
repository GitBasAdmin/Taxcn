import { Component, OnInit , Input, Output,EventEmitter,ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { getLocaleDateFormat } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '../../modal/datalist-return/datalist-return.component';
import { ModalNoticeComponent } from '../../modal/modal-notice/modal-notice.component';
import { DatalistReturnMultipleComponent } from '../../modal/datalist-return-multiple/datalist-return-multiple.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { DatalistLastNoticeComponent } from '@app/components/modal/datalist-last-notice/datalist-last-notice.component';
import { ModalCaseLitigant } from '@app/components/modal/modal-case-litigant/modal-case-litigant.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import {Observable,of, Subject  } from 'rxjs';
declare var myExtObject: any;
@Component({
  selector: 'app-fno1000v11',
  templateUrl: './fno1000v11.component.html',
  styleUrls: ['./fno1000v11.component.css']
})
export class Fno1000v11Component implements AfterViewInit, OnInit, OnDestroy {
  sessData:any;
  userData:any;
  litType:any;
  getAppeal:any;
  result:any=[];
  resultTmp:any = [];
  noticeData:any = [];
  myExtObject: any;
  noticeType:any;
  noticeTypeId:any;
  printBy:any;
  dataHead:any;
  isReadonly:boolean = false;
  remark:any;
  changeJson$:Observable<any>;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  @Output() onReloadData = new EventEmitter<{counter:any,notice_type_id:any,run_id:any}>();
  @Input() set editData(editData: any) {
    console.log(editData)
    if(typeof editData !='undefined' && editData.data.notice_running){
      this.result = $.extend({},editData.data);
      this.resultTmp = JSON.parse(JSON.stringify(editData.data));
      this.isReadonly = true;
      this.loadForm();
    }else{
      this.setDefPage(1);
    }
  }

  @Input() set cHead(cHead: any) {
    console.log(cHead)
    if(typeof cHead !='undefined'){
      this.dataHead = cHead;
      /* if(this.dataHead.run_id)
        this.setDefPage(); */
    }
  }
  @Input() set nTypeId(nTypeId: any) {
    this.changeJson$ = of(nTypeId);
    if(nTypeId){
      this.noticeTypeId = nTypeId.notice_type_id;
      if(typeof this.result.length !='undefined')
        this.result.alle_desc = nTypeId.alle_desc
    }
  }
  
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //======================== ppers_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.litType = getDataOptions;
      },
      (error) => {}
    )
    //======================== pappeal_send_to ======================================
    var student = JSON.stringify({
      "table_name" : "pappeal_send_to",
      "field_id" : "send_to_id",
      "field_name" : "send_to_name",
      "order_by" : " order_no ASC",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        this.getAppeal = getDataOptions;
      },
      (error) => {}
    )

    this.remark = [{fieldIdValue:'เมื่อจะครบกำหนดโทษที่แจ้งในหมายนี้ ให้ถามศาลว่าจะปล่อยหรือขังต่อไป',fieldNameValue: 'เมื่อจะครบกำหนดโทษที่แจ้งในหมายนี้ ให้ถามศาลว่าจะปล่อยหรือขังต่อไป'},{fieldIdValue:"เมื่อครบกำหนดโทษที่แจ้งในหมายนี้ ให้ปล่อยตัวไปทันที",fieldNameValue: 'เมื่อครบกำหนดโทษที่แจ้งในหมายนี้ ให้ปล่อยตัวไปทันที'}];
    if(this.result.notice_type_id && this.result.notice_type_id!=this.noticeTypeId){
      this.setDefPage('');
      //if(typeof this.dataHead !='undefined')
        //this.onReloadData.emit({'counter':Math.ceil(Math.random()*10000),'notice_type_id' : '','run_id':this.dataHead.run_id});
    }
  }

  private getDataUser = () => {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }

    return userData
  }

  setDefPage(val:any){
    let dataUser = this.getDataUser();
    this.result = this.resultTmp = [];
    this.result.lit_type = 2;
    this.result.notice_yy = myExtObject.curYear();
    this.result.type_by = dataUser.offName;
    this.result.type_date = this.result.notice_date = myExtObject.curDate();
    if(this.changeJson$){
      this.changeJson$.subscribe(res=>{
        if(typeof this.result.length !='undefined')
          this.result.alle_desc = res.alle_desc
      }).unsubscribe();
    }
    if(val==1){
      this.remark = [{fieldIdValue:'เมื่อจะครบกำหนดโทษที่แจ้งในหมายนี้ ให้ถามศาลว่าจะปล่อยหรือขังต่อไป',fieldNameValue: 'เมื่อจะครบกำหนดโทษที่แจ้งในหมายนี้ ให้ถามศาลว่าจะปล่อยหรือขังต่อไป'},{fieldIdValue:"เมื่อครบกำหนดโทษที่แจ้งในหมายนี้ ให้ปล่อยตัวไปทันที",fieldNameValue: 'เมื่อครบกำหนดโทษที่แจ้งในหมายนี้ ให้ปล่อยตัวไปทันที'}];
    }
    this.result.remark1 = this.remark[0].fieldIdValue;
    this.isReadonly = false;
    this.loadForm();
  }

  loadForm(){
    this.getNoticeType();
  }

  getNoticeType(){
    let dataUser = this.getDataUser();
    var student = JSON.stringify({
      "table_name" : "pnotice_type",
      "field_id" : "notice_type_id",
      "field_name" : "notice_type_name",
      "condition" : " AND (notice_type_id BETWEEN 9 AND 16 ) OR (notice_type_id = 90 )",
      "userToken" : dataUser.userToken
    });
    this.http.post('/'+dataUser.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: '----- เลือกประเภทหมาย ------'});
        this.noticeType = getDataOptions;
        if(this.result.back_notice_id)
          this.result.back_notice_id = this.result.back_notice_id;
        else
          this.result.back_notice_id = 0;
      },
      (error) => {}
    )
  }

  clickOpenMyModal(type:any){
    var run_id = this.dataHead.run_id?this.dataHead.run_id:this.result.run_id;
    if(type==1){
      const modalRef = this.ngbModal.open(ModalCaseLitigant)
            modalRef.componentInstance.types = 1;
            modalRef.componentInstance.lit_type = this.result.lit_type;
            modalRef.componentInstance.run_id = run_id;
            modalRef.result.then((item: any) => {
              if(item){
                var litDesc = item.lit_type_desc3?(" "+item.lit_type_desc3):"";
                this.result.item = item.seq;
                this.result.accuitem_name=(item.lit_name?item.lit_name:'')+litDesc;
              }
            })
      /* var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "seq",
         "field_name" : "CONCAT(title, name) AS fieldNameValue",
         "condition" : " AND run_id='"+run_id+"' AND lit_type='"+this.result.lit_type+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = productsJson
            modalRef.componentInstance.value1 = "pcase_litigant"
            modalRef.componentInstance.value2 = "seq"
            modalRef.componentInstance.value3 = "CONCAT(title, name) AS fieldNameValue"
            modalRef.componentInstance.value7 = " AND run_id='"+run_id+"' AND lit_type='"+this.result.lit_type+"'",
            modalRef.componentInstance.types = "1"
            modalRef.result.then((item: any) => {
              if(item){
                this.result.item=item.fieldIdValue;
                this.result.accuitem_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      ) */
    }else if(type==2){
      if(this.result.item && run_id){
        var student = JSON.stringify({
          "run_id" : run_id,
          "lit_type" : this.result.lit_type,
          "seq" : this.result.item?this.result.item:'',
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/popupNoticeC', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            const modalRef = this.ngbModal.open(ModalNoticeComponent,{ windowClass: 'xxxxx'})
              modalRef.componentInstance.items = productsJson
              modalRef.componentInstance.types = "1"
              modalRef.result.then((item: any) => {
                if(item){
                  this.result.back_notice_id=item.notice_type_id;
                  this.result.noticetype_no1=item.notice_no_all.split('/')[0];
                  this.result.noticetype_yy1=item.notice_no_all.split('/')[1];
                  this.result.noticetype_date1=item.noticetype_date1;
                  this.result.prison_type = item.prison_type;
                  this.result.prison = item.prison;
                  this.result.noticeto_name = item.noticeto_name;
                  this.result.back_notice=item.notice_type_name;
                  this.result.noticeto_name2 = item.noticeto_name2;
                }
              })
          },
          (error) => {}
        )
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        if(!run_id)
          confirmBox.setMessage('กรุณาค้นหาข้อมูลคดี');
        else if(!this.result.item)
          confirmBox.setMessage('กรุณาเลือกคู่ความ');
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
      }
    }else if(type==3){//เรือนจำ
      var student = JSON.stringify({
        "table_name" : "pjail",
        "field_id" : "jail_id",
        "field_name" : "jail_name",
        "field_name2" : "notice_to",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
        this.listTable='pjail';
        this.listFieldId='jail_id';
        this.listFieldName='jail_name';
        this.listFieldName2='jail_name';
        this.listFieldNull='';
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
        console.log(response)
        this.list = response;
        //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent,{ size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pjail"
          modalRef.componentInstance.value2 = "jail_id"
          modalRef.componentInstance.value3 = "jail_name"
          modalRef.componentInstance.value6 = "notice_to"
          modalRef.componentInstance.types = "1"
    
          modalRef.result.then((item: any) => {
            if(item){
              this.result.prison=item.fieldIdValue;
              this.result.noticeto_name=item.fieldNameValue;
              this.result.noticeto_name2=item.fieldNameValue2;
            }
          })
        },
        (error) => {}
        )
    }else if(type==4){
      var student = JSON.stringify({
        "table_name" : "pby_law",
         "field_id" : "by_law",
         "field_name" : "by_law_name",
         "field_name2" : "by_law_desc",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = productsJson
            modalRef.componentInstance.value1 = "pby_law"
            modalRef.componentInstance.value2 = "by_law"
            modalRef.componentInstance.value3 = "by_law_name"
            modalRef.componentInstance.value6 = "by_law_desc"
            modalRef.componentInstance.types = "1"
            modalRef.result.then((item: any) => {
              if(item){
                this.result.by_law=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }else if(type==5){
      var student = JSON.stringify({
        "table_name" : "pjail_order",
         "field_id" : "jail_order_id",
         "field_name" : "jail_order_desc",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = productsJson
            modalRef.componentInstance.value1 = "pjail_order"
            modalRef.componentInstance.value2 = "jail_order_id"
            modalRef.componentInstance.value3 = "jail_order_desc"
            modalRef.componentInstance.types = "1"
            modalRef.result.then((item: any) => {
              if(item){
                this.result.in_jail_person_id=item.fieldIdValue;
                this.result.in_jail_person=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }else if(type==6){
      var student = JSON.stringify({
        "table_name" : "pendnotice",
         "field_id" : "endnotice_id",
         "field_name" : "endnotice_desc",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = productsJson
            modalRef.componentInstance.value1 = "pendnotice"
            modalRef.componentInstance.value2 = "endnotice_id"
            modalRef.componentInstance.value3 = "endnotice_desc"
            modalRef.componentInstance.types = "1"
            modalRef.result.then((item: any) => {
              if(item){
                this.result.endnotice_id=item.fieldIdValue;
                this.result.bremark=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }else if(type==7){
      const modalRef = this.ngbModal.open(DatalistLastNoticeComponent,{ size: 'lg', backdrop: 'static' })
      modalRef.componentInstance.run_id = run_id
      modalRef.componentInstance.lit_type = this.result.lit_type
      modalRef.componentInstance.seq = this.result.item
      modalRef.result.then((item: any) => {
        if(item){
          this.result.cancel_remark= "ยกเลิก"+item.notice_type_name+'ที่ '+item.notice_no+" ลงวันที่ "+item.notice_date+" โดยให้ใช้หมายนี้แทน";
        }
      })
    }
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {

  }

  saveData(){
    

/*     if(!this.result.notice_no){
      confirmBox.setMessage('ป้อนเลขที่หมายก่อนจัดเก็บ');
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
    } */
  
    
    //return false;
    var require = 0;
    var bar = new Promise((resolve, reject) => {
      if(!this.result.notice_running){
        if(this.resultTmp.notice_no!=this.result.notice_no){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('พบการเปลี่ยนเลขหมาย โปรแกรมจะ run เลขหมายให้อัตโนมัติ');
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
          //this.result.notice_no=this.result.hid_notice_no;
        }
      }

      if(!this.result.item){
        require++;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('เลือกข้อมูลจำเลย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.notice_no){
        require++;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนเลขที่หมาย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.noticeto_name){
        require++;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนข้อมูลเรือนจำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.prison){
        require++;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนข้อมูลเรือนจำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }
    });

    if(bar && !require){
      var run_id = this.dataHead.run_id?this.dataHead.run_id:this.result.run_id;
    if(this.result.cancel_flag==true){
      this.result.cancel_flag = 1;
    }else{
      this.result.cancel_flag = 0;
    }
    var student = $.extend({},this.result);
        student['run_id'] = run_id;
        student['notice_type_id'] = this.noticeTypeId;
        student['userToken'] = this.userData.userToken;
        console.log(student)
        
         this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/saveNoticeC', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.result.notice_running = this.resultTmp.notice_running = getDataOptions.notice_running;
                    this.isReadonly = true;
                    var counter = Math.ceil(Math.random()*10000);
                    this.onReloadData.emit({'counter':counter,'notice_type_id' : this.noticeTypeId,'run_id':run_id});
                  }
                  subscription.unsubscribe();
                });
                //-----------------------------//

            }else{
              //-----------------------------//
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              //-----------------------------//
            }

          },
          (error) => {}
        ) 
    }
    
  }

  runNoticeNo(){
    if(!this.result.notice_no){
      var student = JSON.stringify({
        "notice_type_id" : this.noticeTypeId,
        "notice_yy" : this.result.notice_yy,
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/runNoticeCNo', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.result.notice_no = productsJson.notice_no;
            this.resultTmp.notice_no = productsJson.notice_no;
          }else{
            this.result.noticetype_no1 = this.resultTmp.notice_no = '';
          }
        },
        (error) => {}
      )
    }
  }

  searchNotice(){
    if(this.result.notice_no || this.result.notice_yy){
      var student = JSON.stringify({
        "notice_type_id" : this.noticeTypeId,
        "notice_no" : this.result.notice_no,
        "notice_yy" : this.result.notice_yy,
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/getNoticeCData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            if(productsJson.data.length){
              this.result = productsJson.data[0];
              this.resultTmp = JSON.parse(JSON.stringify(productsJson.data[0]));
              this.isReadonly = true;
              var counter = Math.ceil(Math.random()*10000);
              this.onReloadData.emit({'counter':counter,'notice_type_id' : productsJson.data[0].notice_type_id,'run_id':productsJson.data[0].run_id});
              this.loadForm();
            }else{
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(productsJson.error);
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
            }
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage('ไม่พบข้อมูลหมายสี');
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
          }
        },
        (error) => {}
      )
    }
  }

  cancelPage(){
    var result = this.resultTmp;
    if(this.result.notice_running){
      this.result = this.resultTmp;
    }else{
      this.setDefPage('');
    }
  }

  copyNotice(){
    if(this.result.notice_running){
      const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            var student = JSON.stringify({
              "notice_running" : this.result.notice_running,
              "userToken" : this.userData.userToken
            });    
            console.log(student)
        
         this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1000/copyNoticeC', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage('สำเนาข้อมูลหมายเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.result.notice_running = this.resultTmp.notice_running = getDataOptions.notice_running;
                    this.result.notice_no = this.resultTmp.notice_no = getDataOptions.notice_no;
                    this.result.notice_yy = this.resultTmp.notice_yy = getDataOptions.notice_yy;
                    this.isReadonly = true;
                    var counter = Math.ceil(Math.random()*10000);
                    this.onReloadData.emit({'counter':counter,'notice_type_id' : this.noticeTypeId,'run_id':this.result.run_id});
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
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              //-----------------------------//
            }

          },
          (error) => {}
        ) 
    }
  }

  loginChange(){
    const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fno1000-conf'})
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if(data) {
        this.isReadonly = false;
      }
    })
  }

  tabChangeInput(name:any,event:any){
    var run_id = this.dataHead.run_id?this.dataHead.run_id:this.result.run_id;
    if(name=='item'){
      if(this.dataHead.run_id && this.result.lit_type){
        var student = JSON.stringify({
          "run_id": run_id,
          "lit_type": this.result.lit_type,
          "seq":event.target.value,
          "userToken" : this.userData.userToken
        }); 
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            //this.result.accuitem_name = productsJson.data[0].lit_name+" "+productsJson.data[0].lit_type_desc2;
            var litDesc = productsJson.data[0].lit_type_desc3?(" "+productsJson.data[0].lit_type_desc3):"";
            this.result.item = productsJson.data[0].seq;
            this.result.accuitem_name=(productsJson.data[0].lit_name?productsJson.data[0].lit_name:'')+litDesc;
          }else{
            this.result.item = '';
            this.result.accuitem_name = '';
          }
          },
          (error) => {}
        )
      }
    }else if(name=='prison'){
      var student = JSON.stringify({
        "table_name" : "pjail",
        "field_id" : "jail_id",
        "field_name" : "jail_name",
        "field_name2" : "notice_to",
        "condition" : " AND jail_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken});
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.result.noticeto_name = productsJson[0].fieldNameValue;
          this.result.noticeto_name2 = productsJson[0].fieldNameValue2;
        }else{
          this.result.prison = this.result.noticeto_name = this.result.noticeto_name2 = '';
        }
        },
        (error) => {}
      )
    }else if(name=='in_jail_person_id'){
      var student = JSON.stringify({
        "table_name" : "pjail_order",
        "field_id" : "jail_order_id",
        "field_name" : "jail_order_desc",
        "condition" : " AND jail_order_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken});
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.result.in_jail_person = productsJson[0].fieldNameValue;
        }else{
          this.result.in_jail_person_id = this.result.in_jail_person = '';
        }
        },
        (error) => {}
      )
    }else if(name=='endnotice_id'){
      var student = JSON.stringify({
        "table_name" : "pendnotice",
        "field_id" : "endnotice_id",
        "field_name" : "endnotice_desc",
        "condition" : " AND endnotice_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken});
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.result.bremark = productsJson[0].fieldNameValue;
        }else{
          this.result.endnotice_id = this.result.bremark = '';
        }
        },
        (error) => {}
      )
    }
  }

  printReport(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(type==1){
        var rptName = 'rno1100_a4_form';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pcourt_running" : this.userData.courtRunning,
          "pnotice_running" : this.result.notice_running?this.result.notice_running:0,
          "pcolor" : 1,
          "pprint_by" : 1,
        });
        console.log(paramData)
      }else if(type==2){
        var rptName = 'rno_color';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pcourt_running" : this.userData.courtRunning,
          "pnotice_running" : this.result.notice_running?this.result.notice_running:0,
          "pcolor" : 1,
          "ppage" : 1,
          "pprint_by" : 1,
        });
        console.log(paramData)
      }else if(type==3){
        var rptName = 'rno_color';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pcourt_running" : this.userData.courtRunning,
          "pnotice_running" : this.result.notice_running?this.result.notice_running:0,
          "pcolor" : 1,
          "ppage" : 2,
          "pprint_by" : 1,
        });
        console.log(paramData)
      }else if(type==4){
        var rptName = 'rno0001';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pcourt_running" : this.userData.courtRunning,
          "pnotice_running" : this.result.notice_running?this.result.notice_running:0,
          "pprint_by" : 1
        });
        console.log(paramData)
      }else if(type==5){
       
      }
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    
  }

}
