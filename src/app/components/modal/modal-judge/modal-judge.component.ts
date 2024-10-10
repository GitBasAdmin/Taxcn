import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyTxtRecord } from 'dns';
@Component({
  selector: 'app-modal-judge',
  templateUrl: './modal-judge.component.html',
  styleUrls: ['./modal-judge.component.css']
})
export class ModalJudgeComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: any;//ประเภท popup

  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  modalType:any;
  result:any = [];
  getCaseCate:any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 
    
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.modalType = JSON.parse(this.value5);
    console.log(this.modalType)
    let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
      },
      (error) => {}
    )
    //alert(99)
    //console.log(this.items)
      this.result.cond = 2;
      if(this.modalType.type==99 || this.types==1)
        this.showDataList()
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){
    var json = JSON.parse(this.value5);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(json.type==1){
      var student = JSON.stringify({
        "cond": this.result.cond,
        "assign_date":json.assign_date,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
        datalist => {

          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }else if(json.type==2){
      var student = JSON.stringify({
        "cond": this.result.cond,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
        datalist => {
          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }else if(json.type==99){
      var student = JSON.stringify({
        "cond": 2,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
        datalist => {
          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
    
  }

  showDataList(){
    this.result.cond = 2;
    var json = JSON.parse(this.value5);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(json.type==1){
      var student = JSON.stringify({
        "cond": 2,
        "assign_date":json.assign_date,
        "judge_id":'',
        "judge_name":'',
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
        datalist => {
          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }else{
 
      var student = JSON.stringify({
        "cond": 2,
        "judge_id":'',
        "judge_name":'',
        "userToken" : this.userData.userToken
      });
      
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
        datalist => {
          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    
    }
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    if(this.modalType.type==99 || this.types==1)
      this.activeModal.close(this.items[index])
    else
      this.onClickList.emit(this.items[index])
  }

}
