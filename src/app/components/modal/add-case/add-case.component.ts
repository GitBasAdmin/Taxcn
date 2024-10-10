import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrls: ['./add-case.component.css']
})
export class AddCaseComponent implements OnInit {
  @Input() items : any = [];
  @Input() run_id: number;//run_id
  @Input() add: number;//add==1 แบบพิมพ์คำให้การ

  dtTrigger: Subject<any> = new Subject<any>();
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  
  
  formList: FormGroup;

  sessData:any;
  userData:any;
  result:any=[];
  arrData:any=[];
  getCaseType=[];
  getTitle=[];
  getRedTitle=[];

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.arrData = [];
    this.setDefForm();
    //======================== pdoc_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/crimApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
      },
      (error) => {}
    )
  }

  setDefForm(){
    this.result = [];
    this.result.case_type = this.userData.defaultCaseType;
    this.changeCaseType('',this.result.case_type);
  }

  changeCaseType(index:any, val:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"' ",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/crimApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(index == ''){
            this.getTitle = getDataOptions;
            if(this.userData.defaultCaseType == val){
              this.result.title = this.userData.defaultTitle;
            }else{
              this.result.title = getDataOptions[0].fieldIdValue;
            }
          }else{
            this.arrData[index].getTitle = getDataOptions;
          }
        },  
        (error) => {}
      )
      var student2 = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='2' AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });
  
      this.http.post('/crimApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(index == ''){
            this.getRedTitle = getDataOptions;
            if(this.userData.defaultCaseType == val){
              this.result.red_title = this.userData.defaultRedTitle;
            }else{
              this.result.red_title = getDataOptions[0].fieldIdValue;
            }
          }else{
            this.arrData[index].getRedTitle = getDataOptions;
          }
        },
      (error) => {}
      )
    });
  }

  displayData(type:any, index:any){
    if(type == 1){//เลขคดีดำ
      let letDataOptions = "";
      if(index == null){
        letDataOptions = $.extend({},this.result);
      }else{
        letDataOptions = this.arrData[index];
      }
        var student1 = JSON.stringify({
          "case_type": letDataOptions['case_type'],
          "title": letDataOptions['title'],
          "id": letDataOptions['id'],
          "yy": letDataOptions['yy'],
          "allData" : 1,
          "onlyCase" : 1,
          "userToken" : this.userData.userToken
        });
      this.http.post('/crimApiCA/API/CASE/dataFromTitle', student1).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log("เลขคดีดำ", getDataOptions)
          if(getDataOptions.data.length > 0){

            getDataOptions.data[0].getCaseType = this.getCaseType;
            getDataOptions.data[0].getTitle = this.getTitle;
            getDataOptions.data[0].getRedTitle = this.getRedTitle;

            if(index == null){//new
              this.arrData.push(getDataOptions.data[0]);
              this.setDefForm();
            }else{//edit
              this.arrData[index] = getDataOptions.data[0];
            }
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
          console.log( this.arrData);
          console.log( this.arrData[index]);
        },
        (error) => {}
      )
    }else if(type == 2){//เลขคดีแดง
      let letDataOptions = "";
      if(index == null){
        letDataOptions = $.extend({},this.result);
      }else{
        letDataOptions = this.arrData[index];
      }
        var student2 = JSON.stringify({
          "case_type": letDataOptions['case_type'],
          "red_title": letDataOptions['red_title'],
          "red_id": letDataOptions['red_id'],
          "red_yy": letDataOptions['red_yy'],
          "allData" : 1,
          "onlyCase" : 1,
          "userToken" : this.userData.userToken
        });
      this.http.post('/crimApiCA/API/CASE/dataFromRedTitle', student2).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log("เลขคดีแดง",getDataOptions)
          if(getDataOptions.data.length > 0 ){
            getDataOptions.data[0].getCaseType = this.getCaseType;
            getDataOptions.data[0].getTitle = this.getTitle;
            getDataOptions.data[0].getRedTitle = this.getRedTitle;
            if(index == null){//new
              this.arrData.push(getDataOptions.data[0]);
              this.setDefForm();
            }else{//edit
              this.arrData[index] = getDataOptions.data[0];
            }
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
    }
  }

  ClearAll(){
    this.ngOnInit();
  }


  onClickSaveData(): void {
    this.onClickList.emit(this.arrData)
  }
}
