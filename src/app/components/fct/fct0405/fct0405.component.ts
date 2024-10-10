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
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-fct0405,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0405.component.html',
  styleUrls: ['./fct0405.component.css']
})


export class Fct0405Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any = "std_judge_result_name";
  public listFieldNull:any;
  posts:any;
  search:any;
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;
  delValue2:any;
  sessData:any;
  userData:any;
  programName:string;
  selectedCasetype:number;
  getResultStat:any;
  getResultYearStat:any;
  getConStatId:any;
  getCaseType:any;
  selResultStat:any;
  selResultYearStat:any;
  selConStatId:any;
  selCaseType:any;
  selectedData:any='------------เลือก------------';
  selData:any;
  selectedData2:any='------------เลือก------------';
  selData2:any;
  selectedData3:any='------------เลือก------------';
  selData3:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('result_id',{static: true}) result_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('myselect') myselect : NgSelectComponent;
  @ViewChild('myselect2') myselect2 : NgSelectComponent;
  @ViewChild('myselect3') myselect3 : NgSelectComponent;
  @ViewChild('sCaseTypeId') sCaseTypeId : NgSelectComponent;
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
      order:[[2,'asc']]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0405?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editResultId = false);
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
        "url_name" : "fct0405"
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

    this.getResultStat = [{id:0,text:'---------------เลือก---------------'},
                    {id: 1,text: '1.พิพากษาความเรียง'},
                    {id: 2,text: '2.รับสารภาพสืบประกอบ'},
                    {id: 3,text: '3.รับสารภาพ'},
                    {id: 4,text: '4.ประนีประนอมพิพากษาตามยอม)'},
                    {id: 5,text: '5.ถอนฟ้องคำร้อง'},
                    {id: 6,text: '6.จำหน่ายคดี(ชั่วคราว)'},
                    {id: 7,text: '7.จำหน่ายคดี(อื่นๆ)'},
                    {id: 8,text: '8.โดยเหตุอื่น'}
                  ];
    this.getResultYearStat = [{id:0,text:'----------------------เลือก----------------------'},
                  {id: 1,text: '1.พิพากษาใหโจทก์ชนะ(อาญา)/พิพากษาใหโจทก์ชนะ(แพ่ง)'},
                  {id: 2,text: '2.พิพากษาจำเลยชนะยกคำร้อง(อาญา)/จำเลยชนะยกคำร้อง(แพ่ง)'},
                  {id: 3,text: '3.ยอมความ(อาญา)/ประนีประนอมพิพากษาตามยอม(แพ่ง)'},
                  {id: 4,text: '4.ถอนฟ้อง(อาญา)/ถอนฟ้องถอนคำร้องขอ(แพ่ง)'},
                  {id: 5,text: '5.จำหน่ายคดี(ชั่วคราว)(อาญา)/จำหน่ายคดี(ชั่วคราว)(แพ่ง)'},
                  {id: 6,text: '6.จำหน่ายคดี(อื่นๆ)(อาญา)/จำหน่ายคดี(อื่นๆ)(แพ่ง)'},
                  {id: 7,text: '7.โดยเหตุอื่นๆ(อาญา)/โดยเหตุอื่นๆ(แพ่ง)'}
                 ];
    this.getConStatId = [{id:0,text:'----------เลือก----------'},
                 {id: 1,text: 'จำหน่ายคดี'},
                 {id: 2,text: 'สำเร็จ'},
                 {id: 3,text: 'ไม่สำเร็จ'}
               ];

    var student = JSON.stringify({
                "table_name" : "std_pjudge_result",
                "field_id" : "std_id",
                "field_name" : "std_code",
                "field_name2" : "std_judge_result_name",
                "search_id" : "","search_desc" : "",
                "userToken" : this.userData.userToken
              });
            this.listTable='std_pjudge_result';
            this.listFieldId='std_id';
            this.listFieldName='std_code';
            this.listFieldName2='std_judge_result_name';
            this.listFieldNull='';
          //console.log(student)

           this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student , {headers:headers}).subscribe(
               (response) =>{
                 this.list = response;
                 //console.log(response)
               },
               (error) => {}
             )

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
    const ele = this.result_id.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editAddOrderId = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.editAddOrderId == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editAddOrderId = false;
    }
    for (var i = 0; i < this.checklist2.length; i++) {
      this.checklist2[i].editAddOrderId = false;
    }
    this.masterSelected = false;
    this.masterSelected2 = false;
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
          //alert(del2);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
        $("body").find("input[name='delValue2']").val(del2);
       })
    }, 100);
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
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

    if(!this.result_id.nativeElement["result_id"].value){
      confirmBox.setMessage('กรุณาระบุรหัสผลคำพิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('result_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result_id.nativeElement["result_desc"].value){
      confirmBox.setMessage('กรุณาระบุผลคำพิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('result_desc');
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.result_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "result_id" : this.result_id.nativeElement["result_id"].value,
        "edit_result_id" : this.result_id.nativeElement["hid_result_id"].value,
        "case_type" : this.selCaseType,
        "result_stat" : this.selResultStat,
        "result_year_stat" : this.selResultYearStat,
        "con_stat_id" : this.selConStatId,
        "edit_case_type" : this.result_id.nativeElement["hid_case_type"].value,
        "result_desc" : this.result_id.nativeElement["result_desc"].value,
        "std_id" : this.result_id.nativeElement["std_id"].value,
        "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.result_id.nativeElement["hid_result_id"].value){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0405/updateJson', student , {headers:headers}).subscribe(
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
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }else{
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0405/saveJson', student , {headers:headers}).subscribe(
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
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

  }


  editData(val :any, val2:any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    //console.log('/'+this.userData.appName+'ApiCT/API/fct0405/edit?edit_result_id='+val+'&userToken='+this.userData.userToken+':angular')
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct0405/edit?edit_result_id='+val+'&edit_case_type='+val2+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
      //console.log(edit)
      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
      //console.log(productsJson)
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
        this.renderer.setProperty(this.result_id.nativeElement['hid_result_id'],'value', productsJson.data[0]['edit_result_id']);
        this.renderer.setProperty(this.result_id.nativeElement['hid_case_type'],'value', productsJson.data[0]['edit_case_type']);
        this.renderer.setProperty(this.result_id.nativeElement['result_id'],'value', productsJson.data[0]['result_id']);
        this.renderer.setProperty(this.result_id.nativeElement['result_desc'],'value', productsJson.data[0]['result_desc']);
        this.renderer.setProperty(this.result_id.nativeElement['std_id'],'value', productsJson.data[0]['std_id']);
        if(productsJson.data[0]['std_id'] > 0){
          this.renderer.setProperty(this.result_id.nativeElement['std_judge_result_name'],'value', this.list.find((x:any) => x.fieldIdValue === productsJson.data[0]['std_id']).fieldNameValue2);
        }else{
          this.renderer.setProperty(this.result_id.nativeElement['std_judge_result_name'],'value','');
        }

        this.selCaseType = productsJson.data[0]['case_type'];
        this.selResultStat = productsJson.data[0]['result_stat'];
        this.selResultYearStat = productsJson.data[0]['result_year_stat'];
        this.selConStatId = productsJson.data[0]['con_stat_id'];

      //  if(this.getResultStat.filter((x:any) => x.id === productsJson.data[0]['result_stat']).length>0){
      //     this.selResultStat = productsJson.data[0]['result_stat'];
      //  }

      //  if(this.getResultYearStat.filter((x:any) => x.id === productsJson.data[0]['result_year_stat']).length>0){
      //   this.selResultYearStat = productsJson.data[0]['result_year_stat'];
      //  }

      //  if(this.getConStatId.filter((x:any) => x.id === productsJson.data[0]['con_stat_id']).length>0){
      //   this.selConStatId = productsJson.data[0]['con_stat_id'];
      //  }


        // var sel = this.selData;
        // for (var x = 0; x < sel.length; x++) {
        //   if(sel[x].id == productsJson.data[0]['result_stat']){
        //     this.myselect.select(this.myselect.itemsList.findByLabel(this.selData[x].text));
        //   }
        // }
        // var sel2 = this.selData2;
        // for (var x = 0; x < sel2.length; x++) {
        //   if(sel2[x].id == productsJson.data[0]['result_year_stat']){
        //     this.myselect2.select(this.myselect2.itemsList.findByLabel(this.selData2[x].text));
        //   }
        // }


        // var sel3 = this.selData3;
        // for (var x = 0; x < sel3.length; x++) {
        //   if(sel3[x].id == productsJson.data[0]['con_stat_id']){
        //       this.myselect3.select(this.myselect3.itemsList.findByLabel(this.selData3[x].text));
        //   }else if(productsJson.data[0]['con_stat_id'] == null) {
        //        this.myselect3.clearModel();
        //   }
        // }

        // var sel4 = this.getCaseType;
        // for (var x = 0; x < sel4.length; x++) {
        //   if(sel4[x].fieldIdValue == productsJson.data[0]['case_type']){
        //       this.sCaseTypeId.select(this.sCaseTypeId.itemsList.findByLabel(this.getCaseType[x].fieldNameValue));
        //   }
        // }
        // if(productsJson.data[0]['default_value']){
        //   this.result_id.nativeElement["default_value"].checked=true;
        // }else{
        //   this.result_id.nativeElement["default_value"].checked=false;
        // }
        this.setFocus('result_id');
      }

    });
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.result_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        // "result_id" : this.result_id.nativeElement["result_id"].value,
        "result_desc" : this.result_id.nativeElement["result_desc"].value,
        "std_id" : this.result_id.nativeElement["std_id"].value,
        "case_type" : this.selCaseType,
        "result_stat" : this.selResultStat,
        "result_year_stat" : this.selResultYearStat,
        "con_stat_id" : this.selConStatId,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0405/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.editResultId = false);
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
    this.delValue2 = $("body").find("input[name='delValue2']").val();
    // alert(this.delValue+'xxx'+this.delValue2)
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
    console.log(event)
        this.result_id.nativeElement[this.listFieldId].value=event.fieldIdValue;
        this.result_id.nativeElement[this.listFieldName2].value=event.fieldNameValue2;
        this.closebutton.nativeElement.click();
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
            this.delValue = $("body").find("input[name='delValue']").val();
            this.delValue2 = $("body").find("input[name='delValue2']").val();
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.SpinnerService.show();
                  this.http.get('/'+this.userData.appName+'ApiCT/API/fct0405/delete?delete_result_id='+this.delValue+'&delete_case_type='+this.delValue2+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
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


  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

 tabChange(obj:any){
   if(obj.target.value){
     this.renderer.setProperty(this.result_id.nativeElement['std_judge_result_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue2);
   }else{
     this.result_id.nativeElement['std_id'].value="";
     this.result_id.nativeElement['std_judge_result_name'].value="";
   }
 }

  printReport(){
    var rptName = 'rct0405';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "presult_id" : this.result_id.nativeElement["result_id"].value,
    //   "presult_desc" : this.result_id.nativeElement["result_desc"].value
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







