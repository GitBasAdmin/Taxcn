import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
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
//import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-judge-appoint,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './judge-appoint.component.html',
  styleUrls: ['./judge-appoint.component.css']
})


export class JudgeAppointComponent implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  myExtObject: any;
  getMonthTh:any;
  result:any = [];
  sessData:any;
  userData:any;
  programName:any;
  modalType:any;
  displayTable:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalJudgeComponent: boolean = false;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
  ){ }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // this.getMonthTh = [{"fieldIdValue": 1, "fieldNameValue": "มกราคม"},{"fieldIdValue": 2, "fieldNameValue": "กุมภาพันธ์"},{"fieldIdValue": 3,"fieldNameValue": "มีนาคม"},{ "fieldIdValue": 4,"fieldNameValue": "เมษายน"},{"fieldIdValue": 5,"fieldNameValue": "พฤษภาคม"},{"fieldIdValue": 6,"fieldNameValue": "มิถุนายน"},{"fieldIdValue": 7,"fieldNameValue": "กรกฎาคม"},{"fieldIdValue": 8,"fieldNameValue": "สิงหาคม"},{"fieldIdValue": 9,"fieldNameValue": "กันยายน"},{"fieldIdValue": 10,"fieldNameValue": "ตุลาคม"},{"fieldIdValue": 11,"fieldNameValue": "พฤศจิกายน"},{"fieldIdValue": 12,"fieldNameValue": "ธันวาคม"}];
    this.getMonthTh = [{"fieldIdValue": '1', "fieldNameValue": "มกราคม"},
    {"fieldIdValue": '2', "fieldNameValue": "กุมภาพันธ์"},
    {"fieldIdValue": '3',"fieldNameValue": "มีนาคม"},
    {"fieldIdValue": '4',"fieldNameValue": "เมษายน"},
    {"fieldIdValue": '5',"fieldNameValue": "พฤษภาคม"},
    {"fieldIdValue": '6',"fieldNameValue": "มิถุนายน"},
    {"fieldIdValue": '7',"fieldNameValue": "กรกฎาคม"},
    {"fieldIdValue": '8',"fieldNameValue": "สิงหาคม"},
    {"fieldIdValue": '9',"fieldNameValue": "กันยายน"},
    {"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},
    {"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},
    {"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.result.judge_id = params['judge_id']?params['judge_id']:'';
      this.result.judge_name = params['judge_name']?params['judge_name']:'';
      this.result.month = params['month']?parseInt(params['month']).toString():parseInt(myExtObject.curMonth()).toString();
      this.result.year = params['year']?params['year']:myExtObject.curYear();
      if(this.result.judge_id && this.result.month && this.result.year){
        this.searchData();
      }
    });
      this.successHttp();
  }

  successHttp() {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "judge_appoint"
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

    receiveJudgeListData(event:any){
      this.result.judge_id=event.judge_id;
      this.result.judge_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();      
    }

    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        this.loadModalJudgeComponent = true;
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
            (response) =>{
             let productsJson : any = JSON.parse(JSON.stringify(response));
             if(productsJson.data.length){
               this.list = productsJson.data;
             }else{
               this.list = [];
             }
            },
            (error) => {}
          )
      }
    }

    closeModal(){
      this.loadModalJudgeComponent = false;
    }

    searchData(){
      const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        if(!this.result.judge_id || !this.result.month || !this.result.year){
          confirmBox.setMessage('กรุณาระบุข้อมูลสำหรับการค้นหาให้ครบถ้วน');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          var student = JSON.stringify({
            "judge_id" : this.result.judge_id,
            "month" : this.result.month.toString(),
            "year" : this.result.year,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/judgeAppointData', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  var bar = new Promise((resolve, reject) => {
                    this.displayTable = getDataOptions.data;
                  });
                  if(bar){
                    let winURL = window.location.href.split("/#/")[0]+"/#/";
                    setTimeout(() => {
                      $("body").find(".showDisPlay table").find("tr td span.fmg0200").each(function(){
                        //console.log($(this).attr("onclick","window.open('"+winURL+"',1,'height=400,width=800,resizable,scrollbars,status')"));
                        $(this).css({'color':'blue','cursor':'pointer'});
                        //$(this).attr("onclick",window.open(winURL+'fmg0200?run_id='+$(this).text().split(' ')[1],'fmg0200'));
                        $(this).attr("onclick","window.open('"+winURL+"fmg0200?run_id="+$(this).attr("class").split(' ')[1]+"',1,'height="+(screen.height-125)+",width="+(screen.width-100)+",resizable,scrollbars,status')")
      
                      })
                    }, 1000);
                  }
                    
                  //-----------------------------//
              }else{
                //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){}
                    subscription.unsubscribe();
                  });
                //-----------------------------//
              }

            },
            (error) => {}
          )
        }
    }

    tabChangeInput(name:any,event:any){
      if(name=='judge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.judge_name = productsJson[0].fieldNameValue;
          }else{
            this.result.judge_id = '';
            this.result.judge_name = '';
          }
          },
          (error) => {}
        )
      }
    }

    closeWin(){
      window.close();
    }

    openPrint(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      myExtObject.OpenWindowMaxName(winURL+'prap5500?judge_id='+this.result.judge_id+'&judge_name='+this.result.judge_name+'&month='+this.result.month+'&year='+this.result.year,'prap5500');
    }

}







