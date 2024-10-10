import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
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
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fct0214,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0214.component.html',
  styleUrls: ['./fct0214.component.css']
})


export class Fct0214Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:string;
  selCaseType:any='แพ่ง';
  selCaseTypeStat:any='แพ่ง';
  selTitleStat:any='ภษ';
  //-----------------
  result:any = [];
  getCaseType:any;
  case_type:any;
  getCaseTypeStat:any;
  getCaseCate:any;
  getCaseCateGroup:any;
  case_type_stat:any;
  title_id:any;
  getTitle:any;
  con_flag:any;
  getPrintType:any;

  edit_case_type:any;
  edit_case_cate_group:any;
  edit_stat_group:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fct0214',{static: true}) fct0214 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      // order:[[3,'asc']]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      //this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0214?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("productsJson=>", productsJson.data);

          if(productsJson.result==1){
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                    // if(ele.indict_desc != null){
                    //   if(ele.indict_desc.length > 47 )
                    //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                    // }
                    if(ele.print_to != null){
                      productsJson.data[index]['print_to'] = this.curencyFormat(ele.print_to,2);
                    }
                    productsJson.data[index]['order_num'] = index + 1;
                });
            });

            bar.then(() => {
              //this.dataSearch = productsJson.data;
              //console.log(this.dataSearch)
            });
            // this.numNotice = productsJson.data.length;
            // this.numCase = productsJson.num_case;
            // this.numCase = productsJson.num_case;
            // this.numLit = productsJson.num_lit;
            //this.dtTrigger.next(null);
           // this.rerender();
       }else{
          //  this.rerender();
            // this.numCase = 0;
            // this.numLit = 0;
          }

          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0214 = false);
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
        "url_name" : "fct0214"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          // console.log(getDataAuthen)
        },
        (error) => {}
      )

      //======================== getCaseType ======================================
      var Json = JSON.stringify({
        "table_name" : "pcase_type",
        "field_id" : "case_type",
        "field_name" : "case_type_desc",
        "userToken" : this.userData.userToken
      });
        // console.log(Json);
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
        (response) =>{
          // console.log('getCaseType=>'+response);
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          this.result.case_type = this.userData.defaultCaseType;
          this.changeCaseType(this.userData.defaultCaseType,0);
         // this.result.case_cate_group = this.getCaseCateGroup[0].fieldIdValue.toString();
          // this.result.case_cate_group = 11;
          // this.result.case_cate_id = 2;
        },
        (error) => {}
      )

      this.getPrintType = [{id:'0',text:''},{id:'1',text:'(แบบเยาวชนฯ)-1คอลัมน์ แบบเต็มหน้า'},{id:'2',text:'(แบบสิ่งแวดล้อม)-2 คอลัมน์ แบบเต็มหน้า'},{id:'3',text:'(แบบแพ่งทั่วไป)-2 คอลัมน์ แบบเต็มหน้า และ 1 คอลัมน์ แบบครึ่งหน้า'},{id:'4',text:'(แบบอาญาทั่วไป)-2 คอลัมน์ แบบเต็มหน้า และ 1 คอลัมน์ แบบครึ่งหน้า'},{id:'5',text:'(แบบผู้บริโภค)-2 คอลัมน์ แบบเต็มหน้า และ 1 คอลัมน์ แบบครึ่งหน้า'}];
  }

  changeCaseType(caseType:number,type:any){
      var student = JSON.stringify({
      "table_name": "pcase_cate_group",
      "field_id": "case_cate_group",
      "field_name": "case_cate_group_name",
      "field_name2": "case_type_stat",
      "condition": " AND case_type="+caseType,
      "order_by":" case_cate_group ASC",
      "userToken" : this.userData.userToken
    });
    var student2 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "field_name2": "case_type",
      "condition": " AND case_type="+caseType,
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCateGroup = getDataOptions;
        this.result.case_cate_group = getDataOptions.length >0 ? this.getCaseCateGroup[0].fieldIdValue : '';
        console.log(this.getCaseCateGroup);
        console.log(this.getCaseCateGroup[0].fieldIdValue);
    },
      (error) => {}
    )

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        console.log(this.getCaseCate);
     },
      (error) => {}
    )

    });
    return promise;
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }//100000 เป็น 100,000.00

  ngAfterContentInit() : void{
    // this.result.con_flag = this.getConFlag.find((x:any) => x.fieldIdValue === 1).fieldIdValue;
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

  setFocus(name:any) {
    const ele = this.fct0214.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0214 = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0214 == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0214 = this.masterSelected;
    }

    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].edit0214){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].edit0214;
      }
    }
  }

  ClearAll(){
    window.location.reload();
  }

  //save update
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.stat_group){
      confirmBox.setMessage('กรุณาระบุรหัสกลุ่ม');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('prov_id');
        // }
        subscription.unsubscribe();
      });

    }else if(!this.result.group_name){
      confirmBox.setMessage('กรุณาระบุรายละเอียดกลุ่ม');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('off_id');
        // }
        subscription.unsubscribe();
      });
    // }else if(!this.result.title_id){
    //   confirmBox.setMessage('กรุณาระบุอักษรคำนำหน้าคดีดำ');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     // if (resp.success==true){
    //     //   this.setFocus('off_id');
    //     // }
    //     subscription.unsubscribe();
    //   });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "edit_case_type" : this.edit_case_type,
        "edit_case_cate_group" : this.edit_case_cate_group,
        "edit_stat_group" : this.edit_stat_group,
        "case_type" : this.result.case_type,
        "case_cate_group" : this.result.case_cate_group,
        "stat_group" : this.result.stat_group,
        "group_name" : this.result.group_name,
        "branch_flag" : this.result.branch_flag,
        "no_edit_flag" : this.result.no_edit_flag,
        "print_type" : this.result.print_type,
        "print_to" : this.result.print_to,
        "userToken" : this.userData.userToken
        });
      console.log("student=>", student);
      //Update
      if(this.edit_case_type){
        // console.log("update=>");
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0214/updateJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
            // console.log("alertMessage.error=>", alertMessage.error);
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
                confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                // confirmBox.setMessage(alertMessage.error);
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

      }else{
        //Insert
        // console.log("save=>");
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0214/saveJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
            // console.log("alertMessage.error=>", alertMessage.error);
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
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                // confirmBox.setMessage(alertMessage.error);
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
  }


  editData(index:any) {
    this.SpinnerService.show();
    this.edit_case_type  = this.posts[index]['edit_case_type'];
    this.edit_case_cate_group  = this.posts[index]['edit_case_cate_group'];
    this.edit_stat_group  = this.posts[index]['edit_stat_group'];
    this.result.case_type  = this.posts[index]['case_type'];
    this.result.stat_group  = this.posts[index]['stat_group'];
    this.result.branch_flag  = this.posts[index]['branch_flag'];
    this.result.group_name  = this.posts[index]['group_name'];
    this.result.no_edit_flag  = this.posts[index]['no_edit_flag'];
    this.result.print_type  = this.posts[index]['print_type'].toString();
    this.result.print_to  = this.posts[index]['print_to'];
    this.changeCaseType(this.edit_case_type, '');
    setTimeout(() => {
      this.SpinnerService.hide();
      this.result.case_cate_group  = this.posts[index]['case_cate_group'];
    }, 500);
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "case_type" : this.result.case_type,
        "case_cate_group" : this.result.case_cate_group,
        "stat_group" : this.result.stat_group,
        "group_name" : this.result.group_name,
        "print_type" : this.result.print_type,
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0214/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          // console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit_edit0214 = false);
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
    const confirmBox = new ConfirmBoxInitializer();
    if(!this.delValue){
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

  receiveFuncListData(event:any){
    // console.log(event)
  }

  loadMyChildComponent(){
    this.loadComponent = true;
  }

  //Delete
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
                    if(ele.edit0214 == true){
                      dataTmp.push(this.posts[index]);
                    }
                });
            });
            if(bar){
              console.log(JSON.stringify(dataTmp))
              let headers = new HttpHeaders();
              headers = headers.set('Content-Type','application/json');
              dataDel['userToken'] = this.userData.userToken;
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              console.log("data=>", data);
              this.http.post('/'+this.userData.appName+'ApiCT/API/fct0214/deleteSelect', data ).subscribe((response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                // console.log("alertMessage=>", alertMessage.result)
                if(alertMessage.result==0){
                  this.SpinnerService.hide();
                }else{
                  this.closebutton.nativeElement.click();
                  $("button[type='reset']")[0].click();
                  // this.ngOnInit();
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

  printReport(){
    var rptName = 'rct0214';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
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



}
