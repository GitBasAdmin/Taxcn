import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  NgForm,
} from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DialogLayoutDisplay,
  ConfirmBoxInitializer,
} from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fno3001,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno3001.component.html',
  styleUrls: ['./fno3001.component.css'],
})
export class Fno3001Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: [];
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  data:any = [];
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  myExtObject:any;
  checklist2:any;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  asyncObservable: Observable<string>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  masterSelect:boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.getNoticeNo(this.userData.courtId);
    // this.dataSearch = [];

    //this.asyncObservable = this.makeObservable('Async Observable');
    //this.successHttp();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      // lengthChange : false,
      // info : false,
      // paging : false,
      // searching : false
    };
    this.LoadData();
    this.result.sdate = myExtObject.curDate();
    this.result.edate = myExtObject.curDate();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อสถานะแจ้งเตือน');

  }

  getNoticeNo(courrId:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(courrId && !this.result.run_id){
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "std_id",
         "field_name" : "court_name",
        "condition" : " AND court_id='"+courrId+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.notice_court_running = productsJson[0].fieldIdValue;
            // this.result.notice_yy = myExtObject.curYear();
          }else{
            this.result.notice_court_running = '';
            this.result.notice_yy = '';
          }
         },
         (error) => {}
       )
    }
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      userToken: this.userData.userToken,
      url_name: 'fno3001',
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http
        .post('/'+this.userData.appName+'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          (res) => {
            // Success
            //this.results = res.json().results;
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen);
            this.programName = getDataAuthen.programName;
            this.defaultCaseType = getDataAuthen.defaultCaseType;
            this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
            this.defaultTitle = getDataAuthen.defaultTitle;
            this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          (msg) => {
            // Error
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
    });
  }

  // checkUncheckAll() {
  //   for (var i = 0; i < this.checklist.length; i++) {
  //     this.checklist[i].edit3001 = this.masterSelected;
  //     }

  //   // for (var i = 0; i < this.checklist2.length; i++) {
  //   //   this.checklist2[i].editNoticeId = this.masterSelected2;
  //   //     }
  //   //this.getCheckedItemList();

  // }

  // isAllSelected() {
  //   this.masterSelected = this.checklist.every(function(item:any) {
  //       return item.edit3001 == true;
  //   })
  // }

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

  DisEnable(){

  }

  // uncheckAll() {
  //   for (var i = 0; i < this.checklist.length; i++) {
  //     this.checklist[i].edit3001 = false;
  //   }
  //   // for (var i = 0; i < this.checklist2.length; i++) {
  //   //   this.checklist2[i].editNoticeId = false;
  //   // }
  //   this.masterSelected = false;
  //   // this.masterSelected2 = false;
  //   $("body").find("input[name='delValue']").val('');
  //   // $("body").find("input[name='delValue2']").val('');
  // }

  ClearAll(){
    //window.location.reload();
    this.result.barcode = null;
    this.result.n_type_id = null;
    this.result.notice_no = null;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

    searchData2(){
      this.LoadData();
    }

  // searchData2(){
  //   const confirmBox = new ConfirmBoxInitializer();
  //   confirmBox.setTitle('ข้อความแจ้งเตือน');
  //   confirmBox.setMessage('ต้องการปลดหมายเลขที่ ('+ this.result.notice_court_running + ')'+ this.result.notice_no + '/'+this.result.notice_yy);
  //   confirmBox.setButtonLabels('ตกลง','ยกเลิก');
  //   confirmBox.setConfig({
  //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //   });
  //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //     if (resp.success==true){
  //       this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno3001/updateRealeaseNotice', student , {headers:headers}).subscribe(up => {
  //          alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล')
  //       });
  //       //$("button[type='reset']")[0].click();
  //       //this.SpinnerService.hide();

  //     }else{
  //       alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
  //     }
  //     subscription.unsubscribe();
  //   });
  // }

  searchData(){
    console.log(this.result)
    if(!this.result.barcode &&
      !this.result.n_type_id &&
      !this.result.notice_court_running &&
      !this.result.notice_no &&
      !this.result.notice_yy
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
    }else if(!this.result.barcode && !this.result.notice_no){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('เลือก Barcode หมาย หรือ รหัสหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){this.SpinnerService.hide();}
        subscription.unsubscribe();
      });
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show();
      this.tmpResult = this.result;
      var jsonTmp = $.extend({}, this.tmpResult);
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
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNotice', student , {headers:headers}).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if(alertMessage.data==0){
              this.SpinnerService.hide();
              // confirmBox.setTitle(alertMessage.error);
              confirmBox.setMessage('ไม่พบหมายนี้ในระบบ');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  //this.SpinnerService.hide();
                  this.LoadData();
                  this.rerender();
                  console.log(this.dataSearch)
                }
                subscription.unsubscribe();
              });

            // let productsJson : any = JSON.parse(JSON.stringify(response));
            // // alert(productsJson.result);
            // if(productsJson.result==1){
            //   /*
            //   var bar = new Promise((resolve, reject) => {
            //     productsJson.data.forEach((ele, index, array) => {
            //           if(ele.indict_desc != null){
            //             if(ele.indict_desc.length > 47 )
            //               productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
            //           }
            //           if(ele.deposit != null){
            //             productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
            //           }
            //       });
            //   });

            //   bar.then(() => {
            //     //this.dataSearch = productsJson.data;
            //     //console.log(this.dataSearch)
            //   });
            //   */
            //   // this.dataSearch = productsJson.data;
            //   // this.numCase = productsJson.num_case;
            //   // this.numLit = productsJson.num_lit;
            //   //this.dtTrigger.next(null);
            //   this.LoadData();
            //   this.rerender();
            //   console.log(this.dataSearch)
            }else{
              //alert('เลขหมายนี้ได้ทำการปลดหมายแล้ว');
              this.SpinnerService.hide();
              confirmBox.setMessage('ต้องการปลดหมายเลขที่ ('+ this.result.notice_court_running + ')'+ this.result.notice_no + '/'+this.result.notice_yy);
              confirmBox.setButtonLabels('ตกลง','ยกเลิก');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno3001/updateRealeaseNotice', student , {headers:headers}).subscribe(response => {
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                    const confirmBox2 = new ConfirmBoxInitializer();
                    confirmBox2.setTitle('ข้อความแจ้งเตือน');
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });

                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        this.SpinnerService.hide();
                        this.ClearAll();
                        this.LoadData();
                        //$("button[type='reset']")[0].click();
                      }
                      subscription2.unsubscribe();
                    });
                    // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
                     
                   //this.ngOnInit();
                  });
                // }else{
                //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
                }
                subscription.unsubscribe();
              });
              //confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              // confirmBox.setMessage('ต้องการปลดหมายเลขที่ ('+ this.result.notice_court_running + ')'+ this.result.notice_no + '/'+this.result.notice_yy);
              // confirmBox.setButtonLabels('ตกลง','ยกเลิก');
              // confirmBox.setConfig({
              //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              // });
              // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              //   if (resp.success==true){
              //     $("button[type='reset']")[0].click();
              //     //this.SpinnerService.hide();
              //   }
              //   subscription.unsubscribe();
              // });
              //this.ngOnInit();
              //this.dataSearch = [];
              //this.rerender();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
      )

    }
  }

  LoadData() {
    // alert("xxxx");
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      var student = JSON.stringify({
          "sdate" : this.result.sdate?this.result.sdate:myExtObject.curDate(),
          "edate" : this.result.edate?this.result.edate:myExtObject.curDate(),
          "userToken" : this.userData.userToken
      });
      console.log(student);
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno3001', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
            this.posts = productsJson.data;
            // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');
          console.log(productsJson)
          if(productsJson.result==1){
            this.dataSearch = productsJson.data;
            console.log(this.dataSearch);
            //return false;
            // alert(this.dataSearch.length);
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            
              if(productsJson.length){
                this.posts.forEach((x : any ) => x.edit3001 = false);
                this.rerender();
              }
            setTimeout(() => {
              myExtObject.callCalendar();
            }, 500);
          }else{
            this.dataSearch = [];
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

     directiveDate2(date:any,obj:any){
        this.result[obj] = date;
     }

     directiveDate(date:any,obj:any,index:any){
      console.log(date.target.value)
      this.dataSearch[index][obj] = date.target.value;
    }


    submitForm() {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit3001 == true){
          del++;
        }
      });
    });
         //alert(this.checklist.length);
      if(bar){


      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการจัดเก็บ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //this.SpinnerService.hide();
            this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });
      // } else if (!this.judge_case_name) {
      //   confirmBox.setMessage('กรุณาระบุรายละเอียด');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //     layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
      //     if (resp.success == true) {
      //       //this.SpinnerService.hide();
      //       this.setFocus('judge_case_name');
      //     }
      //     subscription.unsubscribe();
      //   });
      } else {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        // if(this.prov_id.nativeElement["default_value"].checked==true){
        //   var inputChk = 1;
        // }else{
        //   var inputChk = 0;
        // }

        //  if(this.all_day_flag==true){
        //      var inputchk = 1;
        //  }else{
        //      var inputchk = 0;
        //  }
        /*
        var student = JSON.stringify({
          data: this.checkedList.release_date,
          n_type_id: this.result.n_type_id,

          // "title" : this.getTitle.find((x:any) => x.fieldIdValue === this.title).fieldNameValue,
          // "remark" : this.remark,
          userToken: this.userData.userToken,
        });
        */
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit3001 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        this.SpinnerService.show();
        // if (this.result.barcode) {
        //   this.http
        //     .post('/'+this.userData.appName+'ApiCT/API/fct0713/updateJson', student, {
        //       headers: headers,
        //     })
        //     .subscribe(
        //       (response) => {
        //         let alertMessage: any = JSON.parse(JSON.stringify(response));
        //         if (alertMessage.result == 0) {
        //           this.SpinnerService.hide();
        //           confirmBox.setMessage(alertMessage.error);
        //           confirmBox.setButtonLabels('ตกลง');
        //           confirmBox.setConfig({
        //             layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        //           });
        //           const subscription = confirmBox
        //             .openConfirmBox$()
        //             .subscribe((resp) => {
        //               if (resp.success == true) {
        //                 //this.SpinnerService.hide();
        //               }
        //               subscription.unsubscribe();
        //             });
        //         } else {
        //           this.SpinnerService.hide();
        //           confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
        //           confirmBox.setButtonLabels('ตกลง');
        //           confirmBox.setConfig({
        //             layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
        //           });
        //           const subscription = confirmBox
        //             .openConfirmBox$()
        //             .subscribe((resp) => {
        //               if (resp.success == true) {
        //                 $("button[type='reset']")[0].click();
        //                 //this.SpinnerService.hide();
        //               }
        //               subscription.unsubscribe();
        //             });
        //           this.ngOnInit();
        //           //this.form.reset();
        //           // $("button[type='reset']")[0].click();
        //         }
        //       },
        //       (error) => {
        //         this.SpinnerService.hide();
        //       }
        //     );
        // } else {


          this.http
            .post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno3001/updateRealeaseDate', data, {
              headers: headers,
            })
            .subscribe(
              (response) => {
                let alertMessage: any = JSON.parse(JSON.stringify(response));
                console.log(alertMessage);
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox
                    .openConfirmBox$()
                    .subscribe((resp) => {
                      if (resp.success == true) {
                        //this.SpinnerService.hide();
                      }
                      subscription.unsubscribe();
                    });
                } else {
                  this.SpinnerService.hide();
                  confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox
                    .openConfirmBox$()
                    .subscribe((resp) => {

                      // if (resp.success == true) {
                      //   $("button[type='reset']")[0].click();
                      //   //this.SpinnerService.hide();
                      // }
                      subscription.unsubscribe();
                    });
                  //this.ngOnInit();
                  this.afterSubmit();
                  //this.form.reset();
                  // $("button[type='reset']")[0].click();
                }
              },
              (error) => {
                this.SpinnerService.hide();
              }
            );
        // }
        }
      }
      }
    }

    afterSubmit(){
      this.masterSelect = false;
      this.LoadData();
    }


}
