import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef,ViewEncapsulation } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
declare var myExtObject: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fap0150',
  templateUrl: './fap0150.component.html',
  styleUrls: ['./fap0150.component.css']
})
export class Fap0150Component implements AfterViewInit,OnInit {
  @Input() table_id : number ;
  @Input() date_appoint: string;
 
  sessData:any;
  userData:any;
  getCaseType:any;
  getTitle:any;
  myExtObject: any;
  items:any = [];
  result:any = [];

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefPage();
  }

  setDefPage(){
    this.showDataList(1);
    this.fCaseType();
    
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  fCaseType(){//โหลด pcase_type
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
          this.getCaseType = getDataOptions;
          this.fCaseTitle(this.result.case_type);

        },
        (error) => {}
      )
    });
    return promise;
  }

  fCaseTitle(val:any){
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          getDataOptions.unshift({fieldIdValue:'',fieldNameValue: ''});
          this.getTitle = getDataOptions;
          this.result.title = null;
        },
        (error) => {}
      )
    });
    return promise;
  }

  showDataList(val:any){
    if(this.table_id && this.date_appoint){
       if(val==2){
        var title = this.result.title?this.result.title:'';
        var id = this.result.id?this.result.id:'';
        var yy = this.result.yy?this.result.yy:'';
        var student = JSON.stringify({
          "table_id" : this.table_id,
          "date_appoint" : this.date_appoint,
          "case_type" : this.result.case_type?this.result.case_type:'',
          "title" : title,
          "id" : id,
          "yy" : yy,
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "table_id" : this.table_id,
          "date_appoint" : this.date_appoint,
          "userToken" : this.userData.userToken
        });
      }
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0150', student ).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }

  openLink(run_id:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fmg0200';
    //console.log(winURL+'fmg0200?run_id='+run_id)
    myExtObject.OpenWindowMaxName(winURL+'fmg0200?run_id='+run_id,name);
  }


}
