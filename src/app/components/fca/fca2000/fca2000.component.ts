import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-fca2000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca2000.component.html',
  styleUrls: ['./fca2000.component.css']
})


export class Fca2000Component implements AfterViewInit, OnInit,AfterContentInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  dataHead:any  = [];
  dataSearch:any = [];
  getIndex:any;
  index_id:any;
  rawIndex:any = {index_desc:'',num_page:'',rcv_date:'',remark:''};
  result:any = [];
  rcv_date:any = [];
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  myExtObject:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  runId:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[1,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
     //======================== pcase_index_setup ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_index_setup",
      "field_id" : "index_id",
      "field_name" : "index_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getIndex = getDataOptions;
        this.getIndex.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        //console.log(this.getIndex)
      },
      (error) => {}
    )
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

  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    this.searchIndex();
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
    }
  }

  searchIndex(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.SpinnerService.show();
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca2000', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
          if(getDataOptions.result==1){
            this.dataSearch = getDataOptions.data;
            if(this.dataSearch.length)
              this.dataSearch.forEach((x : any ) => x.editValue = false);
            //this.dtTrigger.next(null);
            this.rerender();
            setTimeout(() => {
              this.ngAfterContentInit();
            }, 200);
          }else{
            this.dataSearch = [];
            this.rerender();
          }
          this.SpinnerService.hide();
      },
      (error) => {}
    )

  }

  changeIndex(index:any,type:any){
    if(this.rawIndex.index_desc && this.rawIndex.rcv_date && this.dataHead.run_id){
      this.rawIndex.edit_index_item = '';
      this.rawIndex.run_id = this.dataHead.run_id;
      this.rawIndex.court_running = this.dataHead.court_running;
      this.dataSearch.push(this.rawIndex)
      this.rerender();
      setTimeout(() => {
        this.rawIndex = {};
        this.ngAfterContentInit();
      }, 200);
    }
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined' ){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      if(val.length!=0){
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }else{
        this.result[objName] = null;
        this[objName] = '';
      }
      if(objName=='index_id' && val.length!=0 && this.dataHead.run_id)
        this.getSelectIndex(val[0].fieldIdValue);
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  getSelectIndex(val:any){
    if(val){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "index_id" : val,
        "userToken" : this.userData.userToken
      });
      console.log(student)

      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca2000/getCaseIndex', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.result==1){
            this.dataSearch = getDataOptions.data;
            //this.dtTrigger.next(null);
            this.rerender();
            setTimeout(() => {
              this.ngAfterContentInit();
            }, 200);
          }else{
            this.dataSearch = [];
            this.rerender();
            //this.dtTrigger.next(null);
          }
          console.log(getDataOptions)
        },
        (error) => {}
      )
    }
  }

  directiveDate(date:any,obj:any,index:any){
    console.log(date.target.value)
    this.dataSearch[index][obj] = date.target.value;
  }
  directiveDateNew(date:any,obj:any){
    this.rawIndex[obj] = date;
    this.changeIndex('',2);
  }

  saveData(){
    if(this.dataSearch.length){
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.dataSearch.forEach((x : any ) => x.num_page = !x.num_page?null:parseInt(x.num_page));
      this.dataSearch.forEach((x : any ) => x.edit_index_item = !x.edit_index_item?null:parseInt(x.edit_index_item))
      var dataSend = [];
      dataSend['run_id'] = this.dataHead.run_id;
      dataSend['data'] = this.dataSearch;
      dataSend['userToken'] = this.userData.userToken;

      var data = $.extend({}, dataSend);
      console.log(data)

      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca2000/saveData', data , {headers:headers}).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){

              }
              subscription.unsubscribe();
            });
          }else{
            this.searchIndex();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )

    }
  }

  // delData(){
  //   this.openbutton.nativeElement.click();
  // }

  checkUncheckAll() {
    for (var i = 0; i < this.dataSearch.length; i++) {
      this.dataSearch[i].editValue = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.dataSearch.every(function(item:any) {
        return item.editValue == true;
      })
  }

  uncheckAll() {
    for (var i = 0; i < this.dataSearch.length; i++) {
      this.dataSearch[i].editValue = false;
    }
    this.masterSelected = false;
  }

  loadMyConfirm(){
    this.loadComponent = true;
  }

  delData(){
    const confirmBox = new ConfirmBoxInitializer();

    const chkEl = document.querySelectorAll("input.chkDel");
    var del = [];
    var bar = new Promise((resolve, reject) => {
      if(chkEl.length){
        chkEl.forEach((ele, index, array) => {
          if($(ele).prop("checked")==true){
            del.push(this.dataSearch[index]);
          }
          if (index === chkEl.length -1) resolve(null);
        });
      }else{resolve(null)}
    });

    bar.then(() => {
      if(!del.length){
        confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      }else{
        this.openbutton.nativeElement.click();
      }
    })
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
        if (resp.success==true){
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
        if (resp.success==true){
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
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var dataDel = [],dataTmp=[];
                  dataDel['run_id'] = this.dataHead.run_id;
                  dataDel['log_remark'] = chkForm.log_remark;
                  dataDel['userToken'] = this.userData.userToken;

                  var bar = new Promise((resolve, reject) => {
                    this.dataSearch.forEach((ele, index, array) => {
                          if(ele.editValue == true){
                            dataTmp.push(this.dataSearch[index]);
                          }
                      });
                  });
                  if(bar){
                    this.SpinnerService.show();
                   dataDel['data'] = dataTmp;
                   var data = $.extend({}, dataDel);
                   console.log(data)
                    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca2000/deleteData', data , {headers:headers}).subscribe(
                      (response) =>{
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        if(alertMessage.result==0){
                          this.SpinnerService.hide();
                        }else{
                          const confirmBox = new ConfirmBoxInitializer();
                          confirmBox.setTitle('ข้อความแจ้งเตือน');
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription2 = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              this.searchIndex();
                            }
                            subscription2.unsubscribe();
                          });

                        }
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                  }
                }
                subscription.unsubscribe();
            });

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
        },
        (error) => {}
      );

    }
  }

  closeModal(){
    this.loadComponent = false;
  }

  printReport(page:any){
    var rptName = 'rfca2000';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "prun_id" : this.dataHead.run_id,
      "ppage" : page,
    });
    console.log(paramData);

    this.printReportService.printReport(rptName,paramData);
  }

}







