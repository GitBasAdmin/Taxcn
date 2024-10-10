import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-datalist-return',
  templateUrl: './datalist-return.component.html',
  styleUrls: ['./datalist-return.component.css']
})
export class DatalistReturnComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() value1: string;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
  @Input() value8: number;//fileNameValue2
  @Input() value9: number;//เรียก showDataList
  
  @Output() onClickList = new EventEmitter<any>();
  
  formList: FormGroup;
  sessData:any;
  userData:any;


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
    //alert(99)
    //console.log(this.items)
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //console.log(1)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
    //console.log(2)
    if(this.value9)
      this.showDataList();
  }

  searchDataList(){
    //alert(this.value8)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.value5){
      if(!this.value8){
        var student = JSON.stringify({
          "table_name": this.value1,
          "field_id": this.value2,
          "field_name": this.value3,
          "search_id":this.formList.get("word_id")?.value,
          "search_desc":this.formList.get("word_desc")?.value,
          "condition":this.value7
        });
      }else{
        var student = JSON.stringify({
          "table_name": this.value1,
          "field_id": this.value2,
          "field_name": this.value3,
          "field_name2": this.value8,
          "search_id":this.formList.get("word_id")?.value,
          "search_desc":this.formList.get("word_desc")?.value,
          "condition":this.value7
        });
      }
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
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }
    
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.value5){
      if(!this.value8){
        var student = JSON.stringify({
          "table_name": this.value1,
          "field_id": this.value2,
          "field_name": this.value3,
          "search_id":'',
          "search_desc":'',
          "condition":this.value7
        });
      }else{
        var student = JSON.stringify({
          "table_name": this.value1,
          "field_id": this.value2,
          "field_name": this.value3,
          "field_name2": this.value8,
          "search_id":'',
          "search_desc":'',
          "condition":this.value7
        });
      }      
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
    
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
    this.activeModal.close(this.items[index])
  }

  

}
