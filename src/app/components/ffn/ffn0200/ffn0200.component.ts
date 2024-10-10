import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
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
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-ffn0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0200.component.html',
  styleUrls: ['./ffn0200.component.css']
})


export class Ffn0200Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  getOff:any;
  user_code:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  getTitle:any;
  usermng_id:any;
  result:any=[];
  items:any=[];
  getReceiptType:any;
  myExtObject:any;
  hid_receipt_type_id:any;
  programName:any;
  selectedData:any= 'ใช้ทุกประเภท';
  selectedData2:any= 'ใช้ได้ทั้งหมด';
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  getSubType:any;
  asyncObservable: Observable<string>;
  editIndex:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'desc']]
    };
    if(this.items)
    this.items.forEach((x : any ) => x.index = false);
    console.log(this.items)

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

        // this.SpinnerService.show();
        this.http.get('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0200?userToken='+this.userData.userToken+':angular').subscribe(posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
            this.posts = productsJson.data;
            console.log(this.posts);
            if(productsJson.result==1){
              this.checklist = this.posts;
              // this.checklist2 = this.posts;
              if(productsJson.data.length)
                this.posts.forEach((x : any ) => x.edit0200 = false);
              this.rerender();
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
        });

        var authen = JSON.stringify({
          "userToken" : this.userData.userToken,
          "url_name" : "ffn0200"
        });
        this.http.post('/'+this.userData.appName+'Api/API/authen', authen ,).subscribe(
          (response) =>{
            let getDataAuthen : any = JSON.parse(JSON.stringify(response));
            this.programName = getDataAuthen.programName;
            console.log(getDataAuthen)
          },
          (error) => {}
        )


 //======================== preceipt_type ======================================
var student = JSON.stringify({
  "table_name" : "preceipt_type",
  "field_id" : "receipt_type_id",
  "field_name" : "receipt_type_desc",
  "order_by": " receipt_type_id ASC",
  "userToken" : this.userData.userToken
});
//console.log(student)
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
  (response) =>{

    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    getDataOptions.unshift({fieldIdValue:9,fieldNameValue: 'ใช้ทุกประเภท'});
    this.getReceiptType = getDataOptions;
    this.result.receipt_type_id = 1;
    this.changeReceiptType(this.result.receipt_type_id);
    
    //this.result.rcv_flag = $("body").find("ng-select#rcv_flag span.ng-value-label").html();
  },
  (error) => {}
)

//======================== ptitle ======================================
var student = JSON.stringify({
  "table_name": "ptitle",
  "field_id": "title",
  "field_name": "title",
  "field_name2": "default_value",
  "condition": "AND title_flag = '1'",
  "order_by": " order_id ASC",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ใช้ได้ทั้งหมด'});
    //console.log(getDataOptions)
    this.getTitle = getDataOptions;
    this.result.title = 0;
    // this.result.title = this.getTitle.find((x : any ) => x.fieldNameValue2 === 1).fieldIdValue;
  },
  (error) => {}
)

//======================== pofficer ======================================
var student2 = JSON.stringify({
  "table_name" : "pofficer",
  "field_id" : "off_id",
  "field_name" : "off_name",
  "field_name2" : "dep_code",
  "condition": "AND (move_flag is null OR move_flag=0)",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getOff = getDataOptions;
    console.log(this.getOff)
    var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
    if(Off.length!=0){
      this.result.user_code = this.user_code = Off[0].fieldIdValue;
    }
  },
  (error) => {}
)


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

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0200 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0200 = false;
    }
    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = false;
    // }
    this.masterSelected = false;
    // this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    // $("body").find("input[name='delValue2']").val('');
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/


  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmp;
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
               dataTmp = {"sub_type_id":this.items[index]['fieldIdValue']};
              //  dataTmpId.push(ele.fieldIdValue);
              //  dataTmpName.push(ele.fieldNameValue);
           }

        });
    });
    if(bar){
      console.log(dataTmp);
      // console.log(dataTmpId);
      // console.log(dataTmpName);

      // dataSelect['fieldIdValue'] = dataTmpId.toString();
      // dataSelect['fieldNameValue'] = dataTmpName.toString();

      //console.log($.extend({},dataSelect))
      // this.onClickList.emit($.extend({},dataSelect))

    }
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  onClickListData(index:any): void {

    //  console.log(this.items[index]);
    //  console.log(this.items[index]['fieldIdValue']);
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    //console.log(dataSelect);
    //  console.log($.extend({},dataSelect));
     // this.useDataList();
    // this.onClickList.emit(this.items[index])
  }

  changeReceiptType(val:any){
    //======================== preceipt_sub_type ======================================
var student = JSON.stringify({
  "table_name" : "preceipt_sub_type",
  "field_id" : "sub_type_id",
  "field_name" : "sub_type_name",
  "condition": "AND receipt_type_id ='"+ val +"'",
  "order_by": " sub_type_id ASC",
  "userToken" : this.userData.userToken
});
//console.log(student)
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    console.log(getDataOptions)
    // getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทุกประเภทย่อย'});
    this.getSubType = getDataOptions;
    this.items = getDataOptions;
    if(this.posts.length && this.editIndex)
      this.items.forEach((x : any ) => (x.fieldIdValue == this.posts[this.editIndex].sub_type_id)?x.index = true:x.index = false);
    //this.result.rcv_flag = $("body").find("ng-select#rcv_flag span.ng-value-label").html();

  },
  (error) => {}
)
  }

  editData(index:any){
    console.log(this.posts[index])
    this.editIndex = index;
    this.SpinnerService.show();
    //this.renderer.setProperty(this.prov_id.nativeElement['hid_prov_id'],'value', this.posts[index]['edit_prov_id']);
    // this.renderer.setProperty(this.prov_id.nativeElement['prov_id'],'value', this.posts[index]['prov_id']);
      //this.judge_name = this.getJudge.filter((x:any) => x.fieldIdValue === this.posts[index]['prov_id']).fieldNameValue;
      //this.hid_receipt_type_id  = this.posts[index]['edit_receipt_type_id'];
      this.result.setup_running = this.posts[index]['setup_running'];
      this.result.receipt_type_id  = this.posts[index]['receipt_type_id'];
      // = this.posts[index]['sub_type_id'];

      this.result.budget_year  = this.posts[index]['budget_year'];
      this.result.book_no = this.posts[index]['book_no'];
      this.result.no_start = this.posts[index]['no_start'];
      this.result.no_end = this.posts[index]['no_end'];
      if(this.posts[index]['receipt_title']==null){
        this.posts[index]['receipt_title'] = 0;
      }
      if(this.posts[index]['user_code']==0){
        this.posts[index]['user_code'] = '';
      }
      this.result.title  = this.posts[index]['receipt_title'];
      this.user_code  = this.posts[index]['user_code'];
      this.result.user_code  = this.posts[index]['off_name'];
      this.usermng_id = this.posts[index]['usermng_id'];
      this.result.usermng_id  = this.posts[index]['mng_name'];
      this.result.message  = this.posts[index]['message'];
      this.result.sub_type_id  = this.posts[index]['sub_type_id'];
      this.changeReceiptType(this.result.receipt_type_id);

      // this.std_prov_name = this.list.find((x:any) => x.fieldIdValue === this.posts[index]['std_id']).fieldNameValue2;
      // if(parseInt(this.std_id) > 0){
      //     this.std_prov_name = '';
      // }



    //  if(this.posts[index]['all_day_flag']){
    //   this.all_day_flag = true;
    //  }else{
    //   this.all_day_flag = false;
    //  }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  successHttp() {

    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "ffn0200"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen )
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

    confirmBox() {
      this.delValue = $("body").find("input[name='delValue']").val();
      // this.delValue2 = $("body").find("input[name='delValue2']").val();
      // alert(this.delValue);
      var isChecked = this.posts.every(function(item:any) {
        return item.edit0200 == false;
      })

      const confirmBox = new ConfirmBoxInitializer();
      if(isChecked==true){
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
                    var bar = new Promise((resolve, reject) => {
                      this.posts.forEach((ele, index, array) => {
                            if(ele.edit0200 == true){
                              dataTmp.push(this.posts[index]);
                            }
                        });
                    });
                    if(bar){
                              console.log(dataTmp);

                      dataDel['userToken'] = this.userData.userToken;
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                     console.log(data)
                     this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0200/deleteSelect', data ).subscribe(
                      (response) =>{
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage);
                        if(alertMessage.result==0){
                          this.SpinnerService.hide();
                        }else{

                          this.SpinnerService.hide();
                          const confirmBox2 = new ConfirmBoxInitializer();
                          confirmBox2.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                          confirmBox2.setButtonLabels('ตกลง');
                          confirmBox2.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              $("button[type='reset']")[0].click();
                              //this.SpinnerService.hide();
                            }
                            subscription2.unsubscribe();
                          });

                          //this.ngOnInit();
                          // confirmBox.setMessage(alertMessage.error);
                          // confirmBox.setButtonLabels('ตกลง');
                          // confirmBox.setConfig({
                          //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          // });
                          // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          //   if (resp.success==true){
                          //     this.closebutton.nativeElement.click();
                          //     this.getData();
                          //   }
                          //   subscription.unsubscribe();
                          // });

                        }
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                    }
                  }
                  subscription.unsubscribe();

                });
            }
           }



  submitForm() {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      if(!this.result.budget_year || !this.result.book_no || !this.result.no_start || !this.result.no_end){
        confirmBox.setMessage('กรุณาระบุปีงบประมาณและเล่มที่เลขที่ใบเสร็จให้ครบถ้วน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
            // this.result.setFocus('budget_year');
          }
          subscription.unsubscribe();
        });

      }else{

        //var student = JSON.stringify({
        // "edit_judge_case_type_id" : this.hid_judge_case_type_id,
        // "judge_case_type_id" : this.judge_case_type_id,
        // "judge_case_type" : this.judge_case_type,
        // "judge_case_name" : this.judge_case_name,
        // "case_cate_id" : this.case_cate_id,
        // "judge_case_group_id" : this.judge_case_group_id,
        // "judge_case_title" : this.judge_case_title,
        // "title" : this.getTitle.find((x:any) => x.fieldIdValue === this.title).fieldNameValue,
        // "remark" : this.remark,
        //"userToken" : this.userData.userToken
        //});
        var student = [];
        student['setup_running'] = this.result.setup_running
        student['receipt_type_id'] = this.result.receipt_type_id;
        student['edit_receipt_type_id'] = this.hid_receipt_type_id;
        student['budget_year'] = this.result.budget_year;
        student['book_no'] = this.result.book_no;
        student['no_start'] = this.result.no_start;
        student['no_end'] = this.result.no_end;
        if(this.result.title==0){
          student['receipt_title'] = null;
        }else{
           student['receipt_title'] = this.result.title;
        }
        student['user_code'] = this.user_code;
        // student['off_name'] = this.result.off_name;
        student['usermng_id'] = this.usermng_id;
        // student['mng_name'] = this.result.mng_name;
        student['userToken'] = this.userData.userToken;
        var dataSelect = [];
        for(var i=0;i < this.items.length;i++){
          if(this.items[i].index){
            dataSelect.push({"sub_type_id":this.items[i]['fieldIdValue']});
          }
        }
        student['data']=dataSelect;
        student = $.extend({},student);
        console.log(JSON.stringify(student));
        //console.log($.extend({},student));

        this.SpinnerService.show();
        if(this.result.setup_running){
          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0200/saveData', student ).subscribe(
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
                    //this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }else{
                this.SpinnerService.hide();
                confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    $("button[type='reset']")[0].click();
                    //this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
                //this.ngOnInit();
                //this.form.reset();
                 // $("button[type='reset']")[0].click();

              }
            },
            (error) => {this.SpinnerService.hide();}
          )
        }else{
          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0200/saveData', student ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              console.log(alertMessage)
              if(alertMessage.result==0){
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
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
                this.SpinnerService.hide();
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    $("button[type='reset']")[0].click();
                     //this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
                //this.ngOnInit();
                //this.form.reset();
                 // $("button[type='reset']")[0].click();

              }
            },
            (error) => {this.SpinnerService.hide();}
          )

        }
      }

    }

    checkUncheckAll() {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].edit0200 = this.masterSelected;
        }
      }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    ClearAll(){
      window.location.reload();
    }

    printReport(type:any){

      var rptName = 'rffn0200';
      // if(type==1){
      //   rptName='rffn0500';
      // }
      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        // //  "pcase_type" : this.selCaseType,
        //  "pcase_cate_id" : this.pcase_cate_id,
        //  "pcase_status_id" : this.pcase_status_id,
        //  "ptable_id" : this.table_id,
        //  "pdate_start" : myExtObject.conDate($("#sdate").val()),
        //  "pdate_end" : myExtObject.conDate($("#edate").val()),

       });
      // alert(paramData);return false;
      console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }


}







