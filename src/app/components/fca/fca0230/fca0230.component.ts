import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
// import { NgInputFileComponent, GoogleApiConfig, GoogleDriveService } from 'ng-input-file';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import {
  CanActivateFn, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError,Routes
} from '@angular/router';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ArrayType } from '@angular/compiler';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
interface Request {
  attach_date: string,
  attach_type_id: number,
  attach_type_name: string,
  sub_type_id: string,
  sub_type_name: string,
  file_desc: string,
  seq:number,
  file_name: string
}
interface Request2 {
  approve_date: string,
  approve_name: string,
  attach_date: string,
  doc_type_id: number,
  doc_type_name: string,
  file_name: string,
  file_size: number,
  file_type: string,
  input_file_type: string,
  issue: number,
  owner_name: string,
  owner_type: string,
  pages: number,
  ref_no: string
}
@Component({
  selector: 'app-fca0230,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca0230.component.html',
  styleUrls: ['./fca0230.component.css']
})


export class Fca0230Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
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
  dataHead:any = [];
  dataSearch:any = [];
  dataSearch2:any = [];
  rawFile:any = [];
  myExtObject: any;

  getAttachType:any;
  selAttachType:any;
  getAttachSubType:any;
  getAttachSubTypeOriginal:any;
  getAttachSubTypeSingle:any;
  selAttachSubType:any;
  selCurDate:any;
  delIndex:any;
  runId:any;
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  getDataFile$: Observable<Request[]>;
  getDataFile2$: Observable<Request2[]>;

  public loadComponent: boolean = false;
  public loadConfirmComponent: boolean = false;
  
 
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChildren('file1') file1: QueryList<ElementRef>;
  @ViewChild('atthSubType2') atthSubType2: NgSelectComponent;
  @ViewChildren('atthSubType') atthSubTypes: QueryList<NgSelectComponent>;
  @ViewChildren('jcalendar') jcalendar: QueryList<ElementRef>;
  @ViewChildren('attachFile') attachFile: QueryList<ElementRef>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    public SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      lengthChange : false,
      info : false,
      paging : false,
      order : [[0,'asc']],
      searching : false,
      destroy:true
    };
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      lengthChange : false,
      info : false,
      paging : false,
      order : [],
      searching : false,
      destroy:true
    };
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dataSearch = [];
    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = this.dataHead.run_id = params['run_id'];
      if(this.runId>0){
        this.searchData();
      }
    });

    this.getAttachSubType = new Array();
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //======================== pattach_type ======================================
      var student = JSON.stringify({
        "table_name" : "pattach_type",
        "field_id" : "attach_type_id",
        "field_name" : "attach_type_name",
        "order_by": " order_no ASC",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          
          this.getAttachType = getDataOptions;
          this.rawFile.attach_type_id = 1;
          //this.changeAttachType2(1);
        },
        (error) => {}
      )
      //======================== pattach_sub_type ======================================
      
      var student = JSON.stringify({
        "table_name" : "pattach_sub_type",
        "field_id" : "sub_type_id",
        "field_name" : "sub_type_name",
        "field_name2" : "attach_type_id",
        "order_by": " sub_type_id ASC",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getAttachSubTypeOriginal = getDataOptions;
          this.getAttachSubTypeSingle = getDataOptions;
          console.log(this.getAttachSubTypeOriginal)
          this.changeAttachType2(1);
          //this.selAttachSubType = this.getAttachSubType[0].fieldNameValue;
        },
        (error) => {}
      )
        this.rawFile.attach_date = myExtObject.curDate();  
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0230"
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
    /*
    this.file1.changes.subscribe((r) => {
      console.log(r._results)
    });
    */
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
    if(this.dataHead.buttonSearch==1){//เมื่อมีการค้นจากหน้าจอ
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      setTimeout(() => {
        this.searchData();
        this.SpinnerService.show();
      }, 1000);
    } 
  }
  
  onFileChange(e:any,type:any) {
    if(e.target.files.length){
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      $(e.target).parent('div').find('label').html('');
    }
  }

  searchData(){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      
      console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/getAttachData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            
            if(productsJson.result == 1 && productsJson.data.length){
              //console.log(this.getAttachSubTypeOriginal)
              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {
                  var valObj = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === ele.attach_type_id);
                  
                  if(valObj.length)
                    this.getAttachSubType[index] = valObj;
                  else
                    this.getAttachSubType[index] = [];
                  /*
                  var student = JSON.stringify({
                    "table_name" : "pattach_sub_type",
                    "field_id" : "sub_type_id",
                    "field_name" : "sub_type_name",
                    "condition" : " AND attach_type_id='"+ele.attach_type_id+"'",
                    "order_by": " sub_type_id ASC",
                    "userToken" : this.userData.userToken
                  });
                  console.log(student)
                  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
                    (response) =>{
                      let getDataOptions : any = JSON.parse(JSON.stringify(response));
                        console.log(getDataOptions)
                        if(getDataOptions.length){
                          this.getAttachSubType[index] = getDataOptions;
                        }else{
                          this.getAttachSubType[index] = [];
                        }
                        
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                    */
                });
              });
              if(bar){
                //this.getDataFile$ = of(productsJson.data);
                this.dataSearch = productsJson.data;
                console.log(this.dataSearch)
                this.rerender();
                this.searchData2();
                setTimeout(() => {
                  this.ngAfterContentInit();
                }, 500);
                //this.SpinnerService.hide();
              }
              
              
            }else{
              //this.getDataFile$ = of();
              this.dataSearch = [];
              this.rerender();
              this.searchData2();
              setTimeout(() => {
                this.ngAfterContentInit();
              }, 500);
              //this.SpinnerService.hide();
              
            }
          },
          (error) => {}
        )
  }

  searchData2(){
    //this.SpinnerService.show();
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/getDittoData', student ).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.result == 1 && productsJson.data[0].file_list.length){
          //console.log(this.getAttachSubTypeOriginal)
          var bar = new Promise((resolve, reject) => {
            /*
            productsJson.data.forEach((ele, index, array) => {
              var valObj = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === ele.attach_type_id);
              //console.log(ele.sub_type_id)
              if(valObj.length)
                this.getAttachSubType[index] = valObj;
              else
                this.getAttachSubType[index] = [];

            });
            */
          });
          if(bar){
            //this.getDataFile2$ = of(productsJson.data[0].file_list);
            this.dataSearch2 = productsJson.data[0].file_list;
            //console.log('dataSearch2',this.dataSearch2);
            this.rerender();
            this.SpinnerService.hide();
          }
          
          
        }else{
          //this.getDataFile2$ = of();
          this.dataSearch2 = [];
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {}
    )
  }

  directiveDateObj(index:any,obj:any){
    this.dataSearch[index][obj] = this.jcalendar.get(index).nativeElement.value;
  }
  directiveDate(date:any,obj:any){
    this.rawFile[obj] = date;
  }

  assignRow(){
    //console.log(this.rawFile)
    if(this.dataHead.run_id){
      var valObjMain = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === this.rawFile.attach_type_id)
      var valObj = valObjMain.filter((x:any) => x.fieldIdValue === this.rawFile.sub_type_id);
      if(valObj.length)
        this.rawFile.file_desc = valObj[0].fieldNameValue;
      this.rawFile.run_id = this.dataHead.run_id;
      var rawFile = $.extend({},this.rawFile)
      console.log(rawFile)
      this.dataSearch.push(rawFile);
      console.log(this.dataSearch)
      this.getDataFile$ = of(this.dataSearch);
      var valObjNew = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === this.rawFile.attach_type_id);
      this.getAttachSubType[this.dataSearch.length-1] = valObjNew;
      this.rerender();
      this.changeAttachType2(1);
      this.rawFile = {attach_date:myExtObject.curDate(),attach_type_id:1,sub_type_id:'',file_desc:''};
    }
  }

  changeSubType(event:any,index:any){
    var valObjMain = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === this.dataSearch[index].attach_type_id)
    var valObj = valObjMain.filter((x:any) => x.fieldIdValue === event);
    console.log(valObj)
    if(valObj.length)
      this.dataSearch[index].file_desc = valObj[0].fieldNameValue;
    else
      this.dataSearch[index].file_desc = '';
    
  }

  changeAttachType(val:any,index:any){
    var items = index;
    var student = JSON.stringify({
      "table_name" : "pattach_sub_type",
      "field_id" : "sub_type_id",
      "field_name" : "sub_type_name",
      "condition" : " AND attach_type_id='"+val+"'",
      "order_by": " sub_type_id ASC",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        
        this.getAttachSubType[items] = getDataOptions;
        this.atthSubTypes.forEach((r,index,array)  =>  {
          if(index==items){
            r.handleClearClick();
            r.items = this.getAttachSubType[index];
          }
        })
          //this.selAttachSubType = this.getAttachSubType[0].fieldNameValue;
      },
      (error) => {}
    )
  }

  changeAttachType2(val:any){
    var valObj = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === val);
    console.log(valObj)
    this.getAttachSubTypeSingle = valObj;
    setTimeout(() => {
      this.rawFile.sub_type_id = null;
    }, 200);
    
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
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

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
        for(var i=0;i<this.dataSearch.length;i++){
          /*
          if(i==0)
            dataStringify = JSON.stringify(this.dataSearch[i]);
          else
            dataStringify = dataStringify+','+JSON.stringify(this.dataSearch[i]);
          */
            dataObj.push($.extend({}, this.dataSearch[i]))
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
      
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/saveAttachData', formData ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.searchData();
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
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
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
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

  clickOpenFile(index:any,type:any){
    var last = this.dataSearch[index].file_name.split('.').pop().toLowerCase();
    let winURL = window.location.host;
    if(last!='pdf'){
      var api = '/'+this.userData.appName+"ApiCA/API/CASE/fca0230/openAttach";
      console.log("http://"+winURL+api+'?run_id='+this.dataSearch[index].run_id+'&file_name='+this.dataSearch[index].file_name)
      myExtObject.OpenWindowMax("http://"+winURL+api+'?run_id='+this.dataSearch[index].run_id+'&file_name='+this.dataSearch[index].file_name);
    }else{
      var api = '/'+this.userData.appName+"ApiCA/API/CASE/fca0230/openPdf";
      console.log("http://"+winURL+api+'?run_id='+this.dataSearch[index].run_id+'&file_name='+this.dataSearch[index].file_name)
      myExtObject.OpenWindowMax("http://"+winURL+api+'?run_id='+this.dataSearch[index].run_id+'&file_name='+this.dataSearch[index].file_name);
    }
}

clickOpenFile2(index:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var student = JSON.stringify({
    "ref_no" : this.dataSearch2[index].ref_no
  });
  this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/openDittoAttach', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
          myExtObject.OpenWindowMax(getDataOptions.file);
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

openEcms(){
  myExtObject.OpenWindowMax('https://10.23.14.12/praxticol85-coj/');
}

openEcms2(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
  });
  this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/openDittoAttachForm', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
          myExtObject.OpenWindowMax(getDataOptions.file);
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

loadMyModalComponent(){

}

closeModal(){
  this.loadComponent = false;
  this.loadConfirmComponent = false;
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
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['userToken'] = this.userData.userToken;

                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');

                      var bar = new Promise((resolve, reject) => {
                        dataTmp.push(this.dataSearch[this.delIndex]);  
                      });
                      if(bar){
                        this.SpinnerService.show();
                        let headers = new HttpHeaders();
                        headers = headers.set('Content-Type','application/json');
                        dataDel['data'] = dataTmp;
                        var data = $.extend({}, dataDel);
                        console.log(data)
                        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/deleteAttachData', data , {headers:headers}).subscribe(
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
                              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                if (resp.success==true){
                                  this.closebutton.nativeElement.click();
                                  this.SpinnerService.hide();
                                  this.searchData();
                                }
                                subscription.unsubscribe();
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

  delData(index:any){
    this.delIndex = index;
    this.openbutton.nativeElement.click();
    this.loadConfirmComponent = true;
    this.loadComponent = false;
    
  }

  goToLink(){
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fct0228";
    //console.log(winURL)
    window.open(winURL, "_blank");
  }

}







