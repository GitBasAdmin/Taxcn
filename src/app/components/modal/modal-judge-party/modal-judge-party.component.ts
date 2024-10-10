import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-judge-party',
  templateUrl: './modal-judge-party.component.html',
  styleUrls: ['./modal-judge-party.component.css']
})
export class ModalJudgePatyComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: any;//ประเภท popup

  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  result:any = [];
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
    this.result.j_type = 1;
    this.searchDataList();
  }

  ngAfterViewInit(): void {
  }

  searchDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.SpinnerService.show();
    var student = JSON.stringify({
      "j_type":this.result.j_type,
      "case_cate_id":this.result.case_cate_id,
      "cond":this.result.cond,
      "word_id":this.result.word_id,
      "word_desc":this.result.word_desc,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudgeParty', student , {headers:headers}).subscribe(
      datalist => {
        let productsJson : any = JSON.parse(JSON.stringify(datalist));
        console.log(productsJson)
        if(productsJson.length){
          this.items = productsJson;
          console.log(this.items)
          this.SpinnerService.hide();
        }else{
          this.items = [];
          this.SpinnerService.hide();
        }
      },
      (error) => {}
    );
  }

  onClickListData(index:any): void {
    this.onClickList.emit(this.items[index])
  }

}
