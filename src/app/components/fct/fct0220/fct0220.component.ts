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
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';


@Component({
  selector: 'app-fct0220,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0220.component.html',
  styleUrls: ['./fct0220.component.css']
})


export class Fct0220Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;delValue2:any;
  sessData:any;
  userData:any;
  programName:string;
  hid_case_type:any;
  hid_case_type_stat:any;
  getCaseType:any;
  selCaseType:any;
  selNumStat:any="1";
  case_type_stat_desc:any;
  order_id:any;
  case_type_stat:any;
  getDisplayColumn:any;selDisplayColumn:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fct0220',{static: true}) fct0220 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
    this.masterSelected = false,
    this.form = this.formBuilder.group({
      case_type: [''],
      case_type_stat : [''],
      case_type_stat_desc: [''],
      order_id: [''],
      display_column: [''],
      hid_case_type_stat : [''],
      hid_case_type : [''],
      xx: [''],
      xxx: [''],
    })

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[5,'asc']]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      //this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0220?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editCaseTypeStat = false);
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

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fct0220"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )
 //======================== pcase_type ======================================
 var student = JSON.stringify({
  "table_name" : "pcase_type",
  "field_id" : "case_type",
  "field_name" : "case_type_desc",
  "order_by" : "case_type ASC",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getCaseType = getDataOptions;
    console.log(getDataOptions)
    // this.selCaseType = this.getCaseType.find((o:any) => o.fieldIdValue === this.userData.defaultCaseType).fieldNameValue;
    this.selCaseType = this.getCaseType.filter((x:any) => x.fieldIdValue === this.userData.defaultCaseType)[0].fieldIdValue;
    //console.log(this.getCaseType)
    //console.log(this.userData.defaultCaseType)
    //console.log(this.selCaseType)
  },
  (error) => {}
 )
    this.getDisplayColumn = [{id: 1,text: '1'},{id: 2,text: '2'},{id: 3,text: '3'}];
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
    const ele = name;
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseTypeStat = this.masterSelected;
      }
      /*
    for (var i = 0; i < this.checklist2.length; i++) {
      this.checklist2[i].editCaseType = this.masterSelected2;
        }
        */
    this.getCheckedItemList();


  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
             return item.editCaseTypeStat == true;
       })
       /*
    this.masterSelected2 = this.checklist2.every(function(item:any) {
         return item.editCaseType == true;
       })
       */
    this.getCheckedItemList();
    // alert(this.delValue);
    // alert(this.delValue2);

  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseTypeStat = false;
    }
    /*
    for (var i = 0; i < this.checklist2.length; i++) {
      this.checklist2[i].editCaseType = false;
    }*/
    this.masterSelected = false;
    //this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    $("body").find("input[name='delValue2']").val('');
  }

  ClearAll(){
    window.location.reload();
  }

  getCheckedItemList(){
    var del = "";
    var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
          if(del2!='')
            del2+=','
          del2+=$(this).closest("td").find("input[id^='hid_case_type']").val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
        $("body").find("input[name='delValue2']").val(del2);
       })
    }, 100);
  }



  /*uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }*/

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.case_type_stat){
      confirmBox.setMessage('กรุณาระบุรหัสประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('case_type_stat');
        }
        subscription.unsubscribe();
      });

    }else if(!this.case_type_stat_desc){
      confirmBox.setMessage('กรุณาระบุประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('case_type_stat_desc');
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //if(this.case_type_stat_desc.nativeElement["default_value"].checked==true){
      //  var inputChk = 1;
      //}else{
      //  var inputChk = 0;
      //}
      var student = JSON.stringify({
        "edit_case_type_stat" : this.hid_case_type_stat,
        "edit_case_type" : this.hid_case_type,
        "case_type" : this.selCaseType,
        "case_type_stat" : this.case_type_stat,
        "case_type_stat_desc" : this.case_type_stat_desc,
        "order_id" : this.order_id,
        "display_column" : this.selDisplayColumn,
        "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_case_type_stat){
        //alert('แก้ไข')
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0220/updateJson', student , {headers:headers}).subscribe(
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
              this.ngOnInit();
              // this.form.reset();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }else{
        //alert('จัดเก็บ')
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0220/saveJson', student , {headers:headers}).subscribe(
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
              this.ngOnInit();
              // this.form.reset();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

  }


  editData(val :any,val2: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct0220/edit?edit_case_type_stat='+val+'&edit_case_type='+val2+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
      //console.log(edit)

      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
      console.log(productsJson)

      if(productsJson.result==0){
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        this.selCaseType = productsJson.data[0]['case_type'];
        this.hid_case_type_stat = productsJson.data[0]['edit_case_type_stat'];
        this.hid_case_type = productsJson.data[0]['edit_case_type'];
        this.case_type_stat = productsJson.data[0]['case_type_stat'];
        this.case_type_stat_desc = productsJson.data[0]['case_type_stat_desc'];
        this.order_id  = productsJson.data[0]['order_id'];

        if(this.getDisplayColumn.filter((x:any) => x.id === productsJson.data[0]['display_column']).length>0){
          this.selDisplayColumn = productsJson.data[0]['display_column'];
        }
        //if(productsJson.data[0]['defaultValue']){
        //  this.case_type.nativeElement["default_value"].checked=true;
        //  this.case_type.nativeElement["default_value"].checked=false;
        // }
        //  this.setFocus('case_type_stat');
      }

    });
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //if(this.case_type.nativeElement["default_value"].checked==true){
      //  var inputChk = 1;
     // }else{
     //   var inputChk = 0;
     // }
      var student = JSON.stringify({
        "case_type_stat" : this.case_type_stat,
        "case_type_stat_desc" : this.case_type_stat_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0220/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit_case_type_stat = false);
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

    this.delValue = $("body").find("input[name='delValue']").val();
    this.delValue2 = $("body").find("input[name='delValue2']").val()
    // alert(this.delValue);
    const confirmBox = new ConfirmBoxInitializer();
    if(!$("body").find("input[name='delValue']").val()){
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
    console.log(event)
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
                  console.log('/'+this.userData.appName+'ApiCT/API/fct0220/delete?delete_case_type_stat='+this.delValue+'&delete_case_type='+this.delValue2+'&userToken='+this.userData.userToken+':angular')
                  this.SpinnerService.show();
                  this.http.get('/'+this.userData.appName+'ApiCT/API/fct0220/delete?delete_case_type_stat='+this.delValue+'&delete_case_type='+this.delValue2+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
                  console.log(del);
                  this.closebutton.nativeElement.click();
                  this.ngOnInit();
                  this.SpinnerService.hide();
                });
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
    var rptName = 'rct0220';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pcase_type" : this.case_type.nativeElement["case_type"].value,
    //   "pcase_type_desc" : this.case_type.nativeElement["case_type_desc"].value
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







