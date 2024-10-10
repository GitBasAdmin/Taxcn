import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-envelope',
  templateUrl: './modal-envelope.component.html',
  styleUrls: ['./modal-envelope.component.css']
})
export class ModalEnvelopeComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('word_id',{static: true}) word_id : ElementRef;
  @ViewChild('word_desc',{static: true}) word_desc : ElementRef;
  masterSelect:boolean = false;
  formList: FormGroup;
  sessData:any;
  userData:any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
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
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
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

      var student = JSON.stringify({
        "run_id": this.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0111/popupMapCase', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.items = getDataOptions.data;
        },
        (error) => {}
      );
    
    
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
  }

}
