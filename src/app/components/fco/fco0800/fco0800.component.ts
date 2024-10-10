import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';

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
  selector: 'app-fco0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco0800.component.html',
  styleUrls: ['./fco0800.component.css']
})


export class Fco0800Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
  posts:any;
  search:any;
  Mycond2:any;
  Mycond:any;
  deposit:any;
  court_id:any;
  sdep_id:any;
  getCourt:any;
  getDep:any;
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
  numCase:any;
  numLit:any;
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  myExtObject:any;
  judge_id:any;
  toPageR:any='fju0100';
  toPageB:any='fco0400';
  judge_name:any;
  date_type:any;
  getCaseCate:any;
  getCaseStatus:any;
  getConResult:any;
  getTitle:any;
  getRedTitle:any;
  getJudgeFileType:any;
  getJudgeFileDss:any;
  getRunDocTitle:any;
  getEfile:any;
  modalType:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldType:any;
  public listFieldCond:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fco0800',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
      // lengthChange : false,
      // info : false,
      // paging : false,
      // searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dataSearch.deposit = "0.00";
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


//console.log(student)


      //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_running",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
        // var court = this.getCourt.filter((x:any) => x.fieldIdValue === this.userData.courtId) ;
        // if(court.length!=0){
        //   this.result.court_id = this.court_id = court[0].fieldIdValue;
        // }
      },
      (error) => {}
    )


    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "field_name2" : "print_dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
        // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
        // if(Dep.length!=0){
        //   this.result.sdep_id = this.sdep_id = Dep[0].fieldIdValue;
        // }
      },
      (error) => {}
    )
    // //======================== pcase_status ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pcase_status",
    //   "field_id" : "case_status_id",
    //   "field_name" : "case_status",
    //   "order_by" : "order_no ASC, case_status_id ASC",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseStatus = getDataOptions;
    //     //console.log(getDataOptions)
    //   },
    //   (error) => {}
    // )

    //======================== pdoc_title ======================================
    var student = JSON.stringify({
      "table_name" : "pdoc_title",
      "field_id": "LISTAGG(doc_title_id, '')",
      "field_name" : "doc_title",
      "condition" : "AND in_out = 2 GROUP BY doc_title",
      "order_by": "doc_title ASC",
      "userToken" : this.userData.userToken
    });

    console.log(student);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions);
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทั้งหมด'});
        this.getRunDocTitle = getDataOptions;
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
      //  this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
      //  this.getDateType = [{id:'1',text:'วันที่ออกแดงตั้งแต่'},{id:'2',text:'วันที่แจ้งการอ่านตั้งแต่'}];
      //  this.result.date_type = '1';
      //  this.getConResult = [{id:'',text:''},{id:'1',text:'จำหน่ายคดี'},{id:'2',text:'สำเร็จ'},{id:3,text:'ไม่สำเร็จ'}];
      //  this.getJudgeFileType = [{id:'1',text:'ทั้งหมด'},{id:'2',text:'พิมพ์คำพิพากษาแล้ว'},{id:'3',text:'ยังไม่ได้พิมพ์คำพิพากษา'}];
      //  this.result.judge_file_type = '1';
      //  this.getJudgeFileDss = [{id:'1',text:'ทั้งหมด'},{id:'2',text:'Upload ไฟล์คำพิพากษาแล้ว'},{id:'3',text:'ยังไม่ได้ Upload ไฟล์คำพิพากษา'}];
      //  this.result.judge_file_dss = '1';
      //  this.getEfile = [{id:'',text:'คดีทั้งหมด(รวมคดีที่ยื่นฟ้อง e-filing)'},{id:'1',text:'เฉพาะคดีที่ยื่นฟ้อง e-filing'},{id:'2',text:'ไม่รวมคดีที่ยื่นฟ้อง e-filing'}];
      //  this.result.efile = '';
      //  this.result.cond2 = '3';
      //  this.result.cond = '1';
      //  this.result.judge_over_dss = '5';
        this.result.run_doc_title = 'ทั้งหมด';
        // this.result.case_type = 1;
       //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fco0800"
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

    changeCaseType(val:any){
      //========================== ptitle ====================================
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='1' AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      var student2 = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='2' AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      var student3 = JSON.stringify({
        "table_name": "pcase_cate",
        "field_id": "case_cate_id",
        "field_name": "case_cate_name",
        "condition": "AND case_type='"+val+"'",
        "order_by": " case_cate_id ASC",
        "userToken" : this.userData.userToken
      });

      //console.log("fCaseTitle")
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getTitle = getDataOptions;
            //this.selTitle = this.fca0200Service.defaultTitle;
          },
          (error) => {}
        )

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getRedTitle = getDataOptions;
          },
          (error) => {}
        )

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 , {headers:headers}).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
       },
           (error) => {}
         )

      });
      return promise;
    }


    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
      this.loadModalComponent = false;
      this.loadModalComponent = false;
      this.loadModalJudgeComponent = false;
    }

    receiveFuncListData(event:any){
      this.result.result_id = event.fieldIdValue;
      this.result.result_desc = event.fieldNameValue;
      this.closebutton.nativeElement.click();
      console.log(event)
    }

    clickOpenMyModalComponent(val:any){
      this.modalType = val;
      if(this.modalType==1 || this.modalType==2 || this.modalType==3){
        this.loadModalJudgeComponent = true;
        this.loadModalComponent = false;
        this.loadComponent = false;
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken
        });
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});

        console.log(student)


       this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.data.length){
              this.list = productsJson.data;
              console.log(this.list)
            }else{
              this.list = [];
            }
           },
           (error) => {}
         )
      }else if(this.modalType==4){//ผลคำพิพากษา
        $("#exampleModal").find(".modal-content").css("width","700px");
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "search_id" : "",
          "search_desc" : "",
          "condition" : " AND case_type='"+this.result.case_type+"'",
          "userToken" : this.userData.userToken});
        this.listTable='pjudge_result';
        this.listFieldId='result_id';
        this.listFieldName='result_desc';
        this.listFieldNull='';
        this.listFieldCond=" AND case_type='"+this.result.case_type+"'";
      }

      //ส่วนนี้จะใช้กับ popup return ธรรมดา
      if(this.modalType==4){
        this.loadModalComponent = false;
        this.loadComponent = true;
        this.loadModalJudgeComponent = false;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        )
      }
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      // this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
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

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        if(name=='judge_id1' || name=='judge_id2' || name=='case_judge_id'){
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
              if(name=='judge_id1'){
                this.result.judge_name1 = productsJson[0].fieldNameValue;
              }else if(name=='judge_id2'){
                this.result.judge_name2 = productsJson[0].fieldNameValue;
              }else if(name=='case_judge_id'){
                this.result.case_judge_name = productsJson[0].fieldNameValue;
              }

            }else{
              if(name=='judge_id1'){
                this.result.judge_id1 = null;
                this.result.judge_name1 = '';
              }else if(name=='judge_id2'){
                this.result.judge_id2 = null;
                this.result.judge_name2 = '';
              }else if(name=='case_judge_id'){
                this.result.case_judge_id = null;
                this.result.case_judge_name = '';
              }
            }
          },
          (error) => {}
        )
      }else if(name=='result_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "condition" : " AND result_id='"+event.target.value+"' AND case_type='"+this.result.case_type+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.result_desc = productsJson[0].fieldNameValue;

            }else{

              this.result.result_id = '';
              this.result.result_desc = '';
            }
          },
          (error) => {}
        )
      }
    }

    receiveJudgeListData(event:any){
      if(this.modalType==1){
         this.result.case_judge_id = event.judge_id;
         this.result.case_judge_name = event.judge_name;
      }else if(this.modalType==2){
         this.result.judge_id1 = event.judge_id;
         this.result.judge_name1 = event.judge_name;
      }else if(this.modalType==3){
        this.result.judge_id2 = event.judge_id;
        this.result.judge_name2 = event.judge_name;
      }
      this.closebutton.nativeElement.click();
    }

    searchData(){
       if(this.result.run_doc_title=='ทั้งหมด'){
         this.result.run_doc_title = '';
       }
      console.log(this.result)
      if(!this.result.case_type &&
        !this.result.court_id &&
        !this.result.title && !this.result.id && !this.result.yy &&
        !this.result.red_title && !this.result.red_id && !this.result.red_yy &&
        !this.result.old_title && !this.result.old_id && !this.result.old_yy &&
        !this.result.old_red_title && !this.result.old_red_id && !this.result.old_red_yy &&
        !this.result.doc_id_title && !this.result.doc_id &&
        !this.result.sdate && !this.result.edate &&
        !this.result.subject_name && !this.result.doc_orig && !this.result.run_doc_title &&
        !this.result.must_reply && !this.result.doc_dest
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
      // }else if((!this.result.case_sdate && !this.result.case_edate) && (!this.result.judging_sdate && !this.result.judging_edate) ){
      //   const confirmBox = new ConfirmBoxInitializer();
      //   confirmBox.setTitle('ข้อความแจ้งเตือน');
      //   confirmBox.setMessage('เลือกวันที่รับฟ้อง และ/หรือ วันที่ออกแดง');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if (resp.success==true){this.SpinnerService.hide();}
      //     subscription.unsubscribe();
      //   });
      }else{
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
        console.log('xxxxxxxxxxxx'+JSON.stringify(student))
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0800', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        // if(ele.short_judgement != null){
                        //   if(ele.short_judgement.length > 47 )
                        //     productsJson.data[index]['short_judgement_short'] = ele.short_judgement.substring(0,47)+'...';
                        // }
                        // if(ele.deposit != null){
                        //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                        // }
                    });
                });

                bar.then(() => {

                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                // if(bar){
                //   this.dataSearch = productsJson.data;
                //   this.deposit = this.curencyFormat(productsJson.deposit,2);
                //   this.rerender();
                //   //this.dtTrigger.next(null);
                //   console.log(this.dataSearch)
                // }

                this.dataSearch = productsJson.data;
                // this.deposit = this.curencyFormat(productsJson.deposit,2);
                // this.result.deposit
                // this.numCase = productsJson.num_case;
                // this.numLit = productsJson.num_lit;
                //this.dtTrigger.next(null);
                this.rerender();
                console.log(this.dataSearch)
              }else{
                this.dataSearch = [];
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

            for(var x=0;x<16;x++){
              if(x==0)
                data.push(excel[i]['doc_sub_type_name']);
              if(x==1)
                data.push(excel[i]['run_doc_no']);
              if(x==2)
                data.push(excel[i]['real_doc_no']);
              if(x==3)
                data.push(excel[i]['real_send_date']);
              if(x==4)
                data.push(excel[i]['subject_name']);
              if(x==5)
                data.push(excel[i]['docto_desc']);
              if(x==6)
                data.push(excel[i]['court_name']);
              if(x==7)
                data.push(excel[i]['case_no']);
              if(x==8)
                data.push(excel[i]['old_black']);
              if(x==9)
                data.push(excel[i]['old_red']);
              if(x==10)
                data.push(excel[i]['create_dep_name']);
              if(x==11)
                data.push(excel[i]['create_user']);
              if(x==12)
                data.push(excel[i]['create_date']);
              if(x==13)
                data.push(excel[i]['update_dep_name']);
              if(x==14)
                data.push(excel[i]['update_user']);
              if(x==15)
                data.push(excel[i]['update_date']);
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
          this.excelService.exportAsExcelFile(objExcel,'fco0800' ,this.programName);
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

    goToPage(run_seq:any,type:any){

      let winURL = window.location.href;
      if(type===1){
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageB+'?run_seq='+run_seq;
      }else{
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageR+'?run_seq='+run_seq;
      }

      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

}







