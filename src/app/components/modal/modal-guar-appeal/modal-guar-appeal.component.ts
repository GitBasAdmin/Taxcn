import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-guar-appeal',
  templateUrl: './modal-guar-appeal.component.html',
  styleUrls: ['./modal-guar-appeal.component.css']
})
export class ModalGuarAppealComponent implements AfterViewInit,OnInit {
  // @Input() items : any = [];
  @Input() run_id: string;//run_id
  // @Input() split_type: number;//1 คือแยกนัด
  @Output() onClickList = new EventEmitter<any>();

  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];
  items:any = [];
  modal_name="modal-guar-appeal.component";

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.run_id);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    if(this.run_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken});

      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/getData', student , {headers:headers}).subscribe(
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
  }

  searchDataList(){
    if(this.result.word_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      this.SpinnerService.show();
      var student = JSON.stringify({
        "appeal_type_name" : this.result.word_id,
        "start_date" : this.result.word_desc,
        "userToken" : this.userData.userToken
      });
        console.log(student)

      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/search', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.SpinnerService.hide();
          }else{
            this.items = [];
            this.SpinnerService.hide();
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
