import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import * as $ from 'jquery';
declare var myExtObject: any;
@Component({
  selector: 'app-fpo0100-notice',
  templateUrl: './fpo0100-notice.component.html',
  styleUrls: ['./fpo0100-notice.component.css']
})
export class Fpo0100NoticeComponent implements AfterViewInit,OnInit,AfterContentInit {

  @Input() data : any = [];
  /* @Input() set data(data: any) {
    this.result = data;
  } */

  sessData:any;
  userData:any;
  result:any = [];

  
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal,
    private ngbModal: NgbModal,
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //console.log(this.userData)

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    console.log(this.data)
    
    this.setDefPage();
  }

  setDefPage(){
    if(this.data.notice_running){
      this.result = $.extend([],this.data);
    }else{

    }
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      //console.log(val)
      if(val.length!=0){
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }
  }

  ngAfterViewInit(): void {

  }


  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }



  directiveDate = (event: any) => {
    const { value, name } = event.target
    this.result[name] = value;
  }

  clickOpenMyModal(type:any){
    if(type==1 || type==4){
      var student = JSON.stringify({
        "table_name" : "pjail",
         "field_id" : "jail_id",
         "field_name" : "jail_name",
         "field_name2" : "notice_to",
         "search_id" : "",
         "search_desc" : "",
         "condition" : "",
         "userToken" : this.userData.userToken});
         console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = response
            modalRef.componentInstance.value1 = "pjail"
            modalRef.componentInstance.value2 = "jail_id"
            modalRef.componentInstance.value3 = "jail_name"
            modalRef.componentInstance.value6 = "notice_to"
            modalRef.componentInstance.types = 1
            modalRef.result.then((item: any) => {
              if(item){
                if(type==1){
                  this.result.notice_to = this.result.imprison_id = item.fieldIdValue;
                  this.result.noticeto_name = this.result.imprison_name = item.fieldNameValue;
                  this.result.noticeto_position = item.fieldNameValue2;
                }else{
                  this.result.imprison_id = item.fieldIdValue;
                  this.result.imprison_name = item.fieldNameValue;
                }
              }
            })
          },
          (error) => {}
        )
    }else if(type==2 || type==5){
      var student = JSON.stringify({
        "table_name" : "ppolice",
         "field_id" : "police_id",
         "field_name" : "police_name",
         "field_name2" : "position_name",
         "search_id" : "",
         "search_desc" : "",
         "condition" : "",
         "userToken" : this.userData.userToken});
         console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = response
            modalRef.componentInstance.value1 = "ppolice"
            modalRef.componentInstance.value2 = "police_id"
            modalRef.componentInstance.value3 = "police_name"
            modalRef.componentInstance.value6 = "position_name"
            modalRef.componentInstance.types = 1
            modalRef.result.then((item: any) => {
              if(item){
                if(type==2){
                  this.result.notice_to = this.result.imprison_id = item.fieldIdValue;
                  this.result.noticeto_name = this.result.imprison_name = item.fieldNameValue;
                  this.result.noticeto_position = item.fieldNameValue2;
                }else{
                  this.result.imprison_id = item.fieldIdValue;
                  this.result.imprison_name = item.fieldNameValue;
                }
              }
            })
          },
          (error) => {}
        )
    }else if(type==3 || type==6){
      var student = JSON.stringify({
        "table_name" : "phospital",
         "field_id" : "hospital_id",
         "field_name" : "hospital_name",
         "search_id" : "",
         "search_desc" : "",
         "condition" : "",
         "userToken" : this.userData.userToken});
         console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = response
            modalRef.componentInstance.value1 = "phospital"
            modalRef.componentInstance.value2 = "hospital_id"
            modalRef.componentInstance.value3 = "hospital_name"
            modalRef.componentInstance.types = 1
            modalRef.result.then((item: any) => {
              if(item){
                if(type==3){
                  this.result.notice_to  = item.fieldIdValue;
                  this.result.noticeto_name = item.fieldNameValue;
                }else{
                  this.result.imprison_id = item.fieldIdValue;
                  this.result.imprison_name = item.fieldNameValue;
                }
              }
            })
          },
          (error) => {}
        )
    }
  }

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;
    if(!this.result.notice_no){
      confirmBox.setMessage('กรุณาระบุเลขที่หมายขัง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      alert++;
    }else if(!this.result.notice_yy){
      confirmBox.setMessage('กรุณาระบุปีเลขที่หมายขัง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      alert++;
    }

    if(!alert){
      console.log(this.result)
      if(this.result.cancel_flag == true){
        this.result.cancel_flag = 1;
      }else{
        this.result.cancel_flag = null;
      }
      this.result.userToken = this.userData.userToken;
      //console.log($.extend({},this.result));
      this.activeModal.close($.extend({},this.result))
      //console.log(this.dataHeadTmp.ptitle+'!='+this.dataHead.ptitle+' || '+this.dataHeadTmp.pid+'!='+this.dataHead.pid+' || '+this.dataHeadTmp.pyy+'!='+this.dataHead.pyy+' && '+this.refLogin)
      //return
      
    }
  }

}
