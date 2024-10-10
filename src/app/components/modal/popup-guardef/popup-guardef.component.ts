import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-popup-guardef',
  templateUrl: './popup-guardef.component.html',
  styleUrls: ['./popup-guardef.component.css']
})
export class PopupGuardefComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() guar_running: string;

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
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(this.guar_running){
      this.searchDataList();
    }
  }

  ngAfterViewInit(): void {
  }

  searchDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "guar_running": this.guar_running,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/guarDefData', student , {headers:headers}).subscribe(
      datalist => {
        let getDataOptions: any = JSON.parse(JSON.stringify(datalist));
        this.items = getDataOptions.data;
        console.log(datalist)
      },
      (error) => {}
    )
  }

  onClickListData(index:any): void {
    console.log(index);
    this.onClickList.emit(this.items[index])
    this.activeModal.close(this.items[index])
  }
}
