import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fkn0100Component } from './fkn0100/fkn0100.component';
import { Fkn0200Component } from './fkn0200/fkn0200.component';
import { Fkn0202Component } from './fkn0202/fkn0202.component';
import { Fkn0220Component } from './fkn0220/fkn0220.component';
import { Fkn0300Component } from './fkn0300/fkn0300.component';
import { Fkn0400Component } from './fkn0400/fkn0400.component';
import { Fkn0500Component } from './fkn0500/fkn0500.component';
import { Fkn0710Component } from './fkn0710/fkn0710.component';
import { Fkn0720Component } from './fkn0720/fkn0720.component';
import { Fkn0730Component } from './fkn0730/fkn0730.component';
import { Fkn0800Component } from './fkn0800/fkn0800.component';
import { Fkn0801Component } from './fkn0801/fkn0801.component';
import { Fkn0820Component } from './fkn0820/fkn0820.component';
import { Fkn0900Component } from './fkn0900/fkn0900.component';
import { Fkn0900PappealComponent } from './fkn0900-pappeal/fkn0900-pappeal.component';
import { Fkn0900PappointmentComponent } from './fkn0900-pappointment/fkn0900-pappointment.component';
import { Fkn0900PcaseComponent } from './fkn0900-pcase/fkn0900-pcase.component';
import { Fkn0900PcaseLitigantComponent } from './fkn0900-pcase-litigant/fkn0900-pcase-litigant.component';
import { Fkn0900PjudgementComponent } from './fkn0900-pjudgement/fkn0900-pjudgement.component';
import { Fkn0900PnoticeComponent } from './fkn0900-pnotice/fkn0900-pnotice.component';
import { Fkn0900PreceiptComponent } from './fkn0900-preceipt/fkn0900-preceipt.component';
import { Fkn0900PrequestComponent } from './fkn0900-prequest/fkn0900-prequest.component';
import { Fkn1100Component } from './fkn1100/fkn1100.component';
import { Fkn1200Component } from './fkn1200/fkn1200.component';
import { ManualIndexComponent } from './manual_index/manual_index.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fkn0100', component: Fkn0100Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0200', component: Fkn0200Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0202', component: Fkn0202Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0220', component: Fkn0220Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0300', component: Fkn0300Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0400', component: Fkn0400Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0500', component: Fkn0500Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0710', component: Fkn0710Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0720', component: Fkn0720Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0730', component: Fkn0730Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0800', component: Fkn0800Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0801', component: Fkn0801Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0820', component: Fkn0820Component ,canActivate: [AuthGuardService]},

    { path: 'fkn0900', component: Fkn0900Component ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pappeal', component: Fkn0900PappealComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pappointment', component: Fkn0900PappointmentComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pappointment', component: Fkn0900PappointmentComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pcase', component: Fkn0900PcaseComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pcase_litigant', component: Fkn0900PcaseLitigantComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pjudgement', component: Fkn0900PjudgementComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_pnotice', component: Fkn0900PnoticeComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_preceipt', component: Fkn0900PreceiptComponent ,canActivate: [AuthGuardService]},
    { path: 'fkn0900_prequest', component: Fkn0900PrequestComponent ,canActivate: [AuthGuardService]},

    { path: 'fkn1100', component: Fkn1100Component ,canActivate: [AuthGuardService]},
    { path: 'fkn1200', component: Fkn1200Component ,canActivate: [AuthGuardService]},
    { path: 'manual_index', component: ManualIndexComponent},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FknRoutingModule { }
