import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
// import { ActivatedRoute } from '@angular/router';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
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

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fdo0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fdo0500.component.html',
  styleUrls: ['./fdo0500.component.css']
})


export class Fdo0500Component implements AfterViewInit, OnInit, OnDestroy {
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
  toPage:any="fdo0100";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  stype:any;

  receipt_running:any;
  sub_type_id:any;
  receipt_type_id:any;

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
  // @ViewChild('fdo0500',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if(params['program'])
    //     this.retPage = params['program'];
    // });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    // this.activatedRoute.queryParams.subscribe(params => {
    //   console.log(params);
    //   this.result.case_cate_id = params['case_cate_id'];
    //   this.result.ctype = params['ctype'];
    //   this.result.dtype = params['dtype'];
    //   this.result.dcolumn = params['dcolumn'];
    //   this.result.sdate = params['sdate'];
    //   this.result.edate = params['edate'];
    //   if(typeof this.result.case_cate_id !='undefined')
    //    this.LoadData();
    // });
    this.LoadData();

  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fdo0500"
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

    receiveJudgeListData(event:any){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }


    LoadData() {
      //  alert("xxxx");
      this.posts = [];
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

        this.SpinnerService.show();
        // let headers = new HttpHeaders();
        // headers = headers.set('Content-Type','application/json');
        // if(this.prov_id.nativeElement["default_value"].checked==true){
        //   var inputChk = 1;
        // }else{
        //   var inputChk = 0;
        // }
        var student = JSON.stringify({
            "userToken" : this.userData.userToken
        });
        console.log(student);
        this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0500', student ).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));

              this.posts = productsJson.data;
              // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');
            console.log(productsJson)
            if(productsJson.result == 1){

              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {
                    if(ele.doc_desc != null){
                          if(ele.doc_desc.length > 47 )
                             productsJson.data[index]['short_doc_desc'] = ele.doc_desc.substring(0,47)+'...';
                       }
                  // if(ele.deposit != null){
                  //    productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                  // }
                 });
                //  this.result.case_cate_name = productsJson.case_cate_name;
                //  this.result.case_num = productsJson.data.length;
              });

              this.dataSearch = productsJson.data;
              console.log(this.dataSearch);
              // alert(this.dataSearch.length);
              this.checklist = this.posts;
              // this.checklist2 = this.posts;
                if(productsJson.length)
                  this.posts.forEach((x : any ) => x.edit0500 = false);

              this.rerender();
              setTimeout(() => {
                myExtObject.callCalendar();
              }, 500);
            // }else{
            //   confirmBox.setMessage(productsJson.error);
            //   confirmBox.setButtonLabels('ตกลง');
            //   confirmBox.setConfig({
            //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            //   });
            //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            //     if (resp.success==true){}
            //     subscription.unsubscribe();
            //   });
            }
              this.SpinnerService.hide();

          },
          (error) => {this.SpinnerService.hide();}
        );
         }


    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    CloseWindow(){
        window.close();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    goToPage(run_id:any,mat_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id+'&material_running='+mat_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=1200");
      // myExtObject.OpenWindowMax(winURL);
    }


  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }

}







