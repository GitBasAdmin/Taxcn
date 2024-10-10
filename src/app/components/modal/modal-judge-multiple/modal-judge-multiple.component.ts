import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
// import { AnyTxtRecord } from 'dns';
@Component({
  selector: 'app-modal-judge-multiple',
  templateUrl: './modal-judge-multiple.component.html',
  styleUrls: ['./modal-judge-multiple.component.css']
})
export class ModalJudgeMultipleComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: any;//ประเภท popup
  @Input() value6: number;//คลิกเลือกไว้

  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  modalType:any;
  result:any = [];
  getCaseCate:any;
  value6Array:any;
  masterSelect:boolean = false;
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
    this.modalType = JSON.parse(this.value5);

    this.value6Array = this.value6 ? JSON.parse("[" + this.value6 + "]"):[];
    console.log(this.value6Array)
    console.log(this.items)
    if(this.items){
      if(!this.value6Array.length)
        this.items.forEach((x : any ) => x.index = false);
      else
        this.items.forEach((x : any ) => this.value6Array.includes(x.fieldIdValue)===true?x.index = true:x.index = false );
    }

    this.result.cond = 2;
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    console.log(this.items);
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
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
            if(!this.value6Array.length)
              this.items.forEach((x : any ) => x.index = false);
            else
              this.items.forEach((x : any ) => this.value6Array.includes(x.fieldIdValue)===true?x.index = true:x.index = false );
              
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
            if(!this.value6Array.length)
              this.items.forEach((x : any ) => x.index = false);
            else
              this.items.forEach((x : any ) => this.value6Array.includes(x.fieldIdValue)===true?x.index = true:x.index = false );

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

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataTmpId.push(ele.judge_id);
              dataTmpName.push(ele.judge_name);
              if(this.value6)
                dataTmpName2.push(ele.index);
            }
        });
    });
    if(bar){
      dataSelect['judge_id'] = dataTmpId.toString();
      dataSelect['judge_name'] = dataTmpName.toString();
      if(this.value6)
        dataSelect['index'] = dataTmpName2.toString();
      console.log($.extend({},dataSelect))
      this.onClickList.emit($.extend({},dataSelect))
      
    }
  }

  onClickListData(index:any): void {
    console.log(this.items[index])
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
  }

}
