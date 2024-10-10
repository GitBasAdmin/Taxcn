import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewEncapsulation ,QueryList,ViewChildren  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import {ExcelService} from '../../../services/excel.service.ts';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
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
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fkr0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkr0100.component.html',
  styleUrls: ['./fkr0100.component.css']
})

export class Fkr0100Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  getCaseType:any;
  getRedTitle:any;
  getMaterial:any;
  sessData:any;
  userData:any;
  programName:any;
  result:any = [];
  items:any = [];
  itemsTmp:any = [];
  myExtObject: any;
  modalType:any;
  modalIndex:any;
  
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public masterSelBurn:boolean = false;
  public masterSelBurn2:boolean = false;
  public masterSelBurn3:boolean = false;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalListComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren('jcalendar') jcalendar: QueryList<ElementRef>;
  @ViewChildren('icalendar') icalendar: QueryList<ElementRef>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('sRedTitle') sAmphur : NgSelectComponent;
  @ViewChildren('attachFile') attachFile: QueryList<ElementRef>;
  @ViewChildren('masterBurn2') masterBurn2: QueryList<ElementRef>;
  @ViewChildren('flag_burn') flag_burn: QueryList<ElementRef>;
  @ViewChildren('message') message: QueryList<ElementRef>;
  
  

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy:true
    };
    
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
      },
      (error) => {}
    )
    //======================== pmaterial_title ======================================
    var student = JSON.stringify({
      "table_name" : "pmaterial_title",
      "field_id" : "case_title",
      "field_name" : "case_title",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getMaterial = getDataOptions;
      },
      (error) => {}
    )
      this.successHttp();
     
  }

  setDefPage(){
    this.result = [];
    this.result.cond_sel = 1;
    this.result.find_type = 1;
    this.result.case_type = this.userData.defaultCaseType;
    this.changeCaseType(this.result.case_type,1);
    this.result.title = this.userData.defaultRedTitle;
    this.result.burn_date = myExtObject.curDate();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkr0100"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
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
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }
  ngAfterContentInit(): void{
    this.setDefPage();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  callCalendarSet(){
    myExtObject.callCalendar();
  }

  assignUser(event:any){
    if(event==true){
      this.result.user_id = this.userData.userCode;
      this.result.user_name = this.userData.offName;
    }else{
       this.result.user_id =  this.result.user_name = '';
    }
  }

  condSel(type:any,name:any,checked:any){
    if(type==1){
      if(name=='cond_sel' && checked==true){
        this.result.cond_sel = 1;
        this.result.cond_sel2 = null;
      }else if(name=='cond_sel2' && checked==true){
        this.result.cond_sel = null;
        this.result.cond_sel2 = 1;
      }
    }
    if(type==2){
      if(name=='cond_sel3' && checked==true){
        this.result.cond_sel3 = 1;
        this.result.cond_sel4 = null;
      }else if(name=='cond_sel4' && checked==true){
        this.result.cond_sel3 = null;
        this.result.cond_sel4 = 1;
      }
    }
  }

  changeCaseType(caseType:any,type:any){
    //this.result.title = null;
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getRedTitle = getDataOptions;
        console.log(this.getRedTitle)
        if(type==2){
          if(caseType==1)
            this.result.title = this.getRedTitle[0].fieldIdValue;
          else
            this.result.title = this.userData.defaultRedTitle;
        }
      },
      (error) => {}
    )
  }

  onFileChange(e:any,type:any) {
    if(e.target.files.length){
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      $(e.target).parent('div').find('label').html('');
    }
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }
  directiveDateObj(index:any,obj:any){
    this.items[index][obj] = this.jcalendar.get(index).nativeElement.value;
  }

  searchData(){
    if(!this.result.user_id){
      if(!this.result.fine_date){
        if(!this.result.red_id1 || !this.result.red_id2){
          if(!this.result.case_title && !this.result.case_id && !this.result.case_yy){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ป้อนเลขคดีแดงหรือเลขที่เอกสารแยกเก็บ');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.searchDataCommit();
          }
        }else{
          this.searchDataCommit();
        }
      }else{
        this.searchDataCommit();
      }
    }else{
      this.searchDataCommit();
    }
  }
 
  searchDataCommit(){

    var data = $.extend({},this.result);
    delete data.burn_date;
    delete data.chk_off;
    if(!data.find_date || !data.find_date2){
      delete data.find_type;
      delete data.find_date;
      delete data.find_date2;
    }
    if(data.cond_sel==false || !data.cond_sel)
      delete data.cond_sel;
    else
      data.cond_sel= 1;
    if(data.cond_sel2==false || !data.cond_sel2)
      delete data.cond_sel2;
    else
      data.cond_sel2= 1;
    if(data.cond_sel3==false || !data.cond_sel3)
      delete data.cond_sel3;
    else
      data.cond_sel3= 1;
    if(data.cond_sel4==false || !data.cond_sel4)
      delete data.cond_sel4;
    else
      data.cond_sel4= 1;
    data.userToken = this.userData.userToken;
    console.log(data)
      this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0100/searchData',data).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.masterSelBurn = this.masterSelBurn2 = this.masterSelBurn3 = false;
          this.masterBurn2['_results'][0].nativeElement.disabled=false;
          if(getDataOptions.result==1){
              //-----------------------------//
                this.items = getDataOptions.data;
                var bar = new Promise((resolve, reject) => {
                this.items.forEach((x : any ) => x.flag_cancel_burn = x.flag_burn = x.doc_burn_flag = false);
                });
                if(bar){
                  this.itemsTmp = JSON.parse(JSON.stringify(this.items));
                  this.rerender();
                  setTimeout(() => {
                    this.callCalendarSet();
                  }, 500);
                }
                
              //-----------------------------//
          }else{
            this.items = this.itemsTmp = [];
            this.rerender();
            //-----------------------------//
            /*
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){

                }
                subscription.unsubscribe();
              });
              */
            //-----------------------------//
          }

        },
        (error) => {}
      )
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
          "password" : chkForm.password,
          "log_remark" : chkForm.log_remark,
          "userToken" : this.userData.userToken
        });

        this.http.post('/'+this.userData.appName+'Api/API/checkReceiptPassword', student ).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
            if(productsJson.result==1){
              this.closebutton.nativeElement.click();
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
    if(this.modalType==1){
      this.result.user_id = event.fieldIdValue;
      this.result.user_name = event.fieldNameValue;
    }else if(this.modalType==2){
      this.items[this.modalIndex].message_id = event.fieldIdValue;
      this.items[this.modalIndex].message = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }
  closeModal(){
    this.loadModalListComponent = false;
    this.loadModalConfComponent = false;
  }
  clickOpenMyModalComponentIndex(type:any,index:any){
    this.modalType = type;
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }
  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent(){
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
        "userToken" : this.userData.userToken
      });
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldCond="";
      console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
              this.list = response;
              this.loadModalListComponent = true;
              this.loadModalConfComponent = false;
          },
          (error) => {}
        )
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","650px");
      if(this.items[this.modalIndex].chk_burn){
        var student = JSON.stringify({
          "table_name" : "prea_burn",
            "field_id" : "burn_id",
            "field_name" : "burn_desc",
            "condition" : "AND burn_type='1'",
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "table_name" : "prea_burn",
            "field_id" : "burn_id",
            "field_name" : "burn_desc",
            "condition" : "AND burn_type='2'",
          "userToken" : this.userData.userToken
        });
      }
      this.listTable='prea_burn';
      this.listFieldId='burn_id';
      this.listFieldName='burn_desc';
      if(this.items[this.modalIndex].chk_burn){
        this.listFieldCond="AND burn_type='1'";
      }else{
        this.listFieldCond="AND burn_type='2'";
      }
      console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
              this.list = response;
              this.loadModalListComponent = true;
              this.loadModalConfComponent = false;
          },
          (error) => {}
        )
    }
  }

  checkUncheckAll(obj:any,master:any,child:any,checked:any) {
    if(checked==true){
      var dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
                dataTmp.push({'run_id':this.items[index].run_id});
          });
      });
      if(bar){
        var data = [];
        data['data'] = dataTmp;
        data['userToken'] = this.userData.userToken;
        var dataSend = $.extend({}, data);
        console.log(dataSend)
        this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0100/getJudgeAppointDate',dataSend).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              for (var i = 0; i < obj.length; i++) {
                obj[i][child] = this[master];
                if(this[master]==true && child=='flag_cancel_burn'){
                  this.flag_burn['_results'][i].nativeElement.checked=false;
                  this.flag_burn['_results'][i].nativeElement.disabled=true;
                  this.jcalendar['_results'][i].nativeElement.value='';
                  this.jcalendar['_results'][i].nativeElement.disabled=true;
                  this.icalendar['_results'][i].nativeElement.style.display='none';
                  this.items[i].message_id = getDataOptions.data[i].message_id;
                  this.items[i].message = getDataOptions.data[i].message;
                  this.message['_results'][i].nativeElement.removeAttribute('readonly');
                }else if(this[master]==false && child=='flag_cancel_burn'){
                  this.flag_burn['_results'][i].nativeElement.disabled=false;
                  this.jcalendar['_results'][i].nativeElement.disabled=false;
                  this.icalendar['_results'][i].nativeElement.style.display='';
                  this.items[i].message_id = this.itemsTmp[i].message_id;
                  this.items[i].message = this.itemsTmp[i].message;
                }
          
                if(this[master]==true && child=='flag_burn'){
                  //this.jcalendar['_results'][i].nativeElement.value=this.result.burn_date?this.result.burn_date:myExtObject.curDate();
                  this.items[i].bdate = this.result.burn_date?this.result.burn_date:myExtObject.curDate();
                }else if(this[master]==false && child=='flag_burn'){
                  //this.jcalendar['_results'][i].nativeElement.value='';
                  this.items[i].bdate = '';
                }
                //console.log(this.flag_burn['_results'][i])
              }
            }else{
              const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){

                  }
                  subscription.unsubscribe();
                });
            }

          },
          (error) => {}
        )
      }
    }else{
      this.items.forEach((ele, index, array) => {

          obj[index][child] = this[master];
          this.flag_burn['_results'][index].nativeElement.disabled=false;
          this.jcalendar['_results'][index].nativeElement.disabled=false;
          this.icalendar['_results'][index].nativeElement.style.display='';
          this.items[index].message_id = this.itemsTmp[index].message_id?this.itemsTmp[index].message_id:null;
          this.items[index].message = this.itemsTmp[index].message?this.itemsTmp[index].message:null;

        this.message['_results'][index].nativeElement.setAttribute('readonly', true);
      });
    }

    if(this[master]==true && child=='flag_cancel_burn'){
      this.masterBurn2['_results'][0].nativeElement.checked=false;
      this.masterBurn2['_results'][0].nativeElement.disabled=true;
    }else if(this[master]==false && child=='flag_cancel_burn'){
      this.masterBurn2['_results'][0].nativeElement.disabled=false;
    } 
    
  }

  isAllSelected(obj:any,master:any,child:any,i:any,checked:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    if(child=='flag_cancel_burn'){
      if(checked==true){
        var data = [];
        data['data'] = [{'run_id':this.items[i].run_id}];
        data['userToken'] = this.userData.userToken;
        var dataSend = $.extend({}, data);
        console.log(dataSend)
        this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0100/getJudgeAppointDate',dataSend).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              this.items[i].message_id = getDataOptions.data[0].message_id;
              this.items[i].message = getDataOptions.data[0].message;
              this.message['_results'][i].nativeElement.removeAttribute('readonly');
            }else{
              const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){

                  }
                  subscription.unsubscribe();
                });
            }

          },
          (error) => {}
        )
      }else{
        this.items[i].message_id = null;
        this.items[i].message = null;
        this.message['_results'][i].nativeElement.setAttribute('readonly', true);
      }
    }
  }

  checkSelected(i:any,checked:any){
    if(checked==true){
      this.flag_burn['_results'][i].nativeElement.checked=false;
      this.flag_burn['_results'][i].nativeElement.disabled=true;
      this.jcalendar['_results'][i].nativeElement.value='';
      this.jcalendar['_results'][i].nativeElement.disabled=true;
      this.icalendar['_results'][i].nativeElement.style.display='none';
      this.items[i].message_id = null;
      this.items[i].message = '';
    }else{
      this.flag_burn['_results'][i].nativeElement.disabled=false;
      this.jcalendar['_results'][i].nativeElement.disabled=false;
      this.icalendar['_results'][i].nativeElement.style.display='';
      this.items[i].message_id = this.itemsTmp[i].message_id;
      this.items[i].message = this.itemsTmp[i].message;
    }
  }

  checkSelected2(i:any,checked:any){
    if(checked==true){
      //this.jcalendar['_results'][i].nativeElement.value=this.result.burn_date?this.result.burn_date:myExtObject.curDate();
      this.items[i].bdate = this.result.burn_date?this.result.burn_date:myExtObject.curDate();
    }else{
      this.items[i].bdate = '';
    }
  }

  tabChangeInputIndex(index:any,event:any){
    if(this.items[index].chk_burn){
      var student = JSON.stringify({
        "table_name" : "prea_burn",
         "field_id" : "burn_id",
         "field_name" : "burn_desc",
         "condition" : " AND burn_type='1' AND burn_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });   
    }else{
      var student = JSON.stringify({
        "table_name" : "prea_burn",
         "field_id" : "burn_id",
         "field_name" : "burn_desc",
         "condition" : " AND burn_type='2' AND burn_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });   
    }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.items[index]['message'] = productsJson[0].fieldNameValue;
        }else{
          this.items[index]['message_id'] = null;
          this.items[index]['message'] = '';
        }
        },
        (error) => {}
      )
  }

  tabChangeInput(event:any){
    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name" : "pofficer",
         "field_id" : "off_id",
         "field_name" : "off_name",
         "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });   
    }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
         let productsJson : any = JSON.parse(JSON.stringify(response));

         if(productsJson.length){
           this.result.user_id = productsJson[0].fieldNameValue;
         }else{
           this.result.user_id = null;
           this.result.user_name = '';
         }
        },
        (error) => {}
      )
  }

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.items.length){
      confirmBox.setMessage('กรุณาค้นหาข้อมูลก่อนการจัดเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.hide();}
        subscription.unsubscribe();
      });
    }else{
    
      var formData = new FormData();
      this.attachFile.forEach((r,index,array)  =>  {
        //console.log(r)
        if(r.nativeElement.files.length){
          formData.append('attach_'+index, r.nativeElement.files[0]);
        }else{
          formData.append('attach_'+index, null);
        }
      })
      var dataObj:any = [];
      var bar = new Promise((resolve, reject) => {
        for(var i=0;i<this.items.length;i++){
            if(this.items[i].flag_cancel_burn==true){
              this.items[i].flag_cancel_burn = 1;
              this.items[i].flag_burn = null;
              //this.items[i].message_id = null;
              //this.items[i].message = '';
            }else 
              this.items[i].flag_cancel_burn = null;

            if(this.items[i].flag_burn==true){
              this.items[i].flag_burn = 1;
              this.items[i].flag_cancel_burn = null;
            }else 
              this.items[i].flag_burn = null;

            if(this.items[i].doc_burn_flag==true)
              this.items[i].doc_burn_flag = 1;
            else 
              this.items[i].doc_burn_flag = null;
            dataObj.push($.extend({}, this.items[i]))
            
        }
      });
      
      if(bar){
        //console.log(JSON.stringify(dataObj))
        formData.append('data', JSON.stringify(dataObj));
        formData.append('userToken', this.userData.userToken);
      }
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }

      this.http.disableHeader().post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0100/saveData', formData ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.searchData();
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
      
    }
  }

  openFiles(index:any){
    var last = this.items[index].attachment.split('.').pop().toLowerCase();
    let winURL = window.location.host;
    if(last!='pdf'){
      var api = '/'+this.userData.appName+"ApiKR/API/KEEPR/fkr0100/openAttach";
      console.log("http://"+winURL+api+'?red_running='+this.items[index].red_running+'&file_name='+this.items[index].attachment)
      myExtObject.OpenWindowMax("http://"+winURL+api+'?red_running='+this.items[index].red_running+'&file_name='+this.items[index].attachment);
    }else{
      var api = '/'+this.userData.appName+"ApiKR/API/KEEPR/fkr0100/openPdf";
      console.log("http://"+winURL+api+'?red_running='+this.items[index].red_running+'&file_name='+this.items[index].attachment)
      myExtObject.OpenWindowMax("http://"+winURL+api+'?red_running='+this.items[index].red_running+'&file_name='+this.items[index].attachment);
    }
  }

  exportAsXLSX(): void {
    if(this.items){
      var excel =  JSON.parse(JSON.stringify(this.items));
      console.log(excel)
      var data = [];var extend = [];
      var bar = new Promise((resolve, reject) => {
        
        for(var i = 0; i < excel.length; i++){
          if(excel[i]['chk_burn']==1)
            excel[i]['chk_burn'] = 'ปลดเผาแล้ว';  
          else
            excel[i]['chk_burn'] = '';
          if(excel[i]['chk_doc_burn']==1)
            excel[i]['chk_doc_burn'] = 'ปลดเผาเอกสารแล้ว';  
          else
            excel[i]['chk_doc_burn'] = '';
          for(var x=0;x<10;x++){
            if(x==0)
              data.push(excel[i]['chk_burn']);
            if(x==1)
              data.push(excel[i]['chk_doc_burn']);
            if(x==2)
              data.push(excel[i]['case_no']);   
            if(x==3)
              data.push(excel[i]['red_no']);
            if(x==4)
              data.push(excel[i]['matt_case_no']);
            if(x==5)
              data.push(excel[i]['judging_date']);
            if(x==6)
              data.push(excel[i]['end_casedate']);
            if(x==7)
              data.push(excel[i]['bdate']);
            if(x==8)
              data.push(excel[i]['attachment']);
            if(x==9)
              data.push(excel[i]['message']);
            
          }
        
          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if(bar){
        var objExcel = [];
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel,'fkr0100' ,this.programName);
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
}







