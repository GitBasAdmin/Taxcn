import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

import { SpeechToTextComponent } from '@app/speech/speech-to-text/speech-to-text.component';

const routes: Routes = [
  Shell.childRoutes([ {
     path: 'speech-to-text', component: SpeechToTextComponent ,
  }])
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeechToTextRoutingModule { }
