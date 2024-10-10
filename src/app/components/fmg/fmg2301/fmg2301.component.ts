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
  selector: 'app-fmg2301,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg2301.component.html',
  styleUrls: ['./fmg2301.component.css']
})


export class Fmg2301Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
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
  numCase:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  modalType:any;
  toPage:any="fmg2300";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  dep_id:any;
  getDep:any;
  off_id:any;
  getSendDep:any;
  send_dep_id:any;
  getOff:any;
  stype:any;
  assign_user_id:any;
  getProblem:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fmg2301',{static: true}) case_type : ElementRef;
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
      pageLength: 30,
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
      //   this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
      // }
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
        // var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        // if(Off.length!=0){
        //   this.result.off_id = this.off_id = Off[0].fieldIdValue;
        // }
      },
      (error) => {}
    )
       this.getProblem = [{id:'0',text:'ไม่ระบุ'},{id:'1',text:'ข้อผิดพลาดของโปรแกรม'},{id:'2',text:'ความต้องการเพิ่มเติม'},{id:'3',text:'เปลี่ยนแปลงความต้องการ'},{id:'4',text:'สอบถาม'},{id:'9',text:'อื่นๆ'}];
       this.result.con = '1';

       this.successHttp();
  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fmg2301"
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
      // this.result.cFlag = 1;
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

    receiveJudgeListData(event:any){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }

    searchData(){
      console.log(this.result)
      if(!this.result.sdate &&
        !this.result.edate &&
        !this.result.con
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
      }else if((!this.result.sdate && !this.result.edate) && (!this.result.sdate2 && !this.result.edate2) && (!this.result.comp_date1 && !this.result.comp_date2)){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนเงื่อนไขวันที่');
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
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2301', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){
                /*
                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        if(ele.indict_desc != null){
                          if(ele.indict_desc.length > 47 )
                            productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                        }
                        if(ele.deposit != null){
                          productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                        }
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });
                */
                this.dataSearch = productsJson.data;
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

    goToFile(filename:any){
      // let fileURL = 'ApiMG/API/MANAGEMENT/fmg2300/openAdminFormAttach?file_name='+filename;
      // window.open(fileURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      
      let winURL = window.location.host;
      winURL = winURL + '/' + this.userData.appName + "ApiMG/API/MANAGEMENT/fmg2300/openAdminFormAttach";
      myExtObject.OpenWindowMax("http://" + winURL + '?file_name=' + filename);
    }
    // ApiMG/API/MANAGEMENT/fmg2300/openAdminFormAttach?file_name=

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
            if(excel[i]['req_date'])
              excel[i]['req_date'] = excel[i]['req_date']+"  "+excel[i]['req_time'];
            else
              excel[i]['req_date'] = "";
            if(excel[i]['assign_date'])
              excel[i]['assign_date'] = excel[i]['assign_date']+"  "+excel[i]['assign_time'];
            else
              excel[i]['assign_date'] = "";
            if(excel[i]['comp_date'])
              excel[i]['comp_date'] = excel[i]['comp_date']+"  "+excel[i]['comp_time'];
            else
              excel[i]['comp_date'] = "";
            if(excel[i]['response_date'])
              excel[i]['response_date'] = excel[i]['response_date']+"  "+excel[i]['response_time'];
            else
              excel[i]['response_date'] = "";
            if(excel[i]['req_no'])
              excel[i]['req_id'] = excel[i]['req_no']+"/"+excel[i]['req_no_item'];
            else
              excel[i]['req_no'] = "";

            for(var x=0;x<15;x++){
              if(x==0)
                data.push(excel[i]['req_id']);
              if(x==1)
                data.push(excel[i]['response_no']);
              if(x==2)
                data.push(excel[i]['req_dep_name']);
              if(x==3)
                data.push(excel[i]['send_dep_name']);
              if(x==4)
                data.push(excel[i]['req_date']);
              if(x==5)
                data.push(excel[i]['prob_type_desc']);
              if(x==6)
                data.push(excel[i]['req_desc']);
              if(x==7)
                data.push(excel[i]['req_user']);
              if(x==8)
                data.push(excel[i]['assign_user']);
              if(x==9)
                data.push(excel[i]['assign_date']);
              if(x==10)
                data.push(excel[i]['remark']);
              if(x==12)
                data.push(excel[i]['comp_date']);
              if(x==12)
                data.push(excel[i]['response_date']);
              if(x==13)
                data.push(excel[i]['response_desc']);
              if(x==14)
                data.push(excel[i]['result']);
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
          this.excelService.exportAsExcelFile(objExcel,'fmg2301' ,this.programName);
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

    goToPage(req_no:any,req_no_item:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?req_no='+req_no+'&req_no_item='+req_no_item;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=800");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    printReport(val:any,type:any,req_no:any,req_no_item:any){

      var rptName = 'rmg2301';

      // if(val==1){
      //   rptName = 'rsn0300';
      // }

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
            "pdep_code" : this.result.dep_id ? this.result.dep_id : '',
            "psend_dep_code" : this.result.send_dep_id ? this.result.send_dep_id : '',
            "passign_user_id" : this.result.assign_user_id ? this.result.assign_user_id : '',
            "preq_desc" : this.result.req_desc ? this.result.red_desc : '',
            "pflag" : val ? val.toString() : '',
            "pdep_print" : this.userData.depCode ? this.userData.depCode.toString() : '',
            "pprint_type" : type ? type.toString() : '',
         "psdate" : myExtObject.conDate($("#sdate").val()),
         "pedate" : myExtObject.conDate($("#edate").val()),
         "psdate2" :  myExtObject.conDate($("#sdate2").val()),
         "pedate2" :  myExtObject.conDate($("#edate2").val()),
         "pscomp_date" : myExtObject.conDate($("#comp_date1").val()),
         "pecomp_date" : myExtObject.conDate($("#comp_date2").val()),
       });
        console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    printReport2(val:any,req_no:any,req_no_item:any){

      var rptName = 'rmg2300';

      // if(val==1){
      //   rptName = 'rsn0300';
      // }
      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
            "pflag" : val.toString(),
            "preq_no" : req_no.toString(),
            "preq_no_item" : req_no_item.toString(),
       });
        console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }
  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }

}







