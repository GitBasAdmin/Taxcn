import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
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

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkr0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkr0200.component.html',
  styleUrls: ['./fkr0200.component.css']
})


export class Fkr0200Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getDepartment:any;
  sdep_id:any;
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
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  myExtObject:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fkr0200',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

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
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

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
        this.getDepartment = getDataOptions;//ยังไม่แปลงค่า
        //console.log(this.getDepartment)
        this.getDepartment.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())//แปลงค่าแล้ว
        console.log(this.getDepartment)
        var dep = this.getDepartment.filter((x:any) => x.fieldIdValue === this.userData.depCode) ;
        if(dep.length!=0){
          this.result.sdep_id = this.sdep_id = dep[0].fieldIdValue;
        }
      },
      (error) => {}
    )

    // //======================== pcase_cate ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pcase_cate",
    //   "field_id" : "case_cate_id",
    //   "field_name" : "case_cate_name",
    //   "order_by" : "case_cate_id ASC",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseCate = getDataOptions;
    //     //console.log(getDataOptions)
    //   },
    //   (error) => {}
    // )

    //  //======================== pattach_type ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pattach_type",
    //   "field_id" : "attach_type_id",
    //   "field_name" : "attach_type_name",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getAttachTypeId = getDataOptions;
    //   },
    //   (error) => {}
    // )

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
      "url_name" : "fkr0200"
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
          console.log(getDataAuthen,'xxxDataAuthen')
          this.programName = getDataAuthen.programName;
          // this.defaultCaseType = getDataAuthen.defaultCaseType;
          // this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
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
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }



    tabChangeSelect(objName:any,objData:any,event:any,type:any){
      if(typeof objData!='undefined'){
        if(type==1){
          var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
        }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
        }
        console.log(objData)
        if(val.length!=0){
          this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
        }
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }

    searchData(){
      console.log(this.result)
      // if(!this.result.sdep_id){
      //     const confirmBox = new ConfirmBoxInitializer();
      //     confirmBox.setTitle('ข้อความแจ้งเตือน');
      //     confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
      //     confirmBox.setButtonLabels('ตกลง');
      //     confirmBox.setConfig({
      //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //     });
      //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //       if (resp.success==true){this.SpinnerService.hide();}
      //       subscription.unsubscribe();
      //     });
      // }else{
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

        */
        //console.log(jsonTmp)
        // if(jsonTmp.card_type==1){
        //   jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        // }
        // if(jsonTmp.card_type1==1){
        //   jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
        // }

        var student = jsonTmp;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0200', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson);
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
                // this.dtTrigger.next(null);
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

      // }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

}







