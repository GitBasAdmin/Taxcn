import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { SpeechToTextRoutingModule } from '@app/speech/speech-routing.module';

import { SpeechToTextComponent } from '@app/speech/speech-to-text/speech-to-text.component';

@NgModule({
  declarations: [
    SpeechToTextComponent,
  ],
  imports: [
    CommonModule,
    SpeechToTextRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SpeechToTextModule { }