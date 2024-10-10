import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prca0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prca0800.component.html',
  styleUrls: ['./prca0800.component.css']
})


export class Prca0800Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
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
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;
  getCaseCate:any;

  result:any = [];
  getTitle:any;
  modalType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prca0800',{static: true}) prca0800 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup : NgSelectComponent;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
    private authService: AuthService
  ){  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
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
        this.selCaseType = this.userData.defaultCaseType;

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------
  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prca0800"
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
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }

    changeTitle(caseType:number,type:any){
      this.title = '';
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title_id",
        "field_name": "title",
        "field_name2": "title_eng",
        "condition": " AND case_type="+caseType+ " And title_flag=1",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
      console.log("fTitle :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
          if(type>0)
            this.title = type;
          //this.fDefCaseStat(caseType,title);
        },
        (error) => {}
      )
      });
      return promise;
    }

    tabChangeInput(name:any,event:any){
      if(name=='pdep_code'){
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "condition" : " AND dep_code='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.length){
              this.result.dep_name = productsJson[0].fieldNameValue;
            }else{
              this.result.pdep_code = '';
              this.result.dep_name = '';
            }
            },
            (error) => {}
          )
      }else if(name=='poff_id'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.result.poff_name = productsJson[0].fieldNameValue;
              this.getPost(productsJson[0].fieldNameValue2,2);
            }else{
              this.result.poff_id = '';
              this.result.poff_name = '';
            }
            },
            (error) => {}
          )
      }else if(name=='psign_id'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.result.psign_name = productsJson[0].fieldNameValue;
              this.getPost(productsJson[0].fieldNameValue2,3);
            }else{
              this.result.psign_id = '';
              this.result.psign_name = '';
            }
            },
            (error) => {}
          )
      }else if(name=='preport_judge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "field_name2" : "post_id",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.result.preport_judge_name = productsJson[0].fieldNameValue;
              this.getPost(productsJson[0].fieldNameValue2,4);
            }else{
              this.result.preport_judge_id = '';
              this.result.preport_judge_name = '';
            }
            },
            (error) => {}
          )
      }
    }

    getPost(post_id:any,modalType:any){
      if(post_id){
        var student = JSON.stringify({
          "table_name" : "pposition",
          "field_id" : "post_id",
          "field_name" : "post_name",
          "condition" : " AND post_id='"+post_id+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              if(modalType==2)
                this.result.poff_post = productsJson[0].fieldNameValue;
              else if (modalType==3)
                this.result.psign_post = productsJson[0].fieldNameValue;
              else if (modalType==4)
                this.result.preport_judge_post = productsJson[0].fieldNameValue;
            }else{
              if(modalType==2)
                this.result.poff_post = '';
              else if (modalType==3)
                this.result.psign_post = '';
              else if (modalType==4)
                this.result.preport_judge_post = '';
            }
            },
            (error) => {}
          )
      }
    }

    clickOpenMyModalComponent(type:any){
        this.modalType = type;
        // this.openbutton.nativeElement.click();
        this.loadMyModalComponent();
    }

    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","800px");
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pdepartment';
        this.listFieldId='dep_code';
        this.listFieldName='dep_name';
        this.listFieldNull='';

        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
              // this.loadModalListComponent = true;
              // this.loadModalJudgeComponent = false;
              const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
              modalRef.componentInstance.items = this.list
              modalRef.componentInstance.value1 = "pdepartment"
              modalRef.componentInstance.value2 = "dep_code"
              modalRef.componentInstance.value3 = "dep_name"
              modalRef.componentInstance.types = "1"
  
              modalRef.result.then((item: any) => {
                if(item){
                  if(this.modalType==1){
                    this.result.pdep_code=item.fieldIdValue;
                    this.result.dep_name=item.fieldNameValue;
                  }
                }
              })
          },
          (error) => {}
        )

      }if(this.modalType==2 || this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","800px");
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldName2='post_id';
        this.listFieldNull='';

        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
              // this.loadModalListComponent = true;
              // this.loadModalJudgeComponent = false;
              const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
              modalRef.componentInstance.items = this.list
              modalRef.componentInstance.value1 = "pofficer"
              modalRef.componentInstance.value2 = "off_id"
              modalRef.componentInstance.value3 = "off_name"
              modalRef.componentInstance.value4 = "post_id"
              modalRef.componentInstance.types = "1"
  
              modalRef.result.then((item: any) => {
                if(item){
                  if(this.modalType==2){
                    this.result.poff_id=item.fieldIdValue;
                    this.result.poff_name=item.fieldNameValue;
                    this.getPost(item.fieldNameValue2,this.modalType);
                  }else if(this.modalType==3){
                    this.result.psign_id=item.fieldIdValue;
                    this.result.psign_name=item.fieldNameValue;
                    this.getPost(item.fieldNameValue2,this.modalType);
                  }
                }
              })
          },
          (error) => {}
        )

      }else if(this.modalType==4){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "field_name2" : "post_id",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldName2='post_id';
        this.listFieldNull='';
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
              // this.loadModalListComponent = true;
              // this.loadModalJudgeComponent = false;
              const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
              modalRef.componentInstance.items = this.list
              modalRef.componentInstance.value1 = "pjudge"
              modalRef.componentInstance.value2 = "judge_id"
              modalRef.componentInstance.value3 = "judge_name"
              modalRef.componentInstance.value4 = "post_id"
              modalRef.componentInstance.types = "1"
  
              modalRef.result.then((item: any) => {
                if(item){
                  if(this.modalType==4){
                    this.result.preport_judge_id=item.fieldIdValue;
                    this.result.preport_judge_name=item.fieldNameValue;
                    this.getPost(item.fieldNameValue2,this.modalType);
                  }
                }
              })
          },
          (error) => {}
        )
      }
    }

    closeModal(){
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
    }

    fCaseTitle(case_type:any){
      //========================== ptitle ====================================
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "field_name2": "title_group",
        "condition": "AND title_flag='1' AND case_type='"+case_type+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      //console.log("fCaseTitle")

      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.getTitle = getDataOptions;
            this.fCaseStat(case_type,getDataOptions[0].fieldIdValue);
          },
          (error) => {}
        )
      });
      return promise;
    }

    fCaseStat(caseType:any,title:any){
      var student = JSON.stringify({
        "table_name": "pcase_cate",
        "field_id": "case_cate_id",
        "field_name": "case_cate_name",
        "condition": " AND case_type='"+caseType+"'",
        "order_by":" case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
      //console.log("fCaseStat :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
        },
        (error) => {}
      )
      });
      return promise;
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.pdep_code=event.fieldIdValue;
        this.result.dep_name=event.fieldNameValue;
      }else if(this.modalType==2){
        this.result.poff_id=event.fieldIdValue;
        this.result.poff_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==3){
        this.result.psign_id=event.fieldIdValue;
        this.result.psign_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }else if(this.modalType==4){
        this.result.preport_judge_id=event.fieldIdValue;
        this.result.preport_judge_name=event.fieldNameValue;
        this.getPost(event.fieldNameValue2,this.modalType);
      }
      this.closebutton.nativeElement.click();
    }

    receiveJudgeListData(event:any){
      this.result.pid=event.judge_id;
      this.result.pstat_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    assignOffChk(event:any){
      if(event==true){
        this.result.poff_id = this.userData.userCode;
        this.result.poff_name = this.userData.offName;
        this.result.poff_post = this.userData.postName;
      }else{
        this.result.poff_id = '';
        this.result.poff_name = '';
        this.result.poff_post = '';
      }
    }

    assignSignChk(event:any){
      if(event==true){
        this.result.psign_id = this.userData.directorId;
        this.result.psign_name = this.userData.directorName;
        this.result.psign_post = this.userData.directorPostName;
      }else{
        this.result.psign_id = '';
        this.result.psign_name = '';
        this.result.psign_post = '';
      }
    }

    assignReportChk(event:any){
      if(event==true){
        this.result.preport_judge_id = this.userData.headJudgeId;
        this.result.preport_judge_name = this.userData.headJudgeName;
        this.result.preport_judge_post = this.userData.headJudgePost;
      }else{
        this.result.preport_judge_id = '';
        this.result.preport_judge_name = '';
        this.result.preport_judge_post = '';
      }
    }

    printReport(flag:any){

      if(!this.result.txtStartDate || !this.result.txtEndDate){
        alert('กรุณาระบุข้อมูลวันที่ให้ครบถ้วน');
        return(false);
      }

      var rptName = 'rca0800';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({

        "ptitle" : this.result.ptitle_group ? this.result.ptitle_group : '',
        "poff_name" :this.result.poff_name ? this.result.poff_name : '',
        "poff_post" :this.result.poff_post ? this.result.poff_post : '',
        "psign_name" :this.result.psign_name ? this.result.psign_name : '',
        "psign_post" :this.result.psign_post ? this.result.psign_post : '',
        "preport_judge_name" :this.result.preport_judge_name ? this.result.preport_judge_name : '',
        "preport_judge_post" :this.result.preport_judge_post ? this.result.preport_judge_post : '',

        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pdep_code" : this.result.pdep_code ? this.result.pdep_code : '',
        "pcase_court_type" : this.result.pcase_court_type ? this.result.pcase_court_type : '',

        "pcase_type" : this.result.pcase_type ? this.result.pcase_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        "ptitle_group" : this.result.ptitle_group ? this.getTitle.find((x:any) => x.fieldIdValue === this.result.ptitle_group.toString()).fieldNameValue2.toString() : '',
        "pcon_flag" : this.result.pcon_flag == true ? '1': '0',
        "pflag" : flag.toString(),

        // "BaseDir" : this.result.BaseDir ? this.result.BaseDir : '',
        // "BaseQR" : this.result.BaseQR ? this.result.BaseQR : '',
        // "pcourt_running" : this.result.pcourt_running ? this.result.pcourt_running : '',
        // "puser_name" : this.result.puser_name ? this.result.puser_name : '',
        // "puser_post" : this.result.puser_post ? this.result.puser_post : '',
        // "pcourt_name" : this.result.pcourt_name ? this.result.pcourt_name : '',
        // "pshort_court_name" : this.result.pshort_court_name ? this.result.pshort_court_name : '',
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.sCaseStat.clearModel();
      this.sTitleGroup.clearModel();
      this.fCaseTitle(caseType);
    }

}






