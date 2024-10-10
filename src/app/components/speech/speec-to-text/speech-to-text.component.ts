import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef,AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from '@app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';
//import { SpeechClient } from '@google-cloud/speech';
//import { SpeechClient } from '@google-cloud/speech';
// Instantiates a client
declare var myExtObject: any;
@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css']
})
export class SpeechToTextComponent implements AfterContentInit,OnInit {

  mySpeech: any;
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    public activeModal:NgbActiveModal,
    private authService: AuthService,
    private elRef:ElementRef
  ) { 
    
  }

  ngOnInit(): void {
    //this.elRef.nativeElement.querySelector('.voice-control').addEventListener("click", event =>  {
      myExtObject.setUpVoice();
    //});
  }
  ngAfterContentInit() : void{
   
  }

  OnSubmit() {
    const isRecord=document.querySelector('.voice-control').classList.contains('pause');
    if(isRecord){
      myExtObject.recordVoice();
    }

    setTimeout(() => {
      this.activeModal.close(this.elRef.nativeElement.querySelector('.message').value);
    }, 200);
    
}
  
}
