import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prfn6000Component } from './prfn6000/prfn6000.component';
import { Prfn6200Component } from './prfn6200/prfn6200.component';
import { Prfn6400Component } from './prfn6400/prfn6400.component';
import { Prfn6500Component } from './prfn6500/prfn6500.component';
import { Prfn7410Component } from './prfn7410/prfn7410.component';
import { Prfn7420Component } from './prfn7420/prfn7420.component';
import { Prfn7430Component } from './prfn7430/prfn7430.component';
import { Prfn7440Component } from './prfn7440/prfn7440.component';
import { Prfn7450Component } from './prfn7450/prfn7450.component';
import { Prfn7460Component } from './prfn7460/prfn7460.component';
import { Prfn7470Component } from './prfn7470/prfn7470.component';
import { Prfn1200Component } from './prfn1200/prfn1200.component';
import { Prfn6100Component } from './prfn6100/prfn6100.component';
import { Prfn7200Component } from './prfn7200/prfn7200.component';
import { Prfn7300Component } from './prfn7300/prfn7300.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'prfn6000', component:Prfn6000Component },
  { path: 'prfn6200', component:Prfn6200Component },
  { path: 'prfn6400', component:Prfn6400Component },
  { path: 'prfn6500', component:Prfn6500Component },
  { path: 'prfn7410', component:Prfn7410Component },
  { path: 'prfn7420', component:Prfn7420Component },
  { path: 'prfn7430', component:Prfn7430Component },
  { path: 'prfn7440', component:Prfn7440Component },
  { path: 'prfn7450', component:Prfn7450Component },
  { path: 'prfn7460', component:Prfn7460Component },
  { path: 'prfn7470', component:Prfn7470Component },
  { path: 'prfn1200', component:Prfn1200Component },
  { path: 'prfn6100', component:Prfn6100Component },
  { path: 'prfn7200', component:Prfn7200Component },
  { path: 'prfn7300', component:Prfn7300Component },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrfnRoutingModule { }
