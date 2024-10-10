import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import {ActivatedRoute} from '@angular/router';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-popup-room',
  templateUrl: './popup-room.component.html',
  styleUrls: ['./popup-room.component.css']
})
export class PopupRoomComponent implements OnInit {
  //@Input() items : any = [];
  @Input() value1: string;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;

  sessData:any;
  userData:any;
  getAppointBy:any;
  result:any = [];
  modalType:any = [];
  getCourt:any;court_name:any;notice_amt_remark:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  app_running : any;
  public loadModalComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.activatedRoute.queryParams.subscribe(params => {
      this.app_running = JSON.parse(params['app_running']);
      console.log(this.app_running)
    });

    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pappoint_by",
      "field_id" : "appoint_by_id",
      "field_name" : "appoint_by_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAppointBy = getDataOptions;
        this.result.judge_by = this.getAppointBy[0].fieldIdValue;
      },
      (error) => {}
    )
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify({
        "table_name" : "pjudge_room",
        "field_id" : "room_id",
        "field_name" : "room_desc",
        "userToken" : this.userData.userToken
      });    
      this.listTable='pjudge_room';
      this.listFieldId='room_id';
      this.listFieldName='room_desc';
      this.listFieldCond="";
    }
    if(this.modalType==1){
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalComponent = true;
        },
        (error) => {}
      )
    }
  }

  closeModal(){
    this.loadModalComponent = false;
  }

  receiveFuncListData(event:any){
    if(this.modalType==1){
      if(typeof event.fieldIdValue !='undefined'){
        this.result.room_id = event.fieldIdValue;
        this.result.room_desc = event.fieldNameValue;
      }
    }
    this.closebutton.nativeElement.click();
  }

  tabChangeInput(name:any,event:any){
    if(name=='room_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge_room",
        "field_id" : "room_id",
        "field_name" : "room_desc",
        "condition" : " AND room_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.room_desc = productsJson[0].fieldNameValue;
        }else{
          this.result.room_id = '';
          this.result.room_desc = '';
        }
        },
        (error) => {}
      )
    }
  }

  saveRoomAppoint(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
   var data = [];var dataSave = [];
   for(var i=0;i<this.app_running.length;i++){
    this.app_running[i].judge_by = this.result.judge_by;
    this.app_running[i].room_id = this.result.room_id?this.result.room_id:'';
    this.app_running[i].room_desc = this.result.room_desc?this.result.room_desc:'';
   }
   dataSave['userToken'] = this.userData.userToken;
   dataSave['data'] = this.app_running;
   var student = $.extend({}, dataSave);
   console.log(student)
   this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/assignRoomDescByDate', student ).subscribe(
    (response) =>{
      let alertMessage : any = JSON.parse(JSON.stringify(response));
      console.log(alertMessage)
      if(alertMessage.result==0){
        confirmBox.setMessage(alertMessage.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){
            this.closebutton.nativeElement.click();
            this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        confirmBox.setMessage(alertMessage.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){
            this.closebutton.nativeElement.click();
            window.opener.myExtObject.openerReloadRunId(this.app_running[0].run_id);
            window.close();
          }
          subscription.unsubscribe();
        });
      }
    },
    (error) => {this.SpinnerService.hide();}
  )
  }

}
