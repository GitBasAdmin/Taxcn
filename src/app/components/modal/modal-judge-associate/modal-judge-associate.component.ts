import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { AnyTxtRecord } from 'dns';
@Component({
  selector: 'app-modal-judge-associate',
  templateUrl: './modal-judge-associate.component.html',
  styleUrls: ['./modal-judge-associate.component.css']
})
export class ModalJudgeAssociateComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
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
  ) { 
    
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result.cond = 2;
    this.searchDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){
    var json = JSON.parse(this.value5);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(json.type==1){//ปุ่มที่ 1 ของผู้พิพากษาสมทบ หน้าจอ fap0130
      var student = JSON.stringify({
        "cond": this.result.cond,
        "run_id":json.run_id,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
    }else if(json.type==2){//ปุ่มที่ 2 ของผู้พิพากษาสมทบ หน้าจอ fap0130
      var student = JSON.stringify({
        "cond": this.result.cond,
        "assign_date":json.date_appoint,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
    }else if(json.type==3){//ปุ่มที่ 3 ของผู้พิพากษาสมทบ หน้าจอ fap0130
      var student = JSON.stringify({
        "cond": this.result.cond,
        "judge_id":this.result.word_id,
        "judge_name":this.result.word_desc,
        "userToken" : this.userData.userToken
      });
    }

      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupAddJudge', student , {headers:headers}).subscribe(
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
    this.onClickList.emit(this.items[index])
  }

}
