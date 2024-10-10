import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
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
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fsn1000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1000.component.html',
  styleUrls: ['./fsn1000.component.css']
})


export class Fsn1000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  dataHead:any  = [];
  dataSearch:any = [];
  result:any = [];
  getIndex:any;
  myExtObject:any;
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
  selectedData:any= 'เลือกฝั่งคู่ความ';
  defaultTitle:any;
  defaultRedTitle:any;
  getProsAccuType:any;
  toPage:any;
  asyncObservable: Observable<string>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 99999,
        processing: true,
        columnDefs: [{"targets": 'no-sort',"orderable": false}],
        order:[],
        lengthChange : false,
        info : false,
        paging : false,
        searching : false
      };

      this.getProsAccuType = [{id:'',text:'เลือกฝั่งคู่ความ'},{id:'0',text:'ใบเสร็จทั้งหมด'},{id:'1',text:'โจทก์'},{id:'2',text:'จำเลย'}];
      this.result.pros_accu_type = '';
    }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fsn1000"
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

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    this.result.pros_accu_type = '';
    this.dataSearch = [];
    //this.searchIndex();
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

   ngAfterContentInit() : void{
      myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    changeProsAccuType(type:any){
      if(this.dataHead.run_id && this.result.pros_accu_type != ''){
        this.searchIndex();
      }else{
        this.dataSearch = [];
        //this.searchIndex();
      }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }//100000 เป็น 100,000.00


    curencyFormatRevmove(val: number): string {
      if (val !== undefined && val !== null) {
        return val.toString().replace(/,/g, "").slice(.00, -3); ;
      } else {
        return "";
      }
    } // 100,000.00 เป็น  100000.

    goToPage(run_id:any,running:any,val:any){
      let winURL = window.location.href;
      if(val==1){
        this.toPage = 'ffn0400';
      }else if(val==2){
        this.toPage = 'fsn1001';
      }
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id+'&receipt_running='+running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    goToPage2(running:any,type_id:any,sub_type_id:any){
      var params ='{}';
      var params = JSON.stringify({
        "receipt_running" : running,
        "receipt_type_id" : type_id,
        "sub_type_id" :sub_type_id,
       });
      let winURL = window.location.href;
          this.toPage = 'fsn1001';
      //winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?receipt_running='+running'';
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?receipt_running='+running+'&receipt_type_id='+type_id+'&sub_type_id='+sub_type_id;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    // sendParams(){

    //  // var rptName = 'rca2400';


    //   // For no parameter : paramData ='{}'
    //   var params ='{}';

    //   // For set parameter to report
    //    var params = JSON.stringify({
    //     "receipt_running" : running,
    //     "receipt_type_id" : this.result.receipt_type_id,
    //     "sub_type_id" : this.result.sub_type_id,
    //    });
    //   // alert(paramData);return false;
    //   //this.printReportService.printReport(rptName,paramData);
    // }


    searchIndex(){

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.SpinnerService.show();
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "pros_accu_type" : this.result.pros_accu_type,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/fsn1000', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
            if(getDataOptions.result==1){
              this.dataSearch = getDataOptions.data;
              if(this.dataSearch.length)
                this.dataSearch.forEach((x : any ) => x.editValue = false);

                var bar = new Promise((resolve, reject) => {
                  getDataOptions.data.forEach((ele, index, array) => {
                        // if(ele.short_judgement != null){
                        //   if(ele.short_judgement.length > 47 )
                        //     productsJson.data[index]['short_judgement_short'] = ele.short_judgement.substring(0,47)+'...';
                        // }
                        // this.total_fee = productsJson.data.length;
                        // this.sum_fee = productsJson.sum_fee;
                        // if(ele.sum_cash != null){
                        //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.sum_cash,2);
                        // }
                        // // alert("xxxx");
                        if(ele.sum_amt != null){
                          getDataOptions.data[index]['sum_amt'] = this.curencyFormat(ele.sum_amt,2);
                        }
                        if(ele.pay_amt != null){
                          getDataOptions.data[index]['pay_amt'] = this.curencyFormat(ele.pay_amt,2);
                        }
                        if(ele.remain_amt != null){
                          getDataOptions.data[index]['remain_amt'] = this.curencyFormat(ele.remain_amt,2);
                        }
                        // if(ele.credit_amt != null){
                        //   productsJson.data[index]['credit_amt'] = this.curencyFormat(ele.credit_amt,2);
                        // }
                        // if(ele.sum_fee != null){
                        //   productsJson.data[index]['sum_fee'] = this.curencyFormat(ele.sum_fee,2);
                        // }
                        // if(ele.sum_total != null){
                        //   productsJson.data[index]['sum_total'] = this.curencyFormat(ele.sum_total,2);
                        // }
                        // if(ele.run_id != null){
                        //   this.pgrcv_running.push(ele.run_id);
                        // }
                    });
                });

                if(bar){
                  //this.dataSearch = this.dataSearch.data;
                  // this.deposit = this.curencyFormat(productsJson.deposit,2);
                  // this.rerender();
                  //this.dtTrigger.next(null);
                  console.log(this.dataSearch)
                }

              //this.dtTrigger.next(null);
              this.rerender();
              setTimeout(() => {
                this.ngAfterContentInit();
              }, 200);
            }else{
              this.dataSearch = [];
              this.rerender();
            }
            this.SpinnerService.hide();
        },
        (error) => {}
      )

    }




}







