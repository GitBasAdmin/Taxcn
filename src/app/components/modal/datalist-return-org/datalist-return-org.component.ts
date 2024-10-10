import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-datalist-return-org',
  templateUrl: './datalist-return-org.component.html',
  styleUrls: ['./datalist-return-org.component.css']
})
export class DatalistReturnOrgComponent implements AfterViewInit,OnInit {
  @Input() pers_type : any;
  @Input() types : number;//ประเภท Modal
  @Output() onClickList = new EventEmitter<any>();
  items:any = [];
  result:any = [];
  sessData:any;
  userData:any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) {}

  ngOnInit(): void {
    //alert(99)
    //console.log(this.items)
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

  
      var student = JSON.stringify({
        "pers_type": this.pers_type,
        "word_id" : this.result.word_id,
        "word_desc" : this.result.word_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupPersSetup', student).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    
  }

  showDataList(){
    
    var student = JSON.stringify({
      "pers_type": this.pers_type,
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupPersSetup', student).subscribe(
        datalist => {
          this.items = datalist;
          console.log(this.items)
        },
        (error) => {}
      );
    
    
  }

  onClickListData(index:any): void {
    if(this.types){
      this.onClickList.emit(this.items[index])
      this.activeModal.close(this.items[index])
    }else{
      //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
      this.onClickList.emit([this.items[index]])
    }
  }

  

}
