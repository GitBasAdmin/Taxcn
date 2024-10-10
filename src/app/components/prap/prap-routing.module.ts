import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prap0900Component } from './prap0900/prap0900.component';
import { Prap6600Component } from './prap6600/prap6600.component';
import { Prap4800Component } from './prap4800/prap4800.component';
import { Prap4600Component } from './prap4600/prap4600.component';
import { Prap5500Component } from './prap5500/prap5500.component';
import { Prap0700Component } from './prap0700/prap0700.component';
import { Prap3040Component } from './prap3040/prap3040.component';
import { Prap0800Component } from './prap0800/prap0800.component';
import { Prap4900Component } from './prap4900/prap4900.component';
import { Prap3000Component } from './prap3000/prap3000.component';
import { Prap4200Component } from './prap4200/prap4200.component';
import { Prap4300Component } from './prap4300/prap4300.component';
import { Prap1500Component } from './prap1500/prap1500.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'prap0900', component:Prap0900Component },
    { path: 'prap4600', component:Prap4600Component },
    { path: 'prap4800', component:Prap4800Component },
    { path: 'prap6600', component:Prap6600Component },
    { path: 'prap5500', component:Prap5500Component },
    { path: 'prap0700', component:Prap0700Component },
    { path: 'prap3040', component:Prap3040Component },
    { path: 'prap0800', component:Prap0800Component },
    { path: 'prap4900', component:Prap4900Component },
    { path: 'prap3000', component:Prap3000Component },
    { path: 'prap4200', component:Prap4200Component },
    { path: 'prap4300', component:Prap4300Component },
    { path: 'prap1500', component:Prap1500Component },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrapRoutingModule { }
