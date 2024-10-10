import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fct0706,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0706.component.html',
  styleUrls: ['./fct0706.component.css']
})


export class Fct0706Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;

  Datalist:any;
  result:any=[];
  item:any=[];
  edit_item:any=[];
  start_deposit:any=[];
  end_deposit:any=[];
  amount:any=[];
  unit:any=[];
  fee_start_from:any=[];
  fee_not_over:any=[];
  getCaseCate:any;
  getCaseCourtType:any;


  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  

  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result.court_type_id=0;
    this.result.seq=0;
    this.result.round_flag = 1;

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706', student).subscribe(posts => {
    let productsJson : any = JSON.parse(JSON.stringify(posts));
    this.posts = productsJson.data;
    console.log("productsJson=>", productsJson.data);
    if(productsJson.result==1){
      //--set formart  default_value 0.00
      var bar = new Promise((resolve, reject) => {
        productsJson.data.forEach((ele, index, array) => {
              if(ele.not_over != null){
                productsJson.data[index]['not_over'] = this.curencyFormat(ele.not_over,2);
              }
          });
      });

      this.checklist = this.posts;
      if(productsJson.data.length)
        this.posts.forEach((x : any ) => x.edit0706 = false);
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

    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct0706"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        // console.log(getDataAuthen)
      },
      (error) => {}
    )

    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt_type",
      "field_id" : "court_type_id",
      "field_name" : "court_type_name",
      "condition": "AND select_flag='1'",
      "order_by": " court_type_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCourtType = getDataOptions;
      },
      (error) => {}
    )
    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "order_by" : "case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
      },
      (error) => {}
    )
  }


  //row ทุนทรัพย์
  counter(i: number) {
      return new Array(i);
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
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  setFocus(name:any) {
    // const ele = this.fct0706.nativeElement[name];
    // console.log("name=>", this.fct0706.nativeElement);
    // console.log("ele=>", ele);
    // if (ele) {
    //   ele.focus();
    // }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0706 = this.masterSelected;
      }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0706 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0706 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll(){
    window.location.reload();
  }

  //startDate , endDate
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  getCheckedItemList(){
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
          alert(del);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
       })
    }, 100);

  }

  receiveFuncListData(event:any){
    // this.result.post_id = event.fieldIdValue;
    // this.result.position = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    // console.log(event)
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
  

  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.fee_desc){
      confirmBox.setMessage('กรุณาระบุชื่อ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('fee_desc');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.case_cate_id){
      confirmBox.setMessage('กรุณาระบุประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('case_cate_id');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.start_date){
      confirmBox.setMessage('กรุณาระบุตั้งแต่วันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('start_date');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.end_date){
      confirmBox.setMessage('กรุณาระบุถึงวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('end_date');
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      let deposit=[];
      for(var index=0;index<10;index++){
          if(this.item[index] == undefined){
            this.item[index] = index+1;
          }
            
          if(this.edit_item[index] == undefined){
            this.edit_item[index] = 0;
          }
        
        if(this.start_deposit[index] || this.end_deposit[index] ||this.amount[index] || 
          this.fee_start_from[index] || this.unit[index] || this.fee_not_over[index] ||
          this.edit_item[index]){

          var student = {
            "item" : this.item[index],
            "edit_item" : this.edit_item[index],
            "start_deposit" : this.curencyFormatRemove(this.start_deposit[index]),
            "end_deposit" : this.curencyFormatRemove(this.end_deposit[index]),
            "amount" : this.curencyFormatRemove(this.amount[index]),
            "fee_start_from" : this.curencyFormatRemove(this.fee_start_from[index]),
            "unit" :  this.unit[index],
            "fee_not_over" : this.curencyFormatRemove(this.fee_not_over[index]),
          };

          if(!this.start_deposit[index] && !this.end_deposit[index] && !this.amount[index] && 
            !this.fee_start_from[index] && !this.unit[index] && !this.fee_not_over[index] && 
            !this.unit[index] && this.edit_item[index]){
            student["delete"] = 1;
          }
          
          deposit.push(student);
        }
      }

      // console.log(this.result.round_flag);
      if(this.result.round_flag == undefined)
         this.result.round_flag = null;

      var student1 = JSON.stringify({
        "seq" : this.result.seq,
        "fee_desc" : this.result.fee_desc,
        "court_type_id" : this.result.court_type_id,
        "case_cate_id" : this.result.case_cate_id,
        "start_date" : this.result.start_date,
        "end_date" : this.result.end_date,
        "not_over" : this.curencyFormatRemove(this.result.not_over),
        "round_flag" : this.result.round_flag,
        "userToken" : this.userData.userToken,
        "data" : deposit
        });

      // console.log("deposit=>", student1);
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706/saveData', student1).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          // console.log("alertMessage.result=>", alertMessage.result);
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  $("button[type='reset']")[0].click();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }


  editData(index:any){
    //console.log("editData index=>", index)
    // this.result=[];
    this.start_deposit=[];
    this.end_deposit=[];
    this.amount=[];
    this.fee_start_from=[];
    this.fee_not_over=[];
    this.unit=[];
    this.item=[];
    this.edit_item=[];
    
    this.SpinnerService.show();

    this.result.seq  = this.posts[index]['seq'];
    this.result.fee_desc  = this.posts[index]['fee_desc'];
    this.result.case_cate_id  = this.posts[index]['case_cate_id'];
    this.result.start_date = this.posts[index]['start_date'];
    this.result.end_date = this.posts[index]['end_date'];
    this.result.not_over = this.posts[index]['not_over'];
    this.result.round_flag = this.posts[index]['round_flag'];
    if(this.posts[index]['court_type_id'] != null)
      this.result.court_type_id  = this.posts[index]['court_type_id'];
    else
      this.result.court_type_id  = 0;


    //ทุนทรัพย์
    var student = JSON.stringify({
      "seq" : this.posts[index]['seq'],
      "userToken" : this.userData.userToken
    });
    // console.log(student)

    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706/getCourtFeeRate', student ).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      // console.log("edit getDataOptions=>", getDataOptions);
      var bar = new Promise((resolve, reject) => {
        getDataOptions.data.forEach((ele, index, array) => {
          
          // console.log("ele.start_deposit=>",ele.start_deposit);
          this.item[index] = ele.item;
          this.edit_item[index] = ele.edit_item;
          this.unit[index] = ele.unit;

          if(ele.start_deposit != null)
            this.start_deposit[index] = this.curencyFormat(ele.start_deposit, 2);

          if(ele.end_deposit != null)
            this.end_deposit[index] = this.curencyFormat(ele.end_deposit, 2);

          if(ele.amount != null)
            this.amount[index] = this.curencyFormat(ele.amount, 2);

          if(ele.fee_start_from != null)
            this.fee_start_from[index] = this.curencyFormat(ele.fee_start_from, 2);

          if(ele.fee_not_over != null)
            this.fee_not_over[index] = this.curencyFormat(ele.fee_not_over, 2);

        });
      });
    });
    
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, ""); 
    } else {
      return "";
    }
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      
      var student = JSON.stringify({
      "fee_desc" : this.result.fee_desc,
      "court_type_id" : this.result.court_type_id,
      "case_cate_id" : this.result.case_cate_id,
      "start_date" : this.result.start_date,
      "end_date" : this.result.end_date,
      "not_over" : this.result.not_over,
      "round_flag" : this.result.round_flag,
      "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706/search', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0706 = false);
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

        },
        (error) => {this.SpinnerService.hide();}
      );
  }

  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0706 == false;
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

  goToLink(url: string){
    window.open(url, "_blank");
  }


  loadMyChildComponent(){
    this.loadComponent = true;
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
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
      posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log(productsJson)
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
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                        if(ele.edit0706 == true){
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706/deleteSelect', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                  // console.log("alertMessage=>", alertMessage)

                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.closebutton.nativeElement.click();
                      $("button[type='reset']")[0].click();
                      this.getData();
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

  printReport(){
    var rptName = 'rct0706';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
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

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0706', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          //console.log(productsJson)
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                    if(ele.not_over != null){
                      productsJson.data[index]['not_over'] = this.curencyFormat(ele.not_over,2);
                    }
                });
            });

            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0706 = false);
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
  }

  closeWindow(){
    if(window.close() == undefined){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }
}
