import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-notice-litigant',
  templateUrl: './modal-notice-litigant.component.html',
  styleUrls: ['./modal-notice-litigant.component.css']
})
export class ModalNoticeLitigantComponent implements AfterViewInit,OnInit {
  @Input() type: number;//ประเภท Modal
  @Input() run_id: number;
  @Input() lit_type: number;
  @Input() item: number;
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
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //console.log(this.type)
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      if(obj[i].hid)
        obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  ChildTestCmp(){

    var dataObj=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataObj.push(this.items[index]);
            }
      });
    });
    if(bar){
      return dataObj;
      //console.log(dataObj)
    }

  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
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
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
      datalist => {
        let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
        console.log(getDataOptions)
        if(getDataOptions.data.length){
          this.items = getDataOptions.data;
          this.masterSelect = true;
          //this.items.forEach((x : any ) => x.index = true);
          this.items.forEach((ele, index, array) => {
            if(ele.lit_type == this.lit_type && ele.seq == this.item){
              ele.hid = false;
              ele.index = false;
            }else{
              ele.hid = true;
              ele.index = true;
            }
      });
        }else{
          this.items = [];
        }
      },
      (error) => {}
    );
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    /*var item = {};
    item['fieldIdValue'] = this.items[index]['seq'];
    item['fieldNameValue'] = this.items[index]['lit_name']+" "+this.items[index]['lit_type_desc2'];
    item['fieldNameValue2'] = this.items[index]['lit_type'];
    console.log(item)*/
    this.onClickList.emit(this.items[index])
  }

}
