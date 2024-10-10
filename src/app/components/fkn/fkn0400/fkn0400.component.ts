import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
// import { NgInputFileComponent, GoogleApiConfig, GoogleDriveService } from 'ng-input-file';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkn0400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0400.component.html',
  styleUrls: ['./fkn0400.component.css']
})


export class Fkn0400Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
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
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  myExtObject: any;
  result:any = [];
  resultTmp:any;
  modalType:any;
  dataSearch:any = [];
  dataHead:any = [];
  runId:any;
 
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  masterSelect:boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
   
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefaultPage(0);
      
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  setDefaultPage(type:any){
    this.result = [];
    var dataTmp = $.extend([],this.resultTmp);
    if(dataTmp.add_type_name){
      //this.result.add_type_id = dataTmp.add_type_id;
      //this.result.add_type_name = dataTmp.add_type_name;
      //this.result.remark = dataTmp.remark;
      this.result = dataTmp;
    }else{
      this.result.add_date = myExtObject.curDate();
    }
    
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.loadData();
      this.setDefaultPage(0);
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
    }
    this.dataHead.buttonSearch = null;
  }

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

    ngAfterContentInit() : void{
      myExtObject.callCalendar();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pcase_add_type",
          "field_id" : "add_type_id",
          "field_name" : "add_type_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pcase_add_type';
        this.listFieldId='add_type_id';
        this.listFieldName='add_type_name';
        this.listFieldNull='';
      }

      if(this.modalType==1 ){
        let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalComponent = true; 
          this.loadModalConfComponent = false;
          $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
      }
    }

    loadMyModalComponent(){
      this.loadModalConfComponent = true;  //password confirm
      this.loadModalComponent = false;
      $("#exampleModal").find(".modal-body").css("height","auto");
      $("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    }
  
    closeModal(){
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
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
                    
                    this.SpinnerService.show();
                        let headers = new HttpHeaders();
                        headers = headers.set('Content-Type','application/json');
                        var dataDel = [],dataTmp=[];
                        dataDel['log_remark'] = chkForm.log_remark;
                        dataDel['userToken'] = this.userData.userToken;

                          var bar = new Promise((resolve, reject) => {
                            this.dataSearch.forEach((ele, index, array) => {
                                  if(ele.addRunning == true){
                                    dataTmp.push(this.dataSearch[index]);
                                  }
                              });
                          });
                          
                          if(bar){
                            this.SpinnerService.show();
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0400/deleteDataSelect', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                console.log(alertMessage)
                                const confirmBox2 = new ConfirmBoxInitializer();
                                if(alertMessage.result==0){
                                  
                                  confirmBox2.setMessage(alertMessage.error);
                                  confirmBox2.setButtonLabels('ตกลง');
                                  confirmBox2.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                    }
                                    subscription2.unsubscribe();
                                  });
                                }else{
                                  
                                  confirmBox2.setMessage(alertMessage.error);
                                  confirmBox2.setButtonLabels('ตกลง');
                                  confirmBox2.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                      this.closebutton.nativeElement.click();
                                      this.loadData();
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

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.add_type_id = event.fieldIdValue;
        this.result.add_type_name = event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }

  loadData(){
    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0400/getData', student , {headers:headers}).subscribe(
      datalist => {
        let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
        console.log(getDataOptions)
        if(getDataOptions.data.length){
          this.dataSearch = getDataOptions.data;
          this.dataSearch.forEach((x : any ) => x.addRunning = false);
          console.log(this.dataSearch)
          this.rerender();
          this.SpinnerService.hide();
        }else{
          this.dataSearch = [];
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {this.SpinnerService.hide();}
    );
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.dataHead.run_id){
        confirmBox.setMessage('กรุณาค้นหาเลขคดี');
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
      }else if(!this.result.add_date){
        confirmBox.setMessage('กรุณาระบุวันที่ดำเนินการ');
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
      }else if(!this.result.add_type_name){
        confirmBox.setMessage('กรุณาระบุขั้นตอน');
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
        
          this.SpinnerService.show();
        
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          var data = $.extend({}, this.result)
          var formData = [];
          formData['run_id'] = this.dataHead.run_id;
          formData['userToken'] = this.userData.userToken;
          var student = JSON.stringify({
            "run_id" : this.dataHead.run_id,
            "add_running" : this.result.add_running,
            "add_date" : this.result.add_date,
            "add_type_id" : this.result.add_type_id ? this.result.add_type_id : 0,
            "add_type_name" : this.result.add_type_name,
            "remark" : this.result.remark,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          
          this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0400/saveData', student , {headers:headers}).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.SpinnerService.hide();
                      this.loadData();
                      this.result.add_running = '';
                      this.resultTmp = $.extend({}, this.result);
                      //this.setDefaultPage(0);
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

  delData(){

    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.addRunning == true){
          del++;
        }
      });
    });
    
    if(bar){
      if(del){
        this.openbutton.nativeElement.click();
      }else{
        
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการลบ');
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
       
    }
   
    
  }

  editData(index:any){
    this.SpinnerService.show();
    setTimeout(() => {
      this.result = $.extend({},this.dataSearch[index]);
      this.SpinnerService.hide();
    }, 200);
    
  }


}







