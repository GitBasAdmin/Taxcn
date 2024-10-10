import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import * as $ from 'jquery';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-address-copy',
  templateUrl: './address-copy.component.html',
  styleUrls: ['./address-copy.component.css']
})
export class AddressCopyComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  litData:any = [];

  getCourt:any;
  getLitType:any;
  court_id:any;
  getCaseType:any;
  getCaseTitle:any;selCaseTitle:any;
  getCopy:any;
  getTitle:any;

  headObj:any;

  @Output() onCopyData = new EventEmitter<any>();
  @Input() set headData(headData: any) {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.headObj = headData;
    if(typeof this.headObj.case_type == 'undefined'){
      this.headObj.case_type = this.userData.defaultCaseType;
    }
    if(typeof this.headObj.title == 'undefined'){
      this.headObj.title = this.userData.defaultTitle;
    }
    if(typeof this.headObj.court_id == 'undefined'){
      this.headObj.court_id = this.userData.courtId;
    }
    if(typeof this.headObj.court_name == 'undefined'){
      this.headObj.court_name = this.userData.courtName;
    }
    console.log(this.headObj)
  }
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  @ViewChild('sCaseTitle') sCaseTitle : NgSelectComponent;
  
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData)

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.result.c_type = this.headObj.case_type;
        this.result.case_type = this.headObj.case_type;
        this.changeCaseType(this.headObj.case_type,1);
      },
      (error) => {}
    )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_running",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
        var court = this.getCourt.filter((x:any) => x.fieldIdValue === this.userData.courtId);
        if(court.length!=0){
          this.result.court_id  = court[0].fieldIdValue;
          this.court_id  = court[0].fieldIdValue;
        }
      },
      (error) => {}
    )
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )
    //======================== สำเนาจาก	 ======================================
    this.getCopy = [{fieldIdValue:1,fieldNameValue: 'หมายเลขคดีดำ'},{fieldIdValue:2,fieldNameValue: 'คดีผัดฟ้อง/ฝากขัง'}];
    //console.log($("body").find("ng-select#title span.ng-value-label").html())
    
    this.setDefPage(0);
  }

  setDefPage(type:any){
    this.result = [];
    if(this.headObj.court_id){
      this.result.court_id = this.headObj.court_id;
    }
    if(this.headObj.court_name){
      this.result.court_name = this.headObj.court_name;
    }
    if(type==1){
      if(this.headObj.case_type){
        this.result.case_type = this.headObj.case_type;
      }
    }
    if(this.headObj.title){
      this.result.title = this.headObj.title;
    }
    if(this.headObj.id){
      this.result.id = this.headObj.id;
    }
    if(this.headObj.yy){
      this.result.yy =  this.headObj.yy;
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

  }

  ChildTestCmp(){
    var student = JSON.stringify({
      "password" : this.modalForm.nativeElement["password"].value,
      "log_remark" : this.modalForm.nativeElement["log_remark"].value
    });
    return student;
  }

  changeCaseType(val:any,type:any){
    //========================== ptitle ====================================    
    //this.sCaseTitle.handleClearClick();
    this.result.ptitle = null;
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getCaseTitle = getDataOptions;
          if(type==1){
            this.result.case_type = this.headObj.case_type;
            this.result.title = this.headObj.title;
            this.fCaseTitle(val,type);
          }
          
        },
        (error) => {}
      )
    });
    return promise;
  }

  fCaseTitle(val:any,type:any){
    if(type==2 && val==this.headObj.case_type){
      this.result.title = this.headObj.title;
      this.result.red_title = this.headObj.title;
    }
    if(type==1)
      //this.resultTmp = $.extend({}, this.result);
    
    //console.log(this.resultTmp)
      //========================== ptitle ====================================    
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='1' AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      var student2 = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='2' AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      //console.log("fCaseTitle")
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.getTitle = getDataOptions;
            if(type==2 && val!=this.headObj.case_type){
              this.fDefaultTitle(val,type);
            }
          },
          (error) => {}
        )

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            //this.getRedTitle = getDataOptions;
          },
          (error) => {}
        )

      
    
    
  }

  fDefaultTitle(caseType:any,type:any){
      //========================== ptitle ====================================    
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='1'",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
  
      var student2 = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='2'",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
  
      //console.log("fDefaultTitle :"+student2)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          
          if(type==2 && caseType!=this.headObj.case_type){
            this.result.title = getDataOptions[0].fieldIdValue;
          }else{
            this.result.title = this.headObj.title;
          }

        },
        (error) => {}
      )
  
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          if(type==2 && caseType!=this.headObj.case_type)
            this.result.red_title = getDataOptions[0].fieldIdValue;
          else
            this.result.red_title = this.headObj.title;
        },
        (error) => {}
      )
  
      });
      return promise;
    
  }


  copyCaseData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.litData.length){
			  confirmBox.setMessage('กรุณาเลือกคู่ความ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
		}else{
      this.onCopyData.emit(this.litData);
    }
  }

  getLitData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.court_id){
      confirmBox.setMessage('กรุณาเลือกคดีของศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.seq = '';
          this.result.name = '';
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.id || !this.result.yy){
      confirmBox.setMessage('กรุณาระบุเลขคดีดำให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.seq = '';
          this.result.name = '';
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.lit_type){
      confirmBox.setMessage('กรุณาเลือกประเภทคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.seq = '';
          this.result.name = '';
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();
      var jsonTmp = $.extend({}, this.result);
          jsonTmp['userToken'] = this.userData.userToken;
      console.log(jsonTmp)
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantAddress', jsonTmp , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            this.litData = productsJson.data;
            this.result.address = productsJson.data[0].address_desc;
            this.result.name = productsJson.data[0].name;
            this.SpinnerService.hide();
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){
                this.result.seq = this.result.name = this.result.address = '';
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
    }
  }

  changeLitType(){
    this.result.seq = this.result.name = this.result.address = '';
  }

}
