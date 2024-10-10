import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-datalist-return-multiple',
  templateUrl: './datalist-return-multiple.component.html',
  styleUrls: ['./datalist-return-multiple.component.css']
})
export class DatalistReturnMultipleComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
  @Input() value8: number;//คลิกเลือกไว้
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('word_id',{static: true}) word_id : ElementRef;
  @ViewChild('word_desc',{static: true}) word_desc : ElementRef;
  masterSelect:boolean = false;
  formList: FormGroup;
  sessData:any;
  userData:any;
  value8Array:any;
  result:any = [];
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
    this.value8Array = this.value8 ? JSON.parse("[" + this.value8 + "]"):[];
    // console.log(this.value8Array)
    if(this.items){
      if(!this.value8Array.length)
        this.items.forEach((x : any ) => x.index = false);
      else
        this.items.forEach((x : any ) => this.value8Array.includes(x.fieldIdValue)===true?x.index = true:x.index = false );
    }
    // console.log(this.items)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value5,
        "search_id":this.result.word_id,//this.word_id.nativeElement.value,
        "search_desc":this.result.word_desc,//this.word_desc.nativeElement.value,
        "condition":this.value7
      });
      
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          if(!this.value8Array.length)
            this.items.forEach((x : any ) => x.index = false);
          else
            this.items.forEach((x : any ) => this.value8Array.includes(x.fieldIdValue)===true?x.index = true:x.index = false );
        },
        (error) => {}
      );
    
    
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

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
    
    
  }

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataTmpId.push(ele.fieldIdValue);
              dataTmpName.push(ele.fieldNameValue);
              if(this.value6)
                dataTmpName2.push(ele.fieldNameValue2);
            }
        });
    });
    if(bar){
      dataSelect['fieldIdValue'] = dataTmpId.toString();
      dataSelect['fieldNameValue'] = dataTmpName.toString();
      if(this.value6)
        dataSelect['fieldNameValue2'] = dataTmpName2.toString();
      //console.log($.extend({},dataSelect))
      this.onClickList.emit($.extend({},dataSelect))
      this.activeModal.close($.extend({},dataSelect))
    }
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

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    console.log(this.items[index])
    this.onClickList.emit(this.items[index])
    this.activeModal.close(this.items[index])
  }

}
