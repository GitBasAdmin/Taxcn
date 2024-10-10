import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  selector: 'app-fst0230,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst0230.component.html',
  styleUrls: ['./fst0230.component.css']
})


export class Fst0230Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  myExtObject:any;
  title = 'datatables';
  toPage:any='fca0200';
  result:any = [];
  getCaseType:any;
  getCaseCate:any;
  getCaseTypeStat:any;
  getTitle:any;
  dataSearch:any = [];
  tmpResult:any = [];
  getTitleStat:any;
  getRedTitle:any;
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
  getResult:any;
  result_id:any;
  getGuarPros:any;
  asyncObservable: Observable<string>;
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
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sResult') sResult : NgSelectComponent;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
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

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

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

   this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
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


     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        // this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )

    this.getGuarPros = [{id:1,text:'คำฟ้อง'},{id:2,text:'คำร้องขอ'}];

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
      var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fst0230"
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
 }

 loadMyModalComponent(){
  this.loadComponent = false;
  this.loadModalComponent = true;
  $("#exampleModal").find(".modal-body").css("height","100px");
}

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
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

      var student4 = JSON.stringify({
        "table_name": "pcase_type_stat",
        "field_id": "case_type_stat",
        "field_name": "case_type_stat_desc",
        "condition": "AND case_type='"+val+"'",
        "order_by": " case_type_stat ASC",
        "userToken" : this.userData.userToken
      });




      //console.log("fCaseTitle")

      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getTitle = getDataOptions;
            //this.selTitle = this.fca0200Service.defaultTitle;
          },
          (error) => {}
        )

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getRedTitle = getDataOptions;
          },
          (error) => {}
        )

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
       },
           (error) => {}
         )

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student4).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.result.case_type_stat = '';
          this.result.title_stat = '';
          this.getCaseTypeStat = getDataOptions;
       },
           (error) => {}
         )


     });
      return promise;
    }

    changeTitle(val:any){
      var student5 = JSON.stringify({
        "table_name": "pstat_case_title",
        "field_id": "case_type_stat",
        "field_name": "case_title",
        "condition": "AND title_type = 'B' AND con_flag is null AND case_type ='"+this.result.case_type +"' AND case_type_stat='"+val+"'",
        "order_by": " case_type_stat ASC",
        "userToken" : this.userData.userToken
      });

      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student5).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
           this.result.title_stat = '';
           this.getTitleStat = getDataOptions;
           this.getTitleStat = this.getTitleStat.forEach((x : any) => this.result.title_stat = this.result.title_stat.length == 0?this.result.title_stat.concat('',x.fieldNameValue):this.result.title_stat.concat(',',x.fieldNameValue));
       },
           (error) => {}
         )
      });
      return promise;
    }

    isAllSelected(obj:any,master:any,child:any) {
      this[master] = obj.every(function(item:any) {
        return item[child] == true;
      })
    }

    submitForm(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit0230 == true){
          del++;
        }
      });
    });
        //  alert(del);
      if(bar){

      if (!del) {
        confirmBox.setMessage('ไม่มีข้อมูลที่เปลี่ยนแปลง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //this.SpinnerService.hide();

          }
          subscription.unsubscribe();
        });

      } else {

        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit0230 == true){
                  var tmp=this.dataSearch[index];
                  delete tmp.case_date;//ไม่ส่งค่า case_date
                  dataTmp.push(tmp);
                  //dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        this.SpinnerService.show();

          this.http
            .post('/'+this.userData.appName+'ApiST/API/STAT/fst0230/saveData', data, {

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
                  this.ngOnInit();
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



    searchData(){
      console.log(this.result)
      if(!this.result.case_type &&
        !this.result.case_type_stat &&
        !this.result.title_stat &&
        !this.result.start_date &&
        !this.result.end_date
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
      }else if(!this.result.start_date && !this.result.end_date){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนวันที่รับฟ้องให้ครบ');
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

        jsonTmp['incomplete'] = '0';
        jsonTmp['userToken'] = this.userData.userToken;


        var student = jsonTmp;
        console.log(JSON.stringify(student))
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0230', student ).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){
                // this.loadResult();
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

    submitCheck(){
      var jsonTmp = $.extend({}, this.tmpResult);
      jsonTmp['incomplete'] = '1';
      jsonTmp['userToken'] = this.userData.userToken;
      var student = jsonTmp;
      console.log(JSON.stringify(student))
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0230', student ).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.result==1){
              // this.loadResult();
              this.dataSearch = productsJson.data;
              // this.numCase = productsJson.num_case;
              // this.numLit = productsJson.num_lit;
              //this.dtTrigger.next(null);
              this.rerender();
              console.log(this.dataSearch)
            }else{
              this.dataSearch = [];
              this.rerender();
           }
            console.log(productsJson)
            this.SpinnerService.hide();
        },
        (error) => {}
      )
    }

    loadResult(){
      // alert('xxxxx');
       //======================== pjudge_result ======================================
     var student = JSON.stringify({
      "table_name" : "pjudge_result",
      "field_id" : "result_id",
      "field_name" : "result_desc",
      //"condition" : " AND case_type='"+this.result.case_type+"'",
      "condition" : " AND case_type=1",
      "userToken" : this.userData.userToken
    });
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getResult = getDataOptions;
        console.log(this.getResult)

        // var Res = this.getResult.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        // if(Res.length!=0){
        //   this.result.result_id = this.result_id = Res[0].fieldIdValue;
        // }
      },
      (error) => {}
    )
      });
      return promise;
  }

    goToPage(run_id:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    loadTableComponent(val:any,index:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      this.result.index = index;
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

  tabChangeSelectArry(index:any,objName:any,objData:any,event:any,type:any){
    console.log(objData)
    console.log(event)
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.id === parseInt(event.target.value)) ;
      }else{
          var val = objData.filter((x:any) => x.id === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      console.log(val)
      if(objName=='guar_pros'){

          if(val.length!=0){
              this.dataSearch[index]['edit0230'] = true;
            // if(type==1)
            //   this.dataSearch[index]['result_desc'] = val[0].fieldNameValue;
            // else
            //  this.dataSearch[index]['guar_pros'] = val[0].fieldIdValue;
          }else{
            //this.dataSearch[index]['result_id'] = null;
            this.dataSearch[index]['guar_pros'] = null;
          }


      }else if(objName==''){//ตัวอื่นๆ

      }

    }
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

   tabChangeInput(name:any,event:any){
     if(name=='judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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

  tabChangeInputArry(index:any,name:any,event:any){
     if(name=='judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.dataSearch[index]['edit0230'] = true;
            this.dataSearch[index]['order_judge_id'] = productsJson[0].fieldIdValue;
            this.dataSearch[index]['judge_name'] = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index]['order_judge_id'] = null;
            this.dataSearch[index]['judge_id'] = null;
            this.dataSearch[index]['judge_name'] = '';
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

  receiveJudgeListDataArry(event:any){
    var index = this.result.index;
    this.dataSearch[index]['edit0230'] = true;
    this.dataSearch[index]['judge_id'] = event.judge_id;
    this.dataSearch[index]['order_judge_id'] = event.judge_id;
    this.dataSearch[index]['judge_name'] = event.judge_name;
    this.closebutton.nativeElement.click();
  }

    directiveDate(date:any,obj:any){
     this.result[obj] = date;
    }
}







