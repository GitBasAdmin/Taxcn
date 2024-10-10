import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fno0900Component } from './fno0900/fno0900.component';
import { Fno0910Component } from './fno0910/fno0910.component';
import { Fno1000Component } from './fno1000/fno1000.component';
import { Fno1800Component } from './fno1800/fno1800.component';
import { Fno2300Component } from './fno2300/fno2300.component';
import { Fno2310Component } from './fno2310/fno2310.component';
import { Fno3001Component } from './fno3001/fno3001.component';
import { Fno3100Component } from './fno3100/fno3100.component';
import { Fno9000Component } from './fno9000/fno9000.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fno0900', component: Fno0900Component ,canActivate: [AuthGuardService]},
    { path: 'fno0910', component: Fno0910Component ,canActivate: [AuthGuardService]},
    { path: 'fno1000', component: Fno1000Component ,canActivate: [AuthGuardService]},
    { path: 'fno1800', component: Fno1800Component ,canActivate: [AuthGuardService]},
    { path: 'fno2300', component: Fno2300Component ,canActivate: [AuthGuardService]},
    { path: 'fno2310', component: Fno2310Component ,canActivate: [AuthGuardService]},
    { path: 'fno3001', component: Fno3001Component ,canActivate: [AuthGuardService]},
    { path: 'fno3100', component: Fno3100Component ,canActivate: [AuthGuardService]},
    { path: 'fno9000', component: Fno9000Component ,canActivate: [AuthGuardService]}
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FnoRoutingModule { }
