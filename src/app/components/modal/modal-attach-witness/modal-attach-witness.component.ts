import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-modal-attach-witness',
  templateUrl: './modal-attach-witness.component.html',
  styleUrls: ['./modal-attach-witness.component.css']
})
export class ModalAttachWitnessComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;
  @Input() report_running: number;
  @Output() onClickList = new EventEmitter<any>();

  @ViewChild('word_id',{static: true}) word_id : ElementRef;
  @ViewChild('word_desc',{static: true}) word_desc : ElementRef;
  masterSelect:boolean = false;
  formList: FormGroup;
  sessData:any;
  userData:any;
  getDocTitle:any;
  result2:any = [];
  fileToUpload: File = null;
  public loadModalConfComponent = false;
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
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  
  ChildTestCmp(){
    if(this.fileToUpload)
      return this.fileToUpload;
  }

  onFileChange(e:any) {
    if(e.target.files.length){
      this.fileToUpload = e.target.files[0];
      $(e.target).parent('div').find('label').html(e.target.files[0].name);
    }
  }

}
