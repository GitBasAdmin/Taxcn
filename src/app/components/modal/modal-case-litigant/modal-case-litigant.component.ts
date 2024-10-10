import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-case-litigant',
  templateUrl: './modal-case-litigant.component.html',
  styleUrls: ['./modal-case-litigant.component.css']
})
export class ModalCaseLitigant implements AfterViewInit,OnInit {
  @Input() type: number;//ประเภทการแสดง
  @Input() types: number;//ประเภท Modal
  @Input() run_id: number;
  @Input() lit_type: number;
  @Output() onClickList = new EventEmitter<any>();
  items:any = [];
  sessData:any;
  userData:any;
  formList: FormGroup;
  masterSelect:boolean = false;
  form:any=[];

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //alert(99)
    //console.log(this.type)
    this.showDataList();
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
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpLitType=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataTmpId.push(ele.seq);
              dataTmpName.push(ele.lit_name+" "+ele.lit_type_desc2);
              dataTmpLitType.push(ele.lit_type);
            }
        });
    });
    if(bar){
      dataSelect['fieldIdValue'] = dataTmpId.toString();
      dataSelect['fieldNameValue'] = dataTmpName.toString();
      dataSelect['fieldNameValue2'] = dataTmpLitType[0];
      console.log($.extend({},dataSelect))
      this.onClickList.emit($.extend({},dataSelect))
      
    }
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.types){
      if(this.type==1 || this.type==3){
        var student = JSON.stringify({
          "run_id": this.run_id,
          "lit_type": this.lit_type,
          "seq":0,
          "userToken" : this.userData.userToken
        });
        console.log(student)
      }else{
        var student = JSON.stringify({
          "run_id": this.run_id,
          "lit_type": 0,
          "seq":0,
          "userToken" : this.userData.userToken
        });
        console.log(student)
      }
    }else{
      var student = JSON.stringify({
        "run_id": this.run_id,
        "lit_type": this.lit_type,
        "seq":0,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    }
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
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

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //if(this.type==1){
      var student = JSON.stringify({
        "run_id": this.run_id,
        "lit_type": this.lit_type,
        "seq": parseInt(this.form.word_id),
        "name": this.form.word_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    //}
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
      datalist => {
        let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
        console.log(getDataOptions)
        if(this.items.length){
          this.items = getDataOptions.data;
        }else{
          this.items = [];
        }
              
        console.log(this.items)
      },
      (error) => {}
    );
    
  }
  /*
  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.value5){
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":'',
        "search_desc":'',
        "condition":this.value7
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    }else{
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value5,
        "search_id":'',
        "search_desc":''
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }
    
  }*/

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    /*var item = {};
    item['fieldIdValue'] = this.items[index]['seq'];
    item['fieldNameValue'] = this.items[index]['lit_name']+" "+this.items[index]['lit_type_desc2'];
    item['fieldNameValue2'] = this.items[index]['lit_type'];
    console.log(item)*/
    if(!this.types)
      this.onClickList.emit(this.items[index])
    else
      this.activeModal.close(this.items[index])
  }

}
