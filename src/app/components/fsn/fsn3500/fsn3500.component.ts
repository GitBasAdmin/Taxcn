import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';
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
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fsn3500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn3500.component.html',
  styleUrls: ['./fsn3500.component.css']
})


export class Fsn3500Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
  getOrderName:any;
  masterSelected: boolean;
  posts:any;
  search:any;
  nCheck:any;
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
  numCase:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  toPage:any="fkb0301";
  toPage2:any='prno5000';
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  stype:any;
  getOff:any;
  off_id:any;
  sumClick:any = 0;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  masterSelect:boolean = false;
  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fsn3500',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 300,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true
    };
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['program'])
        this.retPage = params['program'];
    });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
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
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )


    var student = JSON.stringify({
      "cond":2,
      "userToken" : this.userData.userToken
    });
  this.listTable='pjudge';
  this.listFieldId='judge_id';
  this.listFieldName='judge_name';
  this.listFieldNull='';
  this.listFieldType=JSON.stringify({"type":2});

//console.log(student)

 this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
     (response) =>{
       let productsJson :any = JSON.parse(JSON.stringify(response));
       if(productsJson.data.length){
         this.list=productsJson.data;
         console.log(this.list)
       }else{
          this.list = [];
       }
      //  this.list = response;
      // console.log('xxxxxxx',response)
     },
     (error) => {}
   )

    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "dep_code",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        console.log(this.getOff)
        var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        if(Off.length!=0){
          this.result.off_id = this.off_id = Off[0].fieldIdValue;
        }
      },
      (error) => {}
    )

     //======================== pjudge ======================================
     var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getJudge = getDataOptions;
        this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    // this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
       this.getOrderName = [{id:'',text:'เลือก'},{id:'1',text:'ที่ตั้ง'},{id:'2',text:'บ้านเลขที่'},{id:'3',text:'หมู่'},{id:'4',text:'ถนน'},{id:'5',text:'ซอย'},{id:'6',text:'แขวง/ตำบล'},{id:'7',text:'เขต/อำเภอ'},{id:'8',text:'จังหวัด'}];
      //  this.getDateType = [{id:'1',text:'วันที่ออกแดงตั้งแต่'},{id:'2',text:'วันที่แจ้งการอ่านตั้งแต่'}];
      //  this.result.stype = '1';

       //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.result.order_name = '';
      this.result.notice_flag = 0;
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fsn3500"
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
          // this.defaultTitle = getDataAuthen.defaultTitle;
          // this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    this.getCheckedItemList();
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3500 == true){
          del++;
        }
      });
    });
    if(bar){
      if(del)
        this.sumClick = del+" รายการ";
      else
        this.sumClick = '';
    }
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
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }


    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
   }


   changeOrderName(type:any){
    if(this.dataSearch && this.result.order_name != ''){
      if(type==1){
        this.result.order_by = 'addr';
      }else if(type==2){
        this.result.order_by = 'addr_no';
      }else if(type==3){
        this.result.order_by = 'moo';
      }else if(type==4){
        this.result.order_by = 'road';
      }else if(type==5){
        this.result.order_by = 'soi';
      }else if(type==6){
        this.result.order_by = 'tambon_id';
      }else if(type==7){
        this.result.order_by = 'amphur_id';
      }else if(type==8){
        this.result.order_by = 'prov_id';
      }

      this.searchData();
    // }else{
    //   this.dataSearch = [];
      //this.searchIndex();
    }
  }

  //  tabChange(obj:any){
  //    if(obj.target.value){
  //      this.renderer.setProperty(this.req_title_id.nativeElement['dep_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
  //    }else{
  //      this.req_title_id.nativeElement['dep_use'].value="";
  //      this.req_title_id.nativeElement['dep_name'].value="";
  //    }
  //  }

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
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      if(name=='judge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.judge_name = productsJson[0].fieldNameValue;
            }else{
              this.result.judge_id = null;
              this.result.judge_name = '';
            }
          },
          (error) => {}
        )
      }
    }


    OrderData(index:any){
        var student = JSON.stringify({
        "notice_order": this.dataSearch[index].notice_order,
        "notice_running": this.dataSearch[index].notice_running,
        "send_item": this.dataSearch[index].send_item,
        "edit_send_item": this.dataSearch[index].edit_send_item,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/updateNoticeSend', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.result == 1){
            console.log('goood');
          }else{
            console.log('noooo');
          }
        },
        (error) => {}
      )
    }


    // chkOrder(index:any){
    //   if(this.dataSearch[index].notice_order){
    //     this.OrderData(index);
    //   }else{
    //     this.dataSearch[index].edit3500 = false;
    //   }
    // }


    groupData(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3500 == true){
          del++;
        }
      });
    });

      if(bar){
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการจัดกลุ่ม');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //  this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        // alert('ooooo');
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit3500 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        // this.SpinnerService.show();

        this.SpinnerService.hide();
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ต้องการจัดกลุ่มหมายที่เลือกใช่ไหม');
        confirmBox.setButtonLabels('ตกลง','ยกเลิก');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });

        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/saveGroup', data ).subscribe(response => {
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });

              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){this.SpinnerService.hide();}
                subscription.unsubscribe();
              });
              // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
              //  $("button[type='reset']")[0].click();
             //this.ngOnInit();
             this.searchData();
             this.sumClick = '';
            });
          // }else{
          //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
          }
          subscription.unsubscribe();
        });
        }
      }
      }
    }

    cancelData(){
       // alert('xxxxx');
       const confirmBox = new ConfirmBoxInitializer();
       confirmBox.setTitle('ข้อความแจ้งเตือน');
       var del = 0;
       var bar = new Promise((resolve, reject) => {
       this.dataSearch.forEach((ele, index, array) => {
         if(ele.edit3500 == true){
           del++;
         }
       });
     });

       if(bar){
       if (!del) {
         confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการยกเลิกสร้างกลุ่ม');
         confirmBox.setButtonLabels('ตกลง');
         confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
         });
         const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
           if (resp.success == true) {
              // this.result.setFocus('barcode');
           }
           subscription.unsubscribe();
         });

       } else {
         // alert('ooooo');
         var dataTmp = [],dataSave = [];
         var bar = new Promise((resolve, reject) => {
           this.dataSearch.forEach((ele, index, array) => {
                 if(ele.edit3500 == true){
                   dataTmp.push(this.dataSearch[index]);
                 }
             });
         });
         if(bar){
           dataSave['data'] = dataTmp;
           dataSave['userToken'] = this.userData.userToken;
           var data = $.extend({}, dataSave);
           console.log(JSON.stringify(data));
         // this.SpinnerService.show();

         this.SpinnerService.hide();
         const confirmBox = new ConfirmBoxInitializer();
         confirmBox.setTitle('ข้อความแจ้งเตือน');
         confirmBox.setMessage('ต้องการยกเลิกกลุ่มหมายที่เลือกใช่ไหม');
         confirmBox.setButtonLabels('ตกลง','ยกเลิก');
         confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
         });

         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
           if (resp.success==true){
             this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/cancelGroup', data ).subscribe(response => {
               let alertMessage : any = JSON.parse(JSON.stringify(response));
               confirmBox.setMessage(alertMessage.error);
               confirmBox.setButtonLabels('ตกลง');
               confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
             });

               const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                 if (resp.success==true){this.SpinnerService.hide();}
                 subscription.unsubscribe();
               });
               // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
               //  $("button[type='reset']")[0].click();
              //this.ngOnInit();
              this.searchData();
              this.sumClick = '';
             });
           // }else{
           //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
           }
           subscription.unsubscribe();
         });
         }
       }
       }
     }

     copyData(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3500 == true){
          del++;
        }
      });
    });

      if(bar){
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการทำสำเนา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //  this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        var notice_number = prompt("ระบุรหัสหมายที่เป็นต้นฉบับในการสำเนาข้อมูลผลหมาย : ตัวอย่าง (22)-12345/2565");
        if (notice_number != null && notice_number.length > 5){
          // this.result.org_notice_no = notice_number;
        // alert('ooooo');
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit3500 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['org_notice_no'] = notice_number;
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        // this.SpinnerService.show();

        this.SpinnerService.hide();
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ต้องการสำเนาข้อมูลหมายที่เลือกใช่ไหม');
        confirmBox.setButtonLabels('ตกลง','ยกเลิก');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });

        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/copyNoticeResult', data ).subscribe(response => {
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });

              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){this.SpinnerService.hide();}
                subscription.unsubscribe();
              });
              // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
              //  $("button[type='reset']")[0].click();
             //this.ngOnInit();
             this.searchData();
             this.sumClick = '';
            });
          // }else{
          //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
          }
          subscription.unsubscribe();
        });
        }
       }else{
          alert("กรุณาระบุข้อมูลหมายต้นฉบับที่ต้องการทำสำเนา");
          this.result.org_notice_no = null;
        }
      }
      }
    }



    sendToServer(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3500 == true){
          del++;
        }
      });
    });

      if(bar){
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการส่งหมายขึ้นมือถือ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //  this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        // alert('ooooo');
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit3500 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        // this.SpinnerService.show();

        this.SpinnerService.hide();
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ต้องการส่งหมายที่เลือกขึ้นมือถือใช่ไหม');
        confirmBox.setButtonLabels('ตกลง','ยกเลิก');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });

        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/sendToServer', data ).subscribe(response => {
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              if(alertMessage.result == 0){
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });

                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){this.SpinnerService.hide();}
                subscription.unsubscribe();
                });
              }else{
                var dataTmp = alertMessage.data;
                console.log(alertMessage);
                dataTmp.forEach((ele,index,array) => {
                  if(ele.upload_result == 0){
                    this.getMessage(ele.upload_error);
                  }
                });
                this.uploadData(dataTmp);
                //  this.searchData();

                this.sumClick = '';
              }
              // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
              //  $("button[type='reset']")[0].click();
             //this.ngOnInit();
            });
          // }else{
          //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
          }
          subscription.unsubscribe();
        });
        }
      }
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
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }

    downloadFormServer(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3500 == true){
          del++;
        }
      });
    });

      if(bar){
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการดึงหมายลงระบบศาล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //  this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        // alert('ooooo');
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit3500 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        // this.SpinnerService.show();

        this.SpinnerService.hide();
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ต้องการดึงหมายที่เลือกลงระบบศาลใช่ไหม');
        confirmBox.setButtonLabels('ตกลง','ยกเลิก');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });

        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/downloadFormServer', data ).subscribe(response => {
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              if(alertMessage.result == 0){
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });

                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){this.SpinnerService.hide();}
                subscription.unsubscribe();
                });
              }else{
                var dataTmp = alertMessage.data;
                console.log(alertMessage);
                dataTmp.forEach((ele,index,array) => {
                  if(ele.download_result == 0){
                    this.getMessage(ele.download_error);
                  }
                });
                this.downloadData(dataTmp);
                //  this.searchData();

                this.sumClick = '';
              }

            });
          }
          subscription.unsubscribe();
        });
        }
      }
      }
    }

    uploadData(productsJson :any){
      this.posts = productsJson;
      // this.data = productsJson.data;
      console.log(this.posts);
      this.posts.forEach((ele, i, array) => {
            this.dataSearch.forEach((dle,j,array) =>{
              if(ele.notice_running == dle.notice_running){
                console.log(j);
                this.dataSearch[j].edit3500 = false;
                if(ele.upload_result == 1){
                  this.dataSearch[j].upload = true;
                }else{
                  this.dataSearch[j].upload = false;
                }
              }
            });
       });

      setTimeout(() => {
        this.SpinnerService.hide();
      }, 500);
    }

    downloadData(productsJson :any){
      this.posts = productsJson;
      // this.data = productsJson.data;
      console.log(this.posts);
      this.posts.forEach((ele, i, array) => {
            this.dataSearch.forEach((dle,j,array) =>{
              if(ele.notice_running == dle.notice_running){
                console.log(j);
                this.dataSearch[j].edit3500 = false;
                if(ele.download_result == 1){
                  this.dataSearch[j].import = true;
                }else{
                  this.dataSearch[j].import = false;
                }
              }
            });
       });

      setTimeout(() => {
        this.SpinnerService.hide();
      }, 500);
    }

    assignValue(num:any){
      if((num == undefined) || (num == "") || (num == null))
        return 0;
      else
        return parseInt(num);
    }

    assignValueFloat(num:any){
      if((num == undefined) || (num == "") || (num == null))
        return 0;
      else
        return parseFloat(num);
    }

    receiveJudgeListData(event:any){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }

    searchData(){
      this.sumClick = 0;
      console.log(this.result)
      if(!this.result.off_id &&
        !this.result.notice_flag &&
        !this.result.sdate && !this.result.edate &&
        !this.result.sdate2 && !this.result.edate2 &&
        !this.result.sdate3 && !this.result.edate3
        ){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
      }else if((!this.result.sdate && !this.result.edate) && (!this.result.sdate2 && !this.result.edate2) && (!this.result.sdate3 && !this.result.edate3)){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('เลือกวันที่จ่ายหมาย และ/หรือ วันที่บันทึกผู้เดินหมาย และ/หรือ วันที่บันทึกผลหมาย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){this.SpinnerService.hide();}
          subscription.unsubscribe();
        });
      }else{
        this.SpinnerService.show();
        this.tmpResult = this.result;
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['order_type'] = this.result.order_by;
        jsonTmp['userToken'] = this.userData.userToken;
        /*
        if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
        if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
        if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
        if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
        if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
        if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
        jsonTmp['userToken'] = this.userData.userToken;
        */
        //console.log(jsonTmp)
        // if(jsonTmp.card_type==1){
        //   jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        // }
        // if(jsonTmp.card_type1==1){
        //   jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
        // }

        var student = jsonTmp;
        console.log(JSON.stringify(student))
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500', student ).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        // if(ele.indict_desc != null){
                        //   if(ele.indict_desc.length > 47 )
                        //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                        // }
                        // if(ele.deposit != null){
                        //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                        // }
                        if(ele.send_notice_group != null){
                          productsJson.data[index]['cut_notice_group'] = ele.send_notice_group.split('_',1);
                        }
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                this.dataSearch = productsJson.data;
                // this.numCase = productsJson.num_case;
                // this.numLit = productsJson.num_lit;
                //this.dtTrigger.next(null);
                this.rerender();
                console.log(this.dataSearch)
              }else{
                this.dataSearch = [];
                this.getCheckedItemList();
                this.rerender();
                // this.numCase = 0;
                // this.numLit = 0;
              }
              console.log(productsJson)
              this.SpinnerService.hide();
          },
          (error) => {}
        )

      }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    exportAsXLSX(): void {
      if(this.dataSearch){
        var excel =  JSON.parse(JSON.stringify(this.dataSearch));
        console.log(excel)
        var data = [];var extend = [];
        var bar = new Promise((resolve, reject) => {

          for(var i = 0; i < excel.length; i++){
            // if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
            //   excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
            // else
            //   excel[i]['case_no'] = "";
            // if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
            //   excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
            // else
            //   excel[i]['red_no'] = "";
            // if(excel[i]['date_appoint'])
            //   excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
            // else
            //   excel[i]['dateAppoint'] = "";
            // if(excel[i]['old_red_no'])
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
            // else
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

            for(var x=0;x<17;x++){
              if(x==0)
                data.push(excel[i]['red_no']);
              if(x==1)
                data.push(excel[i]['case_no']);
              if(x==2)
                data.push(excel[i]['case_date']);
              if(x==3)
                data.push(excel[i]['judging_date']);
              if(x==4)
                data.push(excel[i]['result_desc']);
              if(x==5)
                data.push(excel[i]['judge_name']);
              if(x==6)
                data.push(excel[i]['judge_order_type']);
              // if(x==7)
              //   data.push(excel[i]['accu_desc']);
              // if(x==8)
              //   data.push(excel[i]['alle_desc']);
              // if(x==9)
              //   data.push(excel[i]['indict_desc']);
              // if(x==10)
              //   data.push(excel[i]['amphur_name']);
              // if(x==12)
              //   data.push(excel[i]['deposit']);
              // if(x==12)
              //   data.push(excel[i]['guar_pros_desc']);
              // if(x==13)
              //   data.push(excel[i]['judge_name']);
              // if(x==14)
              //   data.push(excel[i]['oldCaseNo']);
              // if(x==15)
              //   data.push(excel[i]['admit_desc']);
              // if(x==17)
              //   data.push(excel[i]['transfer_court_name']);
            }

            extend[i] = $.extend([], data)
            data = [];
            //extend[i] = Object.values(data)
          }
        });
        if(bar){
          var objExcel = [];
          // objExcel['deposit'] = this.deposit;
          objExcel['data'] = extend;
          console.log(objExcel)
          this.excelService.exportAsExcelFile(objExcel,'fsn3500' ,this.programName);
        }

      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }
    }

    goToPic(img:any){
      // winURL = winURL+'/'+this.userData.appName+"ApiNO/API/NOTICE/fsn3500/openImage";
      let picURL = '/'+this.userData.appName+'ApiNO/API/NOTICE/fsn3500/openImage?image='+img;
      window.open(picURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1600,height=800");

    }

    goToPage(notice_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?notice_running='+notice_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1600,height=800");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    goToPage2(notice_running:any,notice_number:any,notice_type_name:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage2+'?notice_running='+notice_running+'&notice_no='+notice_number+'&notice_type_name='+notice_type_name;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=600,height=200");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }


  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }
  printReport(val:any,notice_running:any,send_item:any,type:any,send_by:any,pay_name:any){

    var rptName = 'rsn0300_img';

    if(val==1){
      rptName = 'rsn0300';
    }

    if(typeof(pay_name)=='undefined'){
      pay_name = '';
    }

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
     var paramData = JSON.stringify({
          "pnotice_running" : notice_running,
          "psend_item" : send_item,
          "ptype" : type,
          "psend_by" : send_by,
          "ppay_name" : pay_name,
      //  "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),
      //  "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),
     });
      console.log(paramData);
    // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
  }

}







