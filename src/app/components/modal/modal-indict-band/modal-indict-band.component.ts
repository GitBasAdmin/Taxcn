import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-indict-band',
  templateUrl: './modal-indict-band.component.html',
  styleUrls: ['./modal-indict-band.component.css']
})
export class ModalIndictBandComponent implements AfterViewInit,OnInit {
  sessData:any;
  userData:any;
  @Input() items : any = [];
  @Input() value1: number;//modal type
  @Input() value2: number;//case type
  @Input() types : number;//ประเภท Modal
  @Output() onClickList = new EventEmitter<{index:any,type:any}>();
  @ViewChild('wordDesc',{static: true}) wordDesc : ElementRef;
  @ViewChild('courtTypeId',{static: true}) courtTypeId : ElementRef;

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
    //alert(99)
    //console.log(this.items)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.value1==1){
      var student = JSON.stringify({
        "case_type" : this.value2,
        "court_type_id" : parseInt(this.courtTypeId.nativeElement.value),
        "search_desc" : this.wordDesc.nativeElement.value,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJband', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }else{
      var student = JSON.stringify({
        "case_type" : this.value2,
        "court_type_id" : parseInt(this.courtTypeId.nativeElement.value),
        "search_desc" : "",
        "userToken" : this.userData.userToken
      });
      
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupIndict', student , {headers:headers}).subscribe(
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
    if(this.value1==1){
      var student = JSON.stringify({

      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }else{
      var student = JSON.stringify({

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

  onClickListData(index:any,type:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    index = this.items[index];
    if(this.types==1)
      this.activeModal.close({index,type})
    else
      this.onClickList.emit({index,type})
  }

}
