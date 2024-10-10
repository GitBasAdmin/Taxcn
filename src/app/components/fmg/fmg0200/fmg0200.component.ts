import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import { param } from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-fmg0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0200.component.html',
  styleUrls: ['./fmg0200.component.css']
})


export class Fmg0200Component implements AfterViewInit, OnInit, OnDestroy {



  //form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  toPage:any;
  myExtObject:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  dataSearch:any = [];
  getApp:any = [];
  getPros:any = [];
  getDep:any = [];
  getAccu:any = [];
  getLit:any = [];
  getOther:any = [];
  getAdd:any = [];
  modalType:any;
  result:any = [];
  resultTmp:any = [];
  appealData:any = [];
  appealDataTmp:any = [];
  appealDate:any = [];
  runId:any;
  pRun_id:any;

  asyncObservable: Observable<string>;

  dataHead:any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  public litIndex:any;
  public appIndex:any;
  public loadModalLitComponent: boolean = false;
  public loadModalAppResultComponent : boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute: ActivatedRoute,
  ){ }

  ngOnInit(): void {

    // this.dtOptions = {
    //   columnDefs: [{"targets": 'no-sort',"orderable": false}],
    //   order:[],
    //   lengthChange : false,
    //   info : false,
    //   paging : false,
    //   searching : false,
    //   destroy: true,
    // };
    this.dtOptions2 = {
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
      this.pRun_id = params['run_id'];
    });

    if(this.pRun_id){
      this.runId = {'run_id' : this.pRun_id,'counter' : Math.ceil(Math.random()*10000)};
    }


      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fmg0200"
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

  loadAllData(){
     this.LoadData();
          this.dataHead.deposit = this.curencyFormat(this.dataHead.deposit,2);
          this.getPros = this.dataHead.prosObj;
          this.getAccu = this.dataHead.accuObj;
          this.getDep = this.dataHead.depObj;
          this.cgetDep();
          this.getLit = this.dataHead.litObj;
          this.getOther = this.dataHead.otherObj;
          this.getApp = this.dataHead.appObj;
          console.log(this.getApp);
          this.getAppealJudgeData(1);
          if(this.dataHead.zone_prov_name){
             if(this.dataHead.zone_prov_id==10){
               this.dataHead.zone_prov_name = 'จังหวัด' + this.dataHead.zone_prov_name + (this.dataHead.zone_amphur_name==null?'':' เขต' + this.dataHead.zone_amphur_name) + (this.dataHead.zone_tambon_name==null?'':' แขวง'+this.dataHead.zone_tambon_name);
             }else{
               this.dataHead.zone_prov_name = 'จังหวัด' + this.dataHead.zone_prov_name + (this.dataHead.zone_amphur_name==null?'':' อำเภอ' + this.dataHead.zone_amphur_name) + (this.dataHead.zone_tambon_name==null?'':' ตำบล'+this.dataHead.zone_tambon_name);
             }
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

    fnDataHead(event:any){
      console.log(event)
      this.dataHead = event;
      if(this.dataHead.run_id){
        //this.loadAllData();
          if(this.dataHead.buttonSearch==1){//ถ้ามีการกดปุ่มค้นหาที่ head ตัวแปนนี้จะมีค่า
            this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch': 1};
          }
          var bar = new Promise((resolve, reject) => {
          this.loadAllData();
          /*
          //แก้ไข ทุนทรัพย์รวม | ทุนทรัพย์ =แสดงตัวเลขไม่ถูก ตัวเลขถูกตัดหลัง , ex 50,000->50
          this.LoadData();
          this.dataHead.deposit = this.curencyFormat(this.dataHead.deposit,2);
          this.getPros = this.dataHead.prosObj;
          this.getAccu = this.dataHead.accuObj;
          this.getDep = this.dataHead.depObj;
          this.cgetDep();
          this.getLit = this.dataHead.litObj;
          this.getOther = this.dataHead.otherObj;
          this.getApp = this.dataHead.appObj;
          this.getAppealJudgeData(1);
          if(this.dataHead.zone_prov_name){
             if(this.dataHead.zone_prov_id==10){
               this.dataHead.zone_prov_name = 'จังหวัด' + this.dataHead.zone_prov_name + (this.dataHead.zone_amphur_name==null?'':' เขต' + this.dataHead.zone_amphur_name) + (this.dataHead.zone_tambon_name==null?'':' แขวง'+this.dataHead.zone_tambon_name);
             }else{
               this.dataHead.zone_prov_name = 'จังหวัด' + this.dataHead.zone_prov_name + (this.dataHead.zone_amphur_name==null?'':' อำเภอ' + this.dataHead.zone_amphur_name) + (this.dataHead.zone_tambon_name==null?'':' ตำบล'+this.dataHead.zone_tambon_name);
             }
            }
            */
        });
        if(bar){this.rerender();}
           // this.getAppealDate(1);
          // this.setDefPage();
         //this.getAdd = this.dataSearch.addObj;
          // this.getConc = this.dataHead.concObj; ผู้ประนอม
          // this.getAppealDate(1);
          console.log('ppppp');
          // console.log(this.getAdd);
      }
    }

    cgetDep(){
                var bar = new Promise((resolve, reject) => {
                    this.getDep.forEach((ele, index, array) => {
                        // if(ele.indict_desc != null){
                        //   if(ele.indict_desc.length > 47 )
                        //     this.getDep[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                        // }
                        if(ele.deposit != null){
                          this.getDep[index]['deposit'] = this.curencyFormat(ele.deposit,2);
                        }
                        if(ele.court_fee != null){
                          this.getDep[index]['court_fee'] = this.curencyFormat(ele.court_fee,2);
                        }
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    printCover(type:any,case_flag:any,print_app:any,print_by:any,add_print){
      var rptName = 'rca0200_A4';
      if(type==2){
        rptName='rci0113_A4';
      }else if(type==3){
          rptName='rca0230_A4';
      }else if(type==4){
        rptName='rca0210';
      }else if(type==5){
        rptName='rca0120_A4';
      }else if(type==6){
        rptName='rca0900';
      }else if(type==7){
        rptName='rca0200';
      }else if(type==8){
        rptName='rca2120';
      }



      var paramData ='{}';
      var paramData = JSON.stringify({
        "prun_id" : this.dataHead.run_id,
        "pcase_flag" : case_flag,
        "pprint_app" : print_app,
        "pprint_by" : print_by,
        "padd_print" : add_print,
      });

      console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }

    printReportPara(run_id:any,judge_item:any){
      var rptName = 'rfmg0200';
      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
         "prun_id" : run_id.toString(),
         "pjudge_item" : judge_item.toString(),
       //  "pgrcv_running" : this.pgrcv_running.toString(),
      });
      // alert(paramData);return false;
      console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }

    printReport(type:any){

      var rptName = 'rffn0500';
      // if(type==1){
      //   rptName='rffn0500';
      // }
      if(type==3){
        rptName= 'rffn0540';
      }else if(type==4){
        rptName= 'rfn0500';
      }
      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        // //  "pcase_type" : this.selCaseType,
        //  "pcase_cate_id" : this.pcase_cate_id,
        //  "pcase_status_id" : this.pcase_status_id,
        // //  "ptable_id" : this.table_id,
        //  "pdate_start" : myExtObject.conDate($("#sdate").val()),
        //  "pdate_end" : myExtObject.conDate($("#edate").val()),
        //  "pflag" : type,
        //  "pbook_no" : this.result.book_no,
        //  "pgroup_id" : this.result.pgroup_id,
        //  "prcv_sno" : this.result.prcv_sno,
        //  "prcv_eno" : this.result.prcv_eno,
        //  "pcourt_type" : this.result.pcourt_type,
        //  "pcourt_id" : this.result.court_id,
        //  "pdep_code" : this.result.dep_id,
        //  "poff_id" : this.result.off_id,
        //  "prcv_flag" : this.result.rcv_flag,
        //  "pcheck_book_no" : this.result.cheque_book_no,
        //  "pcheck_no" : this.result.cheque_no,
        //  "ptype" : this.result.ptype,
        //  "pefile" : this.result.pdata_type,
        //  "pgrcv_running" : this.pgrcv_running.toString(),
       });
      // alert(paramData);return false;
      console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }

    goToPage(notice_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?notice_running='+notice_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    goToCoverPage(run_id:any,to_page:any,pprint_by:any){
      let winURL = window.location.href;
      let case_no = this.dataHead.title+this.dataHead.id+'/'+this.dataHead.yy;
      let red_no = this.dataHead.red_title+this.dataHead.red_id+'/'+this.dataHead.red_yy;
      if(!red_no){
        red_no = '';
      }
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+to_page+'?run_id='+run_id+'&pprint_by='+pprint_by+'&case_no='+case_no+'&red_no='+red_no;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1000,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    goToPage2(run_id:any,to_page:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+to_page+'?run_id='+run_id+'&disable=1';
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1250,height=500");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    loadMyModalComponent(){
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","800px");
        this.loadModalLitComponent = true;
      }else if(this.modalType==2){
        $("#exampleModal").find(".modal-content").css("width","800px");
        this.loadModalAppResultComponent = true;
      }
    }

    setDefPage(){
      this.result = [];
      this.result.court_level = 1;
      if(this.appealData.length){
        this.result.all_item = this.appealData.length;
        this.result.judge_item = parseInt(this.appealData.length)+1;
        this.resultTmp.judge_item = parseInt(this.appealData.length)+1;
      }
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    prevAppeal(){
      if(this.resultTmp.judge_item!=1){
        var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)-1);
        console.log(indexObj)
        if(indexObj.length)
          this.editData(indexObj[0],2)
      }
    }

    nextAppeal(){
      if(this.resultTmp.judge_item<this.appealData.length){
        var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)+1);
        console.log(indexObj)
        if(indexObj.length)
          this.editData(indexObj[0],2)
      }else{
        this.setDefPage();
      }
    }

    editDataInput(event:any){
      if(event.target.value){
        var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(event.target.value));
        console.log(indexObj)
        if(indexObj.length){
          this.editData(indexObj[0],2)
        }else{
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ไม่พบข้อมูลคำพิพากษาครั้งที่ '+event.target.value);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.setDefPage();
            }
            subscription.unsubscribe();
          });
        }
      }
    }

    getAppealDate(value:any){
      if(typeof this.dataHead !='undefined' && this.dataHead.run_id){
         if(value ==1 || value==2 || value==3){
          var student = JSON.stringify({
            "run_id" : this.dataHead.run_id,
            "court_level" : value,
            "userToken" : this.userData.userToken
          });
          console.log(student)

          this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/getAppealList', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              // console.log('BBBBBBB');
              console.log(getDataOptions)
              if(getDataOptions.data.length){
                this.appealDate = getDataOptions.data;
              }else{
                this.appealDate = [];
              }
            },
            (error) => {}
          );
        }
      }else{
        this.appealDate = [];
      }
    }

    getAppealJudgeData(type:any){
      if(typeof this.dataHead !='undefined' && this.dataHead.run_id){
        this.sessData=localStorage.getItem(this.authService.sessJson);
        this.userData = JSON.parse(this.sessData);
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/getAppealJudgeData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.appealData = getDataOptions.data;
              this.result.all_item = getDataOptions.data.length;

              var bar = new Promise((resolve, reject) => {
                this.appealData.forEach((ele, index, array) => {
                    if(ele.judge_desc && ele.judge_desc.length>25){
                      ele.judge_desc_short = ele.judge_desc.substring(0,25)+"...";
                    }
                });
              });
              if(bar){
                this.rerender();
                if(!type){
                  const item = this.appealData.reduce((prev:any, current:any) => (+prev.judge_item > +current.judge_item) ? prev : current)
                  this.result.judge_item = item.judge_item+1;
                  this.resultTmp.judge_item = item.judge_item+1;
                }else{
                  var indexObj = this.appealData.filter((x:any) => x.judge_item === type);
                  console.log(indexObj)
                  if(indexObj.length){
                    this.result = $.extend([],indexObj[0]);
                    this.resultTmp = $.extend([],indexObj[0]);
                    this.result.all_item = getDataOptions.data.length;
                  }
                }
              }
              this.appealDataTmp = JSON.stringify(getDataOptions.data);

            }else{
              this.result.judge_item = 1;
              this.resultTmp.judge_item = 1;
              this.appealData = [];
              this.result.all_item = '';
            }
          },
          (error) => {}
        );
      }else{
        this.rerender();
      }
    }

    editData(index:any,type:any){
      this.SpinnerService.show();
      this.result = [];
      if(type==1){
        this.result = $.extend([],this.appealData[index]);
        this.resultTmp = $.extend([],this.appealData[index]);
      }else{
        this.result = $.extend([],index);
        this.resultTmp = $.extend([],index);
      }
      this.result.all_item = this.appealData.length;
      setTimeout(() => {
        this.SpinnerService.hide();
      }, 500);
    }

    LoadData() {
      //  alert("xxxx");
      this.posts = [];
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

        this.SpinnerService.show();
        // let headers = new HttpHeaders();
        // headers = headers.set('Content-Type','application/json');
        // if(this.prov_id.nativeElement["default_value"].checked==true){
        //   var inputChk = 1;
        // }else{
        //   var inputChk = 0;
        // }
        var student = JSON.stringify({
            "run_id" : this.dataHead.run_id,
            "userToken" : this.userData.userToken
        });
        console.log(student);
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0200/getOtherData', student ).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));

              this.posts = productsJson.addObj;
              // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');

            console.log(productsJson)
            console.log('xxxxxx');
            if(productsJson.result==1){

              // var bar = new Promise((resolve, reject) => {
              //   productsJson.data.forEach((ele, index, array) => {

              //         if(ele.description != null){
              //           let text = productsJson.data[index]['description'];
              //           let result = text.substr(0,text.lastIndexOf(" "));
              //           let result2 = text.split(" ").pop();
              //           productsJson.data[index]['result']  = result;
              //           productsJson.data[index]['result2'] = result2;
              //         }


              //     });
              // });

              this.dataSearch = productsJson;
              console.log(this.dataSearch);
              this.getAdd = this.dataSearch.addObj;
              console.log(this.getAdd);
              // alert(this.dataSearch.length);
              this.checklist = this.posts;
              // this.checklist2 = this.posts;
                if(productsJson.length)
                  this.posts.forEach((x : any ) => x.edit3001 = false);

              this.rerender();
              setTimeout(() => {
                myExtObject.callCalendar();
              }, 500);
            }else{
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }
              this.SpinnerService.hide();

          },
          (error) => {this.SpinnerService.hide();}
        );
         }

        closeModal(){
          this.loadModalLitComponent = false;
          this.loadModalAppResultComponent = false;
        }

        clickOpenMyModalComponent(type:any,indexObj:any){
          if(type==1){
            this.litIndex = indexObj;
          }else if(type==2){
             this.appIndex = indexObj;
          }
          this.modalType = type;
          this.openbutton.nativeElement.click();
        }

}







