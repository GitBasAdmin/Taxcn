import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from '@app/services/print-report.service';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var myExtObject: any;
@Component({
  selector: 'app-fgu0100-main',
  templateUrl: './fgu0100-main.component.html',
  styleUrls: ['./fgu0100-main.component.css']
})
export class Fgu0100MainComponent implements AfterViewInit, OnInit, OnDestroy {
  widthSet:any;
  myExtObject: any;
  dtOptions2: DataTables.Settings = {};
  sendHead:any;
  dataHeadValue:any = [];
  posts:any;
  dataHead:any;
  sendEdit:any;
  result:any = [];
  RelateDataObj:any = [];
  KeepDataObj:any = [];
  dataSearch:any =[];
  getGuarPeriod:any;
  eventSearch = 0;
  getEndBy:any;
  sessData:any;
  userData:any;
  GuarMainObj:any;
  getGuarEndBy:any;
  guarRunning:any;
  tab:any;
  getTitle:any;
  delIndex:any;
  modalType:any;
  dtTrigger: Subject<any> = new Subject<any>();
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalConfComponent: boolean = false;
  public loadModalListMultiComponent: boolean = false;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;
  public loadModalConfComponent_main: boolean = false;
  public loadCopyComponent : boolean = false;
  public loadAppealComponent : boolean = false;

  @Input() set getDataHead(getDataHead: any) {//รับจาก fgu0100 เลขคดี
    console.log(getDataHead)
    if(typeof getDataHead !='undefined'){
      // console.log(getDataHead.data[0].run_id);
      console.log("EventSearch==>",this.eventSearch);
      this.sendHead = getDataHead;
      if(this.sendHead.run_id)
        console.log(this.sendHead.run_id)
        this.dataHeadValue.run_id = this.sendHead.run_id;
        if(this.dataHeadValue.run_id){
          this.result.run_id = this.dataHeadValue.run_id;
        }
        console.log("ReSultRuNId==>",this.result.run_id);
        console.log("EventSearch==>",this.eventSearch);
        if(this.eventSearch == 0 && this.result.run_id){
          console.log("SETDEFPAGE");
          this.setDefPage();
          this.RelateData();
         }
         this.eventSearch = 0;

        // this.getGuarData(this.sendHead.run_id);
    }
  }
  @Output() onClickList = new EventEmitter<any>();
  @Output() sendCaseData = new EventEmitter<any>();
  @Input() set guar_running(guar_running: any) {//รับ guar_running จาก fgu0100
    console.log(guar_running)
    if(typeof guar_running !='undefined'){
      this.guarRunning = guar_running;
    }
  }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('tabGroup',{static: true}) tabGroup : ElementRef;
  @ViewChild('openCopyCaseGuarButton',{static: true}) openCopyCaseGuarButton : ElementRef;
  @ViewChild('openGuarAppealButton',{static: true}) openGuarAppealButton : ElementRef;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };

   

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

    //======================== pguar_end_by ======================================
    var student = JSON.stringify({
      "table_name" : "pguar_end_by",
      "field_id" : "end_by",
      "field_name" : "end_by_name",
      "condition" : "",
      "order_by" : " end_by ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getGuarEndBy = getDataOptions;
        console.log(student);
        console.log(getDataOptions);
      },
      (error) => {}
    )

    this.setDefPage();
    //==============================================================
    //console.log(this.sendHead.run_id)
    //if(this.sendHead.run_id)
      //this.getGuarData(this.sendHead.run_id);
  }

  setDefPage(){
    this.result = [];
    console.log('tab1==> ',this.getDataHead);
    this.result.guar_date = myExtObject.curDate();
    this.result.guar_time = this.getTime();
    this.result.guar_yy = myExtObject.curYear();
    this.result.contract_yy = myExtObject.curYear();
    this.result.guar_period = 0;
    this.tabGroup['_indexToSelect'] = 0;
    this.widthSet="130%";
    // this.result.guar_title = this.getTitle[1].fieldNameValue;
    // this.result.contract_title = this.getTitle[1].fieldNameValue;

    // this.result.judging_date = myExtObject.curDate();
    // this.result.judge_deposit = '0.00';
    this.getTitleData();
  }

  getTitleData(){
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
  }

  clearContract(){
    this.result.contract_title = this.getTitle[1].fieldNameValue;
    this.result.contract_no = '';
    this.result.contract_yy = myExtObject.curYear();
  }

  getTime(){
    var time = new Date();
    var cursecond = time.getSeconds();
    var scursecond = cursecond.toString();
    var minutes = time.getMinutes();
    var sminutes = minutes.toString();
    var hours = time.getHours();
    var shours = hours.toString();
    console.log(typeof(cursecond))
      // return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)+":"+(scursecond.length==1 ? "0"+scursecond : scursecond)); //xx:xx:xx
      return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)); //xx:xx
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
    setTimeout(() => {
    this.runGuarNo(0);
    this.runContractNo(0);
    }, 500);
  }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    receiveCopyData(event:any){
      console.log(event)
      if(event.guar_running){
        // this.result.gaur_running = event.guar_running;
        this.searchMainData(3,event.guar_running);
      }

      this.closebutton.nativeElement.click();
    }

    loadCopyCaseComponent(){
      this.loadCopyComponent = true;
      this.loadModalConfComponent = false;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadAppealComponent = false;
      // $("#exampleModal_main").find(".modal-content").css("width","650px");
      $("#exampleModal").find(".modal-content").css({"width":"650px"});
      $("#exampleModal").find(".modal-body").css("height","auto");
      $("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    }

    loadGuarAppealComponent(){
      this.modalType = 2;
      // alert('loadGuarAppealComponent');
      this.loadCopyComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadAppealComponent = true;
      // $("#exampleModal_main").find(".modal-content").css("width","650px");
      $("#exampleModal").find(".modal-content").css({"width":"650px"});
      $("#exampleModal").find(".modal-body").css("height","auto");
      $("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    }

    RelateData(){
      console.log('dataHeadValue==>',this.dataHeadValue.run_id);
      console.log('result.run_id==>',this.result.run_id);
      if(this.dataHeadValue.run_id || this.result.run_id){
        var student = JSON.stringify({
          "run_id": this.dataHeadValue.run_id ? this.dataHeadValue.run_id : this.result.run_id,
          "guar_running": this.result.guar_running ? this.result.guar_running : null,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let promise = new Promise((resolve, reject) => {
          this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getRelateData', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            if(getDataOptions.result==1){
              console.log(getDataOptions);
              this.RelateDataObj = getDataOptions.data;
              console.log('ReLateData==>',this.RelateDataObj);
              if(this.RelateDataObj.length > 0){
                this.result.guar_relate = this.RelateDataObj[0].guar_relate;
              }else{
                this.result.guar_relate = '';
              }

              // this.getHeadNew();
              // this.sendCaseData.emit(this.headnew);
            }
          },
          (error) => {}
        )
        });
        return promise;
      }
    //  }
    }

    delGuarMain(){
      const confirmBox3 = new ConfirmBoxInitializer();
      confirmBox3.setTitle('ยืนยันการลบเลขที่คำร้อง');
      confirmBox3.setMessage('ต้องการลบเลขที่คำร้อง ใช่หรือไม่');
      confirmBox3.setButtonLabels('ตกลง', 'ยกเลิก');

        confirmBox3.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
            if(resp.success==true){

      var dataDel = [],dataTmp=[];
      var bar = new Promise((resolve, reject) => {
      // this.seekNoData.forEach((ele, index, array) => {
      //  // if(ele.edit0102 == true){
      //  if(ele.s_seq == this.delIndexAlle){
      //    dataTmp.push(this.seekNoData[index]);
      //   }
      //     });
        });
          if(bar){

            var student = JSON.stringify({
              "guar_running" : this.result.guar_running,
              "userToken" : this.userData.userToken
            });
            console.log(student);
            this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/deleteData', student ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
               if(alertMessage.result==0){
                  this.getMessage(alertMessage.error);
                  // this.SpinnerService.hide();

                }else{
                           // this.closebutton.nativeElement.click();
                            //$("button[type='reset']")[0].click();
                            const confirmBox = new ConfirmBoxInitializer();
                            confirmBox.setTitle('ข้อความแจ้งเตือน');
                            confirmBox.setMessage('ลบเลขที่คำร้องแล้ว');
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if(resp.success==true){
                              console.log(alertMessage);
                              // this.result.guar_no = this.result.guarnext_no;
                              this.searchMainData(1,'');
                              // this.runGuarNo(0);
                             // this.searchSeekData();
                                // this.closebutton.nativeElement.click();
                                // this.searchSeekData();
                                // this.searchData(2);
                              }
                              subscription.unsubscribe();
                            });

                          }
                        },
                        (error) => {}
                      )
                }

            }
            subscription3.unsubscribe();
        });
       this.closebutton.nativeElement.click();
    }


    delGuarContract(){
      const confirmBox3 = new ConfirmBoxInitializer();
      confirmBox3.setTitle('ยืนยันการลบเลขที่สัญญา');
      confirmBox3.setMessage('ต้องการลบเลขที่สัญญา ใช่หรือไม่');
      confirmBox3.setButtonLabels('ตกลง', 'ยกเลิก');

        confirmBox3.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
            if(resp.success==true){

      var dataDel = [],dataTmp=[];
      var bar = new Promise((resolve, reject) => {
      // this.seekNoData.forEach((ele, index, array) => {
      //  // if(ele.edit0102 == true){
      //  if(ele.s_seq == this.delIndexAlle){
      //    dataTmp.push(this.seekNoData[index]);
      //   }
      //     });
        });
          if(bar){
            //console.log(dataTmp)
            // dataDel['run_id'] = this.result.run_id;
            // // console.log('hResult==>',this.Head.hResult.case_type);
            // dataDel['case_type'] = this.result.case_type;
            // dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
            // dataDel['title'] = this.result.title;
            // dataDel['id'] = this.result.id;
            // dataDel['yy'] = this.result.yy;
            // dataDel['court_id'] = this.userData.courtId;
            // dataDel['num_nofrom'] = this.result.num_nofrom ? parseInt(this.result.num_nofrom) : 1;
            // if(this.result.guar_running){
            //   console.log('Oldddddddddddd');
            //   // console.log(this.caseDataObj);
            //   dataTmp.push($.extend({}, this.result));
            //   // dataDel['data'] = this.caseDataObj.data;
            //   dataDel['data'] = dataTmp;
            //   // dataDel['data'] = this.caseDataObj.data;
            //   // dataDel['seek_no_data'] = this.caseDataObj.seek_data[0].seek_no_data;
            // }else{
            //   console.log('Newwwwwwwwwwwwww');
            //   dataTmp.push($.extend({}, this.result));
            //   // dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
            //   dataDel['data'] = dataTmp;
            //   dataDel['gen_guar'] = 1;
            //   // dataDel['seek_no_data'] = [];
            // }
            // dataDel['guar_running'] = this.result.guar_running ? this.result.guar_running : '';
            // dataDel['userToken'] = this.userData.userToken;
            // var data = $.extend({}, dataDel);
            // console.log(data);
            // console.log(JSON.stringify(data));
            // return false;
            var student = JSON.stringify({
              "guar_running" : this.result.guar_running,
              "data" : [{"contract_title" : null,"contract_no" : null,"contract_yy" : null,"run_id": this.result.run_id,"guar_running": this.result.guar_running}],
              "userToken" : this.userData.userToken
            });
            console.log(student);
            this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/saveData', student ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
               if(alertMessage.result==0){
                  this.getMessage(alertMessage.error);
                  // this.SpinnerService.hide();

                }else{
                           // this.closebutton.nativeElement.click();
                            //$("button[type='reset']")[0].click();
                            const confirmBox = new ConfirmBoxInitializer();
                            confirmBox.setTitle('ข้อความแจ้งเตือน');
                            confirmBox.setMessage('ลบเลขที่สัญญาแล้ว');
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if(resp.success==true){
                              console.log(alertMessage);
                              // this.result.guar_no = this.result.guarnext_no;
                              this.searchMainData(1,'');
                              // this.runGuarNo(0);
                             // this.searchSeekData();
                                // this.closebutton.nativeElement.click();
                                // this.searchSeekData();
                                // this.searchData(2);
                              }
                              subscription.unsubscribe();
                            });

                          }
                        },
                        (error) => {}
                      )
                }

            }
            subscription3.unsubscribe();
        });
       this.closebutton.nativeElement.click();
    }

    copyGuarMain(){
      if(this.result.guar_running){
        const confirmBox2 = new ConfirmBoxInitializer();
        confirmBox2.setTitle('ยืนยันการสำเนาเลขที่คำร้อง');
        confirmBox2.setMessage('ต้องการสำเนาเลขที่คำร้อง ใช่หรือไม่');
        confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

          confirmBox2.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){
          var dataDel = [],dataTmp=[];
          var bar = new Promise((resolve, reject) => {

            });
              if(bar){
                  console.log('Coppppppppy');
                  dataTmp.push($.extend({}, this.result));
                // dataDel['data'] = dataTmp;
                  // dataDel['gen_guar'] = 1;
                dataDel['guar_running'] = this.result.guar_running ? this.result.guar_running : '';
                dataDel['userToken'] = this.userData.userToken;
                var data = $.extend({}, dataDel);
                console.log(data);
                console.log(JSON.stringify(data));
                // return false;
                this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/copyData', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                   if(alertMessage.result==0){
                      this.getMessage(alertMessage.error);
                      // this.SpinnerService.hide();

                    }else{
                               // this.closebutton.nativeElement.click();
                                //$("button[type='reset']")[0].click();
                                const confirmBox = new ConfirmBoxInitializer();
                                confirmBox.setTitle('ข้อความแจ้งเตือน');
                                confirmBox.setMessage(alertMessage.error);
                                confirmBox.setButtonLabels('ตกลง');
                                confirmBox.setConfig({
                                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                });
                                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                  if(resp.success==true){
                                  console.log(alertMessage);
                                  this.result.guar_no = this.result.guarnext_no;
                                  this.searchMainData(1,'');
                                  }
                                  subscription.unsubscribe();
                                });

                              }
                            },
                            (error) => {}
                          )
                    }
                  }
                  subscription2.unsubscribe();
              });
             this.closebutton.nativeElement.click();
           }else{
             this.getMessage('ยังไม่มีข้อมูลคำร้องที่ต้องการทำสำเนา');
           }
    }


    saveGuarMain(type:any){
      if(this.result.guar_period){
        if(type==1){
        const confirmBox2 = new ConfirmBoxInitializer();
        confirmBox2.setTitle('ยืนยันการสร้างเลขที่คำร้อง');
        confirmBox2.setMessage('ต้องการสร้างเลขที่คำร้อง ใช่หรือไม่');
        confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

          confirmBox2.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){

        var dataDel = [],dataTmp=[];
        var bar = new Promise((resolve, reject) => {
        // this.seekNoData.forEach((ele, index, array) => {
        //  // if(ele.edit0102 == true){
        //  if(ele.s_seq == this.delIndexAlle){
        //    dataTmp.push(this.seekNoData[index]);
        //   }
        //     });
          });
            if(bar){
              if(!this.result.run_id){
                this.result.run_id = this.dataHeadValue.run_id;
              }
              //console.log(dataTmp)
              // dataDel['run_id'] = this.result.run_id;
              // // console.log('hResult==>',this.Head.hResult.case_type);
              // dataDel['case_type'] = this.result.case_type;
              // dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
              // dataDel['title'] = this.result.title;
              // dataDel['id'] = this.result.id;
              // dataDel['yy'] = this.result.yy;
              // dataDel['court_id'] = this.userData.courtId;
              // dataDel['num_nofrom'] = this.result.num_nofrom ? parseInt(this.result.num_nofrom) : 1;
              if(this.result.guar_running){
                console.log('Oldddddddddddd');
                // console.log(this.caseDataObj);
                dataTmp.push($.extend({}, this.result));
                // dataDel['data'] = this.caseDataObj.data;
                dataDel['data'] = dataTmp;
                // dataDel['data'] = this.caseDataObj.data;
                // dataDel['seek_no_data'] = this.caseDataObj.seek_data[0].seek_no_data;
              }else{
                console.log('Newwwwwwwwwwwwww');
                console.log(this.result.run_id);
                // console.log(this.dataHeadValue.run_id);
                dataTmp.push($.extend({}, this.result));
                // dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
                dataDel['data'] = dataTmp;
                dataDel['gen_guar'] = 1;
                // dataDel['seek_no_data'] = [];
              }
              dataDel['guar_running'] = this.result.guar_running ? this.result.guar_running : '';
              dataDel['userToken'] = this.userData.userToken;
              var data = $.extend({}, dataDel);
              console.log(data);
              console.log(JSON.stringify(data));
              // return false;
              this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/saveData', data ).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                 if(alertMessage.result==0){
                    this.getMessage(alertMessage.error);
                    // this.SpinnerService.hide();

                  }else{
                             // this.closebutton.nativeElement.click();
                              //$("button[type='reset']")[0].click();
                              const confirmBox = new ConfirmBoxInitializer();
                              confirmBox.setTitle('ข้อความแจ้งเตือน');
                              confirmBox.setMessage(alertMessage.error);
                              confirmBox.setButtonLabels('ตกลง');
                              confirmBox.setConfig({
                                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                console.log(alertMessage);
                                this.result.guar_running = alertMessage.guar_running;
                                // if(this.result.guar_no == ''){
                                //   this.result.guar_no = this.result.guarnext_no;
                                // }
                                this.searchMainData(3,'');
                                // this.runGuarNo(0);
                               // this.searchSeekData();
                                  // this.closebutton.nativeElement.click();
                                  // this.searchSeekData();
                                  // this.searchData(2);
                                }
                                subscription.unsubscribe();
                              });

                            }
                          },
                          (error) => {}
                        )
                  }

              }
              subscription2.unsubscribe();
          });
         this.closebutton.nativeElement.click();
        }else{
          var dataDel = [],dataTmp=[];
          var bar = new Promise((resolve, reject) => {
          // this.seekNoData.forEach((ele, index, array) => {
          //  // if(ele.edit0102 == true){
          //  if(ele.s_seq == this.delIndexAlle){
          //    dataTmp.push(this.seekNoData[index]);
          //   }
          //     });
            });
              if(bar){
                //console.log(dataTmp)
                // dataDel['run_id'] = this.result.run_id;
                // // console.log('hResult==>',this.Head.hResult.case_type);
                // dataDel['case_type'] = this.result.case_type;
                // dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
                // dataDel['title'] = this.result.title;
                // dataDel['id'] = this.result.id;
                // dataDel['yy'] = this.result.yy;
                // dataDel['court_id'] = this.userData.courtId;
                // dataDel['num_nofrom'] = this.result.num_nofrom ? parseInt(this.result.num_nofrom) : 1;
                if(this.result.guar_running){
                  console.log('Oldddddddddddd');
                  // console.log(this.caseDataObj);
                  dataTmp.push($.extend({}, this.result));
                  // dataDel['data'] = this.caseDataObj.data;
                  dataDel['data'] = dataTmp;
                  // dataDel['data'] = this.caseDataObj.data;
                  // dataDel['seek_no_data'] = this.caseDataObj.seek_data[0].seek_no_data;
                }else{
                  console.log('Newwwwwwwwwwwwww');
                  dataTmp.push($.extend({}, this.result));
                  // dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
                  dataDel['data'] = dataTmp;
                  dataDel['gen_guar'] = 1;
                  // dataDel['seek_no_data'] = [];
                }
                dataDel['guar_running'] = this.result.guar_running ? this.result.guar_running : '';
                dataDel['userToken'] = this.userData.userToken;
                var data = $.extend({}, dataDel);
                console.log(data);
                console.log(JSON.stringify(data));
                // return false;
                this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/saveData', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                   if(alertMessage.result==0){
                      this.getMessage(alertMessage.error);
                      // this.SpinnerService.hide();

                    }else{
                               // this.closebutton.nativeElement.click();
                                //$("button[type='reset']")[0].click();
                                const confirmBox = new ConfirmBoxInitializer();
                                confirmBox.setTitle('ข้อความแจ้งเตือน');
                                confirmBox.setMessage(alertMessage.error);
                                confirmBox.setButtonLabels('ตกลง');
                                confirmBox.setConfig({
                                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                });
                                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                  if(resp.success==true){
                                  console.log(alertMessage);
                                  console.log(this.result.guarnext_no);
                                  if(this.result.guar_no == ''){
                                    this.result.guar_no = this.result.guarnext_no;
                                  }
                                  // this.searchMainData(1,'');
                                  // this.runGuarNo(0);
                                 // this.searchSeekData();
                                    // this.closebutton.nativeElement.click();
                                    // this.searchSeekData();
                                    // this.searchData(2);
                                  }
                                  subscription.unsubscribe();
                                });

                              }
                            },
                            (error) => {}
                          )
                    }
        }
           }else{
             this.getMessage('เลือกข้อมูลประกันระหว่างก่อน');
           }
        }

      openCopyCaseGuar(){
          //$(".modal").find(".modalOpen").click();
        this.openCopyCaseGuarButton.nativeElement.click();
      }

      openGuarAppeal(){
        //$(".modal").find(".modalOpen").click();
      this.openGuarAppealButton.nativeElement.click();
    }

    runGuarNo(type:any){
    //  if(!this.result.guar_no){
       console.log(this.result.guar_title);
       console.log(this.result.guar_yy);
      if(this.result.guar_title && this.result.guar_yy){
        // alert('runGuarlast');
        var student = JSON.stringify({
          "guar_title": this.result.guar_title,
          "guar_yy": this.result.guar_yy,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let promise = new Promise((resolve, reject) => {
          this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/runGuarNo', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            if(getDataOptions.result==1){
              console.log(getDataOptions);
              this.result.guarmax_no = getDataOptions.guar_no;
              this.result.guarnext_no = getDataOptions.guar_no + 1;
              console.log('guarMaxNo==>',this.result.guarmax_no);
              console.log('guarNextNo==>',this.result.guarnext_no);
              if(!this.result.guar_no && type == 1){
                this.result.guar_no = this.result.guarnext_no;
              }
              // this.getHeadNew();
              // this.sendCaseData.emit(this.headnew);
            }
          },
          (error) => {}
        )
        });
        return promise;
      }
      // }
    }

    runContractNo(type:any){
      // if(!this.result.id){
      if(this.result.contract_title && this.result.contract_yy){
        var student = JSON.stringify({
          "contract_title": this.result.contract_title,
          "contract_yy": this.result.contract_yy,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let promise = new Promise((resolve, reject) => {
          this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/runContractNo', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            if(getDataOptions.result==1){
              console.log(getDataOptions);
              this.result.contractmax_no = getDataOptions.contract_no;
              this.result.contractnext_no = getDataOptions.contract_no + 1;
              console.log('contractMaxNo==>',this.result.contractmax_no);
              console.log('contractNextNo==>',this.result.contractnext_no);
              if(!this.result.contract_no && type == 1){
                this.result.contract_no = this.result.contractnext_no;
              }
              // this.getHeadNew();
              // this.sendCaseData.emit(this.headnew);
            }
          },
          (error) => {}
        )
        });
        return promise;
      }
    //  }
    }

    searchMainData(type:any,guar_running:any){
      if(guar_running){
        console.log('GuarRunning==>',guar_running);
        this.result.guar_running = guar_running;
      }
      // if(this.result.guar_title && this.result.guar_no && this.result.guar_yy){
      if(type==1){
         var student = JSON.stringify({
          "guar_title": this.result.guar_title,
          "guar_no" : this.result.guar_no,
          "guar_yy": this.result.guar_yy.toString(),
          "userToken" : this.userData.userToken
        });

        if(!this.result.guar_no){
          return false;
        }
      }else if(type==2){
        var student = JSON.stringify({
          "contract_title": this.result.contract_title,
          "contract_no" : this.result.contract_no,
          "contract_yy": this.result.contract_yy.toString(),
          "userToken" : this.userData.userToken
        });
        if(!this.result.contract_no){
          return false;
        }
      }else if(type==3){
        var student = JSON.stringify({
          "guar_running": this.result.guar_running,
          "userToken" : this.userData.userToken
        });
      }
        console.log(student)
        let promise = new Promise((resolve, reject) => {
          this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getGuaranteeData', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions);
            if(getDataOptions.result==1){
              this.clearContract();
              this.GuarMainObj = getDataOptions;
              this.KeepDataObj = this.GuarMainObj.keep_asset;
              this.posts = getDataOptions.data;
              this.sendCaseData.emit(this.GuarMainObj);
              this.onClickListData(this.GuarMainObj.data[0]);
              // this.hResult.red_id = getDataOptions.red_id;
              console.log('GuarMainObj==>',this.GuarMainObj);
              console.log('GuarMainObjData==>',this.GuarMainObj.data[0]);
              console.log('KeepAsset==>',this.KeepDataObj);
              // this.loadHead();
              this.AssignGuarMain(this.GuarMainObj);
              this.RelateData();
              this.sendEdit = {'data':this.GuarMainObj,'counter' : Math.ceil(Math.random()*10000)}
              this.tabGroup['_indexToSelect'] = 0;
              this.eventSearch = 1;
              console.log("GETDATAHEAD==>",this.getDataHead);
              console.log(this.result.run_id);
              // if(this.getDataHead.data[0].length > 0){
              //   this.result.run_id = this.getDataHead.data[0].run_id;
              // }
            }else{
              this.getMessage(getDataOptions.error);
            }
          },
          (error) => {}
        )
        });
        return promise;
      // }
    }

    AssignGuarMain(obj:any){
        var objData = obj.data;
      if(obj.data.length > 0){
        this.result.run_id = objData[0].run_id;
        if(this.result.run_id){
          this.dataHeadValue.run_id = this.result.run_id;
        }
        this.result.all_def_name = objData[0].all_def_name;
        this.result.guar_running = objData[0].guar_running;
        this.result.guar_period = objData[0].guar_period;
        this.result.guar_date = objData[0].guar_date;
        this.result.guar_time = objData[0].guar_time;
        this.result.guar_title = objData[0].guar_title;
        this.result.guar_no = objData[0].guar_no;
        this.result.guar_yy = objData[0].guar_yy;
        this.result.contract_title = objData[0].contract_title;
        if(objData[0].contract_no){
          this.result.contract_no = objData[0].contract_no;
        }
        this.result.contract_yy = objData[0].contract_yy;
        this.result.end_by = objData[0].end_by;
        this.result.end_date = objData[0].end_date;
        this.result.appeal_detail = objData[0].appeal_detail;
        this.result.date_appoint = objData[0].date_appoint;
        this.result.time_appoint = objData[0].time_appoint;
        this.result.app_id = objData[0].app_id;
        this.result.app_name = objData[0].app_name;
        this.result.remark = objData[0].remark;
        this.result.def_name = objData[0].def_name;
        this.result.create_dep_name = objData[0].create_dep_name;
        this.result.create_user = objData[0].create_user;
        this.result.create_date = objData[0].create_date;
        this.result.update_dep_name = objData[0].update_dep_name;
        this.result.update_user = objData[0].update_user;
        this.result.update_date = objData[0].update_date;
        this.runGuarNo(0);
        this.runContractNo(0);
      }
    }

    getMessage(message:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage(message);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){}
        subscription.unsubscribe();
      });
    }

    delMessage(type:any,message:any){
      if(!this.result.guar_running){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage(message);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        if(type==1){
          this.delGuarContract();
        }else if(type==2){
          this.delGuarMain();
          // alert('ลบเลขที่คำร้อง');
        }

        // this.delTypeApp = type;
        // this.openbutton.nativeElement.click();
      }
    }

    goToPage(toPage:any,keep_running:any){
      let winURL = window.location.href;
      if(keep_running){
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage+'?run_id='+this.result.run_id+'&keep_running='+keep_running;
      }else{
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage;
      }

      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=600");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    onClickListData(data:any): void {
      this.onClickList.emit(data)
    }

    assignWidth(obj:any){
      //console.log(obj.index)
      //console.log(obj)
      this.tab = {'tabIndex' : obj.index,'counter' : Math.ceil(Math.random()*10000)}
      console.log(obj.index)
      console.log(this.sendEdit)
      // if(obj.index!=0 && (!this.sendEdit || this.sendEdit.data.guar_running==0)){
      //   //alert(99)
      //   const confirmBox = new ConfirmBoxInitializer();
      //   confirmBox.setTitle('ข้อความแจ้งเตือน');
      //   confirmBox.setMessage('ไม่พบข้อมูลยื่นอุทธรณ์/ฎีกา กรุณาเลือกรายการอุทธรณ์/ฎีกาเพื่อแก้ไข');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if(resp.success==true){}
      //     subscription.unsubscribe();
      //   });
      // }
      if(obj.index==0)
        this.widthSet="130%";
      else if(obj.index==1)
        this.widthSet="130%";
      else if(obj.index==2)
        this.widthSet="100%";
        else if(obj.index==3)
        this.widthSet="100%";
      else if(obj.index==4)
        this.widthSet="100%";
    }

    // getGuarData(run_id:any){
    //   const confirmBox = new ConfirmBoxInitializer();
    //     confirmBox.setTitle('ข้อความแจ้งเตือน');
    //     this.SpinnerService.show();
    //     var student = JSON.stringify({
    //       "run_id": run_id,
    //       "userToken" : this.userData.userToken
    //     });
    //     console.log(student)
    //       this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getData', student ).subscribe(
    //       (response) =>{
    //         let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //         console.log(getDataOptions)
    //         if(getDataOptions.result==1){
    //             //-----------------------------//
    //             if(getDataOptions.data.length){
    //               this.dataSearch = getDataOptions.data;
    //               //this.dataSearch.forEach((x : any ) => x.cFlag = x.cancel_flag);
    //               //this.dtTrigger.next(null);
    //               //if(this.guarRunning)
    //                 this.sendEditData(this.guarRunning,2);
    //               this.SpinnerService.hide();
    //               this.rerender();
    //             }else{
    //               this.dataSearch = [];
    //               //this.dtTrigger.next(null);
    //               this.SpinnerService.hide();
    //               this.rerender();
    //             }
    //             //-----------------------------//
    //         }else{
    //           this.dataSearch = [];
    //           this.SpinnerService.hide();
    //           this.rerender();
    //           //-----------------------------//
    //           /*
    //             confirmBox.setMessage(getDataOptions.error);
    //             confirmBox.setButtonLabels('ตกลง');
    //             confirmBox.setConfig({
    //                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //             });
    //             const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //               if(resp.success==true){}
    //               subscription.unsubscribe();
    //             });
    //             */
    //           //-----------------------------//
    //         }

    //       },
    //       (error) => {}
    //     )
    // }

    delData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(1);
    }

    tabChangeInput(name:any,event:any){
    if(name=='app_id'){
      var student = JSON.stringify({
        "table_name" : "pappoint_list",
        "field_id" : "app_id",
        "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.app_name = productsJson[0].fieldNameValue;
        }else{
          this.result.app_id = '';
          this.result.app_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='police_id'){
      var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "condition" : " AND police_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.police_name = productsJson[0].fieldNameValue;
        }else{
          this.result.police_id = '';
          this.result.police_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='order_judge_id'){
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
          this.result.order_judge_name = productsJson[0].fieldNameValue;
          this.result.order_judge_date = myExtObject.curDate();
        }else{
          this.result.order_judge_id = '';
          this.result.order_judge_name = '';
          this.result.order_judge_date = '';
        }
        },
        (error) => {}
      )
    }else if(name=="judge_id"){
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
    }else if(name=="judge_id2"){
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
          this.result.judge_name2 = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id2 = '';
          this.result.judge_name2 = '';
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

    // loadMyModalComponent(){
    //   $(".modal-backdrop").remove();
    //   if(this.modalType==1){
    //     $("#exampleModal_main_main").find(".modal-content").css("width","650px");
    //       this.loadModalConfComponent_main = true;
    //       $("#exampleModal_main_main").find(".modal-content").css("width","650px");
    //       $("#exampleModal_main_main").find(".modal-body").css("height","auto");
    //       $("#exampleModal_main_main").css({"background":"rgba(51,32,0,.4)"});
    //   }
    // }

    // clickOpenMyModalComponent(type:any){
    //   // alert(type);
    //   this.modalType = type;
    //   if((type==22 || type==11 ) && !this.result.run_id){
    //     const confirmBox = new ConfirmBoxInitializer();
    //     confirmBox.setTitle('ข้อความแจ้งเตือน');
    //     confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
    //     confirmBox.setButtonLabels('ตกลง');
    //     confirmBox.setConfig({
    //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //     });
    //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //       if(resp.success==true){}
    //       subscription.unsubscribe();
    //     });
    //   }else{
    //     this.openbutton.nativeElement.click();
    //    }
    // }

    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
       $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pappoint_list",
          "field_id" : "app_id",
          "field_name" : "app_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pappoint_list';
        this.listFieldId='app_id';
        this.listFieldName='app_name';
        this.listFieldNull='';
      }else if(this.modalType==2){
        alert('ModuleType==2');
        // var student = JSON.stringify({
        //   "run_id" : this.result.run_id,
        //   "userToken" : this.userData.userToken});
        // this.listTable='pappeal';
        // this.listFieldId='appeal_type';
        // this.listFieldName='start_date';
        // this.listFieldNull='';
        // this.listFieldType=JSON.stringify({
        //   "run_id":this.result.run_id});
        // console.log(student);
        //   this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/getData', student).subscribe(
        //     (response) =>{
        //      let productsJson : any = JSON.parse(JSON.stringify(response));
        //      console.log(productsJson);
        //      if(productsJson.result==1){
        //       console.log(productsJson);
        //       this.list = productsJson.data;
        //       console.log(this.list)
        //      }else{
        //        this.list = [];
        //      }
        //     },
        //     (error) => {}
        //   )
      }else if(this.modalType==3){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND police_flag = 1",
          "userToken" : this.userData.userToken});
        this.listTable='ppolice';
        this.listFieldId='police_id';
        this.listFieldName='police_name';
        this.listFieldCond=" AND police_flag = 1";
      }else if(this.modalType==19){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND police_flag = 2",
          "userToken" : this.userData.userToken});
        this.listTable='ppolice';
        this.listFieldId='police_id';
        this.listFieldName='police_name';
        this.listFieldCond=" AND police_flag = 2";
      }else if(this.modalType==4){
        if(typeof this.result.case_date=='undefined'){
          var caseDate = myExtObject.curDate();
        }else{
          if(this.result.case_date)
            var caseDate = this.result.case_date;
          else
            var caseDate:any = '';
        }
        var student = JSON.stringify({
          "cond":2,
          "assign_date":caseDate,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({
          "type":1,
          "assign_date":caseDate});
          this.loadModalConfComponent = false;
          this.loadModalListMultiComponent = false;
          this.loadModalListComponent = false;
          this.loadModalJudgeComponent = true;
          this.loadModalJudgeGroupComponent = false;
          this.loadCopyComponent = false;
          this.loadAppealComponent = false;
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
            (response) =>{
             let productsJson : any = JSON.parse(JSON.stringify(response));
             if(productsJson.data.length){
               this.list = productsJson.data;
               console.log(this.list)
             }else{
               this.list = [];
             }
            },
            (error) => {}
          )
      }else if(this.modalType==5 || this.modalType==6 || this.modalType==8 || this.modalType==9 || this.modalType==10){
        $("#exampleModal_main").find(".modal-content").css({"width":"650px"});
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
        this.loadModalConfComponent = false;
        this.loadModalListMultiComponent = false;
        this.loadModalListComponent = false;
        this.loadModalJudgeComponent = true;
        this.loadModalJudgeGroupComponent = false;
        this.loadCopyComponent = false;
        this.loadAppealComponent = false;
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
           let productsJson : any = JSON.parse(JSON.stringify(response));
           if(productsJson.data.length){
             this.list = productsJson.data;
             console.log(this.list)
           }else{
             this.list = [];
           }
          },
          (error) => {}
        )
      }else if(this.modalType==7){
        $("#exampleModal_main").find(".modal-content").css({"width":"950px"});
        this.loadModalConfComponent = false;
        this.loadModalListMultiComponent = false;
        this.loadModalListComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadModalJudgeGroupComponent = true;
        this.loadCopyComponent = false;
        this.loadAppealComponent = false;
      }else if(this.modalType==11 || this.modalType==22){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pallegation",
          "field_id" : "alle_id",
          "field_name" : "alle_name",
          "field_name2" : "alle_running",
          "search_id" : "",
          "search_desc" : "",
          "condition" : " AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"'",
          "userToken" : this.userData.userToken});
        this.listTable='pallegation';
        this.listFieldId='alle_id';
        this.listFieldName='alle_name';
        this.listFieldCond=" AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"'";
      }else if(this.modalType==12 || this.modalType==15 || this.modalType==23 || this.modalType==24){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        this.loadModalConfComponent = true;
        this.loadModalListMultiComponent = false;
        this.loadModalListComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadModalJudgeGroupComponent = false;
        this.loadCopyComponent = false;
        this.loadAppealComponent =false;
      }else if(this.modalType==13){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pinter",
          "field_id" : "inter_id",
          "field_name" : "inter_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pinter';
        this.listFieldId='inter_id';
        this.listFieldName='inter_name';
        this.listFieldCond="";
      }else if(this.modalType==14){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "poccupation",
          "field_id" : "occ_id",
          "field_name" : "occ_desc",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='poccupation';
        this.listFieldId='occ_id';
        this.listFieldName='occ_desc';
        this.listFieldCond="";
      }else if(this.modalType==20){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldCond="";
     }else if(this.modalType==16){
      $("#exampleModal_main").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND police_flag = 1",
        "userToken" : this.userData.userToken});
        this.listTable='ppolice';
        this.listFieldId='police_id';
        this.listFieldName='police_name';
      this.listFieldCond="";
    }else if(this.modalType==17){
      $("#exampleModal_main").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND police_flag = 2",
        "userToken" : this.userData.userToken});
      this.listTable='ppolice';
      this.listFieldId='police_id';
      this.listFieldName='police_name';
      this.listFieldCond="";
    }
      console.log(student)
      if(this.modalType ==1 || this.modalType==3 || this.modalType==11 || this.modalType==13 || this.modalType==14 || this.modalType==19 || this.modalType==20 || this.modalType==22){
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
            if(this.modalType==22 ){
              this.loadModalConfComponent = false;
              this.loadModalListMultiComponent = true;
              this.loadModalListComponent = false;
              this.loadModalJudgeComponent = false;
              this.loadModalJudgeGroupComponent = false;
              this.loadCopyComponent = false;
              this.loadAppealComponent = false;
            }else if(this.modalType==2){
              this.loadAppealComponent = true;
              this.loadModalConfComponent = false;
              this.loadModalListMultiComponent = false;
              this.loadModalListComponent = false;
              this.loadModalJudgeComponent = false;
              this.loadModalJudgeGroupComponent = false;
              this.loadCopyComponent = false;
            }else{
              this.loadModalConfComponent = false;
              this.loadModalListMultiComponent = false;
              this.loadModalListComponent = true;
              this.loadModalJudgeComponent = false;
              this.loadModalJudgeGroupComponent = false;
              this.loadCopyComponent = false;
              this.loadAppealComponent = false;
            }
          },
          (error) => {}
        )
      }
    }

    receiveFuncListData(event:any){
      console.log(event)
      console.log(this.modalType);
      if(this.modalType==1){
        this.result.app_id = event.fieldIdValue;
        this.result.app_name = event.fieldNameValue;
      }else if(this.modalType==2){
        this.result.appeal_detail = event.appeal_type_name;
        this.result.appeal_running = event.appeal_running;
      }
      // }else if(this.modalType==20){
      //   this.result.issue_id=event.fieldIdValue;
      //   this.result.issue_name=event.fieldNameValue;
      // }else if(this.modalType==3 || this.modalType==19){
      //   this.result.police_id=event.fieldIdValue;
      //   this.result.police_name=event.fieldNameValue;
      // }else if(this.modalType==13){
      //   this.caseDataObj.accuObj[this.modalIndex].inter_id=event.fieldIdValue;
      //   this.caseDataObj.accuObj[this.modalIndex].inter_name=event.fieldNameValue;
      // }else if(this.modalType==14){
      //   this.caseDataObj.accuObj[this.modalIndex].occ_id=event.fieldIdValue;
      //   this.caseDataObj.accuObj[this.modalIndex].occ_desc=event.fieldNameValue;
      // }
      this.closebutton.nativeElement.click();
    }

    printReport(type:any){
      if(!this.dataHeadValue.run_id){
        this.dataHeadValue.run_id = this.result.run_id;
      }
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.dataHeadValue.run_id){
        confirmBox.setMessage('กรุณาค้นหาเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(this.dataHeadValue.run_id && type==1){
        //rca0200_A4.jsp? prun_id =& pcase_flag =&pprint_app=1&pprint_by=2
        var rptName = 'rca0200_A4';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pprint_by" : 1,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==2){
        //rca0210.jsp?prun_id=147511&pcase_flag=&pprint_app=1&pprint_by=1
        var rptName = 'rca0210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pprint_by" : 1,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==3){
        //rci0113_A4.jsp?prun_id=147511&pcase_flag=&pprint_by=1
        var rptName = 'rci0113_A4';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_by" : 1,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==4){
        //rca0120_A4.jsp?prun_id=147511&pcase_flag=&pprint_by=1
        var rptName = 'rca0120_A4';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_by" : 1,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==5){
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        if(this.dataHeadValue.run_id){
          if(this.dataHeadValue.red_id)
            myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id='+this.dataHeadValue.run_id+"&pprint_by=1&case_no="+this.dataHeadValue.title+this.dataHeadValue.id+"/"+this.dataHeadValue.yy+"&red_no="+this.dataHeadValue.red_title+this.dataHeadValue.red_id+"/"+this.dataHeadValue.red_yy,'prca2100');
          else
            myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id='+this.dataHeadValue.run_id+"&pprint_by=1&case_no="+this.dataHeadValue.title+this.dataHeadValue.id+"/"+this.dataHeadValue.yy,'prca2100');
        }else
          myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id=&pprint_by=1','prca2100');
      }else if(this.dataHeadValue.run_id && type==6){
        //rca0200b.jsp?prun_id=147511
        var rptName = 'rca0200b';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==7){


      }else if(this.dataHeadValue.run_id && type==8){
        //rfn6510.jsp?prun_id=149089
        var rptName = 'rfn6510';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==9){
        //rci3300.jsp?prun_id=149089
        var rptName = 'rci3300';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==10){
        //rca0200_A4.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pprint_by=2
        var rptName = 'rca0200_A4';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pprint_by" : 2
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==11){
        //rca0210.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pprint_by=2
        var rptName = 'rca0210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pprint_by" : 2
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==12){
        //rca0120_A4.jsp?prun_id=150662&pcase_flag=&pprint_by=2
        var rptName = 'rca0120_A4';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_by" : 2
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==13){
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        if(this.dataHeadValue.run_id){
          if(this.dataHeadValue.red_id)
            myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id='+this.dataHeadValue.run_id+"&pprint_by=2&case_no="+this.dataHeadValue.title+this.dataHeadValue.id+"/"+this.dataHeadValue.yy+"&red_no="+this.dataHeadValue.red_title+this.dataHeadValue.red_id+"/"+this.dataHeadValue.red_yy,'prca2100');
          else
            myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id='+this.dataHeadValue.run_id+"&pprint_by=2&case_no="+this.dataHeadValue.title+this.dataHeadValue.id+"/"+this.dataHeadValue.yy,'prca2100');
        }else
          myExtObject.OpenWindowMaxName(winURL+'prca2100?run_id=&pprint_by=2','prca2100');

      }else if(this.dataHeadValue.run_id && type==14){
        //rca2120.jsp?prun_id=150662
        var rptName = 'rca2120';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==15){
        //rca0900.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pdep_name=%BA%C3%D4%C9%D1%B7%CF%20%BC%D9%E9%B4%D9%E1%C5%C3%D0%BA%BA
        var rptName = 'rca0900';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pdep_name" : this.userData.depName,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);

      }else if(this.dataHeadValue.run_id && type==16){
        //rca0900.jsp?prun_id=150662&pcase_flag=1&pprint_app=1&pdep_name=%BA%C3%D4%C9%D1%B7%CF%20%BC%D9%E9%B4%D9%E1%C5%C3%D0%BA%BA
        var rptName = 'rca0900';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHeadValue.run_id,
          "pcase_flag" : this.dataHeadValue.case_flag,
          "pprint_app" : 1,
          "pdep_name" : this.userData.depName,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==17){
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        if(this.dataHeadValue.run_id){
          myExtObject.OpenWindowMaxName(winURL+'fap0111?run_id='+this.dataHeadValue.run_id,'fap0111');
        }else
          myExtObject.OpenWindowMaxName(winURL+'fap0111','fap0111');
      }else if(this.dataHeadValue.run_id && type==18){
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        if(this.dataHeadValue.run_id){
          myExtObject.OpenWindowMaxName(winURL+'ffn0400?run_id='+this.dataHeadValue.run_id,'ffn0400');
        }else
          myExtObject.OpenWindowMaxName(winURL+'ffn0400','ffn0400');
      }else if(this.dataHeadValue.run_id && type==19){
          let winURL = window.location.href.split("/#/")[0]+"/#/";
          if(this.dataHeadValue.run_id){
            myExtObject.OpenWindowMaxName(winURL+'fas0100?run_id='+this.dataHeadValue.run_id,'fas0100');
          }else
            myExtObject.OpenWindowMaxName(winURL+'fas0100','fas0100');
      }else if(this.dataHeadValue.run_id && type==20){
            let winURL = window.location.href.split("/#/")[0]+"/#/";
            if(this.dataHeadValue.run_id){
              myExtObject.OpenWindowMaxName(winURL+'fle0100?run_id='+this.dataHeadValue.run_id,'fle0100&guar_running='+this.dataHeadValue.guar_running);
            }else
              myExtObject.OpenWindowMaxName(winURL+'fle0100','fle0100');
      }else if(this.dataHeadValue.run_id && type==21){
        var rptName = 'rgu0600';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pguar_running" : this.dataHeadValue.guar_running ? this.dataHeadValue.guar_running : this.result.guar_running.toString(),
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==22){
        var rptName = 'rap3210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pguar_running" : this.dataHeadValue.pguar_running ? this.dataHeadValue.guar_running : this.result.guar_running.toString(),
          "ppage" : 3,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==23){
        var rptName = 'rap3210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pguar_running" : this.dataHeadValue.pguar_running ? this.dataHeadValue.guar_running : this.result.guar_running.toString(),
          "ppage" : 1,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==24){
        var rptName = 'rap3210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pguar_running" : this.dataHeadValue.pguar_running ? this.dataHeadValue.guar_running : this.result.guar_running.toString(),
          "ppage" : 2,
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }else if(this.dataHeadValue.run_id && type==25){
        var rptName = 'rap3210';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "pguar_running" : this.dataHeadValue.pguar_running ? this.dataHeadValue.guar_running : this.result.guar_running.toString(),
          "ppage" : '',
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }
    }

    submitModalForm(){
      var chkForm = JSON.parse(this.child.ChildTestCmp());
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');

        if(!chkForm.password){
          confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if(resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });

        }else if(!chkForm.log_remark){
          confirmBox.setMessage('กรุณาป้อนเหตุผล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if(resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{

          var student = JSON.stringify({
            "user_running" : this.userData.userRunning,
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });
          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student ).subscribe(
              posts => {
                let productsJson : any = JSON.parse(JSON.stringify(posts));
                console.log(productsJson)
                if(productsJson.result==1){

                    //console.log(this.delIndex)
                    const confirmBox2 = new ConfirmBoxInitializer();
                    confirmBox2.setTitle('ยืนยันการลบข้อมูล');
                    confirmBox2.setMessage('ต้องการลบข้อมูล ใช่หรือไม่');
                    confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

                      confirmBox2.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                          if(resp.success==true){

                            if(this.modalType==1){

                              var student = JSON.stringify({
                                "guar_running" : this.result.guar_running,
                                "contract_title" : null,
                                "contract_no" : null,
                                "contract_yy" : null,
                                "password" : chkForm.password,
                                "log_remark" : chkForm.log_remark,
                                "userToken" : this.userData.userToken
                              });
                              // var dataDel = [],dataTmp=[];
                              // dataDel['log_remark'] = chkForm.log_remark;
                              // dataDel['userToken'] = this.userData.userToken;
                              // // dataTmp.push(this.appealData[this.delIndex]);
                              // dataTmp.push($.extend({}, this.result));
                              // dataDel['data'] = dataTmp;
                              // var data = $.extend({}, dataDel);
                              // console.log(data)
                              // var student = this.dataSearch[this.delIndex];
                              // student['log_remark'] = chkForm.log_remark;
                              // student["userToken"] = this.userData.userToken;
                              console.log(student);
                              this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/saveData', student).subscribe(
                                (response) =>{
                                  let getDataOptions : any = JSON.parse(JSON.stringify(response));
                                  console.log(getDataOptions)
                                  const confirmBox3 = new ConfirmBoxInitializer();
                                  confirmBox3.setTitle('ข้อความแจ้งเตือน');
                                  if(getDataOptions.result==1){
                                      //-----------------------------//
                                      confirmBox3.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                                      confirmBox3.setButtonLabels('ตกลง');
                                      confirmBox3.setConfig({
                                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                      });
                                      const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                        if(resp.success==true){
                                          //this.setDefPage();
                                          // this.getGuarData(this.sendHead.run_id)
                                        }
                                        subscription3.unsubscribe();
                                      });
                                      //-----------------------------//

                                  }else{
                                    //-----------------------------//
                                      confirmBox3.setMessage(getDataOptions.error);
                                      confirmBox3.setButtonLabels('ตกลง');
                                      confirmBox3.setConfig({
                                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                      });
                                      const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                        if(resp.success==true){
                                          this.SpinnerService.hide();
                                        }
                                        subscription3.unsubscribe();
                                      });
                                    //-----------------------------//
                                  }

                                },
                                (error) => {}
                              )
                            }


                          }
                          subscription2.unsubscribe();
                      });


                  this.closebutton.nativeElement.click();
                }else{
                  confirmBox.setMessage(productsJson.error);
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
            );

        }
    }

    closeModal(){
      this.loadModalConfComponent_main = false;
      this.loadModalListComponent = false;
      this.loadCopyComponent = false;
      this.loadAppealComponent = false;
    }

    sendEditData(i:any,type:any){
      this.tabGroup['_indexToSelect'] = 0;
      var sendData:any;
      console.log(i)
      if(type==1){
        sendData = this.dataSearch[i];
      }else{
        if(typeof i ==='object')
          var fine = this.dataSearch.filter((x:any) => x.guar_running === parseInt(i.guar_running));
        else
          var fine = this.dataSearch.filter((x:any) => x.guar_running === parseInt(i));
        if(fine.length){
          sendData = fine[0];
        }else{
          sendData = i;
        }
      }
      this.sendEdit = {'data':sendData,'counter' : Math.ceil(Math.random()*10000)}
    }

    ClearAll(){
      window.location.reload();
    }

    receiveTab1Data(event:any){
      console.log(event)
      // this.getGuarData(event.run_id)
      // this.guarRunning = {'guar_running' : event.guar_running,'counter' : Math.ceil(Math.random()*10000)};
      if(event.guar_running){
        // this.result.gaur_running = event.guar_running;
        this.searchMainData(3,event.guar_running);
      }
    }
}
