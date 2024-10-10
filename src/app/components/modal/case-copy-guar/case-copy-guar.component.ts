import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
// import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
@Component({
  selector: 'app-case-copy-guar',
  templateUrl: './case-copy-guar.component.html',
  styleUrls: ['./case-copy-guar.component.css']
})
export class CaseCopyGuarComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  resultTmp:any;
  getCourt:any;
  court_id:any;
  getCaseType:any;
  getCaseTitle:any;selCaseTitle:any;
  getCopy:any;
  getTitle:any;
  getRedTitle:any;
  getGuarPeriod:any;
  selIdStart:any;selIdEnd:any;selCaseYear:any;
  selCurDate:any;
  headObj:any;
  mediate:any;
  // modal_name="modal-case-copy-guar";
  @Output() onCopyData = new EventEmitter<any>();
  @Input() set headData(headData: any) {
    this.headObj = headData;
    this.getMediate();//เช็คไกล่เกลี่ย
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
    // public activeModal: NgbActiveModal,
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
    this.result.num_case = 1;
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
    //======================== pguartitle ======================================
    var student = JSON.stringify({
      "table_name" : "pguar_title",
      "field_id" : "guar_title",
      "field_name" : "guar_title",
      "condition" : "",
      "order_by" : " title_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTitle = getDataOptions;
        this.result.guar_title = getDataOptions[1].fieldNameValue;
        this.result.contract_title = getDataOptions[1].fieldNameValue;
        console.log(student);
        console.log(getDataOptions);
      },
      (error) => {}
    )
    //======================== pguar_period ======================================
    var student = JSON.stringify({
      "table_name" : "pguar_period",
      "field_id" : "guar_period_id",
      "field_name" : "guar_period_name",
      "condition" : "",
      "order_by" : " guar_period_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: '-----เลือก-----'});
        this.getGuarPeriod = getDataOptions;
        console.log(student);
        console.log(getDataOptions);
      },
      (error) => {}
    )
    //======================== สำเนาจาก	 ======================================
    this.getCopy = [{fieldIdValue:1,fieldNameValue: 'หมายเลขคดีดำ'},{fieldIdValue:2,fieldNameValue: 'คดีผัดฟ้อง/ฝากขัง'}];
    this.result.from_type = 1;
    //console.log($("body").find("ng-select#title span.ng-value-label").html())
    if(this.headObj.id){
      this.result.pid1 = this.headObj.id;
      this.result.pid2 =  this.headObj.id;
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear()+543;
    this.result.id = this.headObj.id;
    this.result.yy = yyyy;
    this.result.guar_period = 0;
    // this.result.case_date = dd+"/"+mm+"/"+yyyy;

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
  reloadPage(){
    console.log(this.resultTmp)
    this.result = $.extend([],this.resultTmp);
    console.log(this.result)
    this.changeCaseType(this.result.c_type,2)
    this.fCaseTitle(this.result.c_type,1);
    this.court_id = this.result.court_id;
  }
  ngAfterContentInit() : void{
    /*
    console.log(this.mediate)
    this.result.pros_flag = true;
    this.result.alle_flag = true;
    this.result.app_flag = true;
    this.result.order_judge_flag = true;
    this.result.order_date_flag = true;
    */
   //console.log('ngAfterContentInit')
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
            this.result.ptitle = this.headObj.title;
            this.result.title = this.headObj.title;
            this.result.red_title = this.headObj.title;
            this.result.case_type = this.result.c_type;
            this.fCaseTitle(val,type);
          }else{
            this.fDefaultMainTitle(val);
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
      this.resultTmp = $.extend({}, this.result);

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
            }else{
              this.checkDiffTitle();
            }
          },
          (error) => {}
        )

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getRedTitle = getDataOptions;
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
          this.checkDiffTitle();
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

  fDefaultMainTitle(caseType:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='1'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });
    let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            if(caseType!=this.headObj.case_type)
              this.result.ptitle = getDataOptions[0].fieldIdValue;
            else
              this.result.ptitle = this.headObj.title;
            this.checkDiffTitle();
          },
          (error) => {}
        )
      });
    return promise;
  }

  copyCaseData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.pid || !this.result.pyy){
			  confirmBox.setMessage('ป้อนข้อมูลสำเนาจากเลขที่คำร้อง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
		}else if(!this.result.guar_period){
			confirmBox.setMessage('ป้อนข้อมูลประกันระหว่่าง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
		}else{
      // if(this.result.c_type != this.result.case_type){
      //   confirmBox.setMessage('คุณทำการสำเนาข้อมูลคดีที่มีความต่างประเภท ระบบจะไม่ทำการคัดลอกฐานความผิดไปยังคดีใหม่');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if(resp.success==true){}
      //     subscription.unsubscribe();
      //   });
      // }

      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการสำเนาข้อมูลคดี');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){

          this.SpinnerService.show();

          // var jsonTmp = $.extend({}, this.result);
          // jsonTmp['run_id'] = this.headObj.run_id;
          // jsonTmp['allData'] = 1 ;
          // jsonTmp['userToken'] = this.userData.userToken;
          // var student = jsonTmp;
          var student = JSON.stringify({
            "guar_title" : this.result.ptitle,
            "guar_no" : this.result.pid,
            "guar_yy" : this.result.pyy,
            "guar_period" : this.result.guar_period,
            "guar_title1" : this.result.title,
            "guar_no1" : this.result.id,
            "guar_yy1" : this.result.yy,
            "userToken" : this.userData.userToken
          });
          console.log(student);
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/copyData', student , {headers:headers}).subscribe(
            (response) =>{
                let productsJson : any = JSON.parse(JSON.stringify(response));
                console.log(productsJson)
                if(productsJson.result==1){
                  confirmBox.setMessage(productsJson.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                     layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if(resp.success==true){
                      this.onCopyData.emit({'guar_running' : productsJson.guar_running});
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });

                }else{
                  confirmBox.setMessage(productsJson.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                     layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if(resp.success==true){
                      this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                }
                //console.log(productsJson)

            },
            (error) => {}
          )
        }
        subscription.unsubscribe();
      });

    }
		//alert('โปรแกรมจะทำการสำเนาข้อมูลคดี ฐานความผิด คู่ความ ทุนทรัพย์ไม่รวมข้อมูลนัดความและข้อมูลหมาย');
  }

  checkDiffTitle(){
    //console.log(event)
    if(this.result.ptitle != this.result.title){
      this.result.group_flag = 1;
    }else{
      this.result.group_flag = null;
    }
  }

  countNumCase(event:any){
    if(this.result.num_case && parseInt(this.result.num_case) > parseInt(this.userData.copyLimit)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('สร้างเลขคดีได้ไม่เกิน '+this.userData.copyLimit+' เลขเท่านั้น');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.num_case = 1;
          this.result.pid2 = this.result.pid1;
        }
        subscription.unsubscribe();
      });
    }else{
      this.result.pid2 = parseInt(this.result.pid1) + (parseInt(event.target.value)-1);
    }
  }

  caseIdValue(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(parseInt(this.result.pid1) > parseInt(this.result.pid2)){
      confirmBox.setMessage('ระบุเลขผิดพลาด เลขคดีเริ่มมากกว่าเลขคดีสิ้นสุด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.num_case = 1;
          this.result.pid2 = this.result.pid1;
        }
        subscription.unsubscribe();
      });
    }else if((parseInt(this.result.pid2) - parseInt(this.result.pid1)) > parseInt(this.userData.copyLimit)){
      confirmBox.setMessage('สร้างเลขคดีได้ไม่เกิน '+this.userData.copyLimit+' เลขเท่านั้น');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.result.num_case = 1;
          this.result.pid2 = this.result.pid1;
        }
        subscription.unsubscribe();
      });
    }
  }

  getMediate(){
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_flag",
      "condition" : " AND case_type="+this.headObj.case_type+" AND case_cate_id="+this.headObj.case_cate_id,
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        if(getDataOptions.length){
          if(getDataOptions[0].fieldNameValue==1)
            this.setDefaultCheck(1);//this.mediate = 1;
          else
            this.setDefaultCheck('');//this.mediate = null;
        }else{
          this.setDefaultCheck('');//this.mediate = null;
        }
      },
      (error) => {}
    )
  }

  setDefaultCheck(val:any) : void{

    if(!val){
      this.result.pros_flag= true;
      this.result.accu_flag= false;
      this.result.lit_flag= false;
      this.result.ath_flag= false;
      this.result.alle_flag= true;

      this.result.deposit_flag= false;
      this.result.app_flag=true;
      this.result.notice_flag=false;
      this.result.judge_flag=false;
      this.result.order_judge_flag=true;
      this.result.order_date_flag=true;
    }else{
      this.result.pros_flag= true;
      this.result.accu_flag= true;
      this.result.lit_flag= true;
      this.result.ath_flag= true;
      this.result.alle_flag= true;

      this.result.deposit_flag= true;
      this.result.app_flag=false;
      this.result.notice_flag=false;
      this.result.judge_flag=false;
      this.result.order_judge_flag=false;
      this.result.order_date_flag=false;
    }


  }


}
