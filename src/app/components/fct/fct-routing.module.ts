import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fct0218Component } from './fct0218/fct0218.component';
import { Fct9993Component } from './fct9993/fct9993.component';
import { Fct9994Component } from './fct9994/fct9994.component';
import { Fct0226Component } from './fct0226/fct0226.component';
import { Fct0227Component } from './fct0227/fct0227.component';
import { Fct9908Component } from './fct9908/fct9908.component';
import { Fct9905Component } from './fct9905/fct9905.component';
import { Fct9906Component } from './fct9906/fct9906.component';
import { Fct9996Component } from './fct9996/fct9996.component';
import { Fct9992Component } from './fct9992/fct9992.component';
import { Fct0242Component } from './fct0242/fct0242.component';
import { Fct0232Component } from './fct0232/fct0232.component';
import { Fct0412Component } from './fct0412/fct0412.component';
import { Fct0418Component } from './fct0418/fct0418.component';
import { Fct0220Component } from './fct0220/fct0220.component';
import { Fct0416Component } from './fct0416/fct0416.component';
import { Fct0230Component } from './fct0230/fct0230.component';
import { Fct0231Component } from './fct0231/fct0231.component';
import { Fct0246Component } from './fct0246/fct0246.component';
import { Fct0202Component } from './fct0202/fct0202.component';
import { Fct0203Component } from './fct0203/fct0203.component';
import { Fct0305Component } from './fct0305/fct0305.component';
import { Fct0301Component } from './fct0301/fct0301.component';
import { Fct0302Component } from './fct0302/fct0302.component';
import { Fct0313Component } from './fct0313/fct0313.component';
import { Fct0314Component } from './fct0314/fct0314.component';
import { Fct0317Component } from './fct0317/fct0317.component';
import { Fct0801Component } from './fct0801/fct0801.component';
import { Fct0805Component } from './fct0805/fct0805.component';
import { Fct0811Component } from './fct0811/fct0811.component';
import { Fct0812Component } from './fct0812/fct0812.component';
import { Fct0110Component } from './fct0110/fct0110.component';
import { Fct0208Component } from './fct0208/fct0208.component';
import { Fct0209Component } from './fct0209/fct0209.component';
import { Fct0318Component } from './fct0318/fct0318.component';
import { Fct0404Component } from './fct0404/fct0404.component';
import { Fct0405Component } from './fct0405/fct0405.component';
import { Fct0421Component } from './fct0421/fct0421.component';
import { Fct0425Component } from './fct0425/fct0425.component';
import { Fct0430Component } from './fct0430/fct0430.component';
import { Fct0434Component } from './fct0434/fct0434.component';
import { Fct0435Component } from './fct0435/fct0435.component';
import { Fct0437Component } from './fct0437/fct0437.component';
import { Fct0444Component } from './fct0444/fct0444.component';
import { Fct0445Component } from './fct0445/fct0445.component';
import { Fct0508Component } from './fct0508/fct0508.component';
import { Fct0509Component } from './fct0509/fct0509.component';
import { Fct0601Component } from './fct0601/fct0601.component';
import { Fct0707Component } from './fct0707/fct0707.component';
import { Fct0225Component } from './fct0225/fct0225.component';
import { Fct0223Component } from './fct0223/fct0223.component';
import { Fct0210Component } from './fct0210/fct0210.component';
import { Fct0229Component } from './fct0229/fct0229.component';
import { Fct0502Component } from './fct0502/fct0502.component';
import { Fct0503Component } from './fct0503/fct0503.component';
import { Fct0108Component } from './fct0108/fct0108.component';
import { Fct0204Component } from './fct0204/fct0204.component';
import { Fct0510Component } from './fct0510/fct0510.component';
import { Fct0511Component } from './fct0511/fct0511.component';
import { Fct0504Component } from './fct0504/fct0504.component';
import { Fct0710Component } from './fct0710/fct0710.component';
import { Fct0711Component } from './fct0711/fct0711.component';
import { Fct0411Component } from './fct0411/fct0411.component';
import { Fct9903Component } from './fct9903/fct9903.component';
import { Fct9907Component } from './fct9907/fct9907.component';
import { Fct9909Component } from './fct9909/fct9909.component';
import { Fct0219Component } from './fct0219/fct0219.component';
import { Fct6800Component } from './fct6800/fct6800.component';
import { Fct0701Component } from './fct0701/fct0701.component';
import { Fct4102Component } from './fct4102/fct4102.component';
import { Fct0709Component } from './fct0709/fct0709.component';
import { Fct0228Component } from './fct0228/fct0228.component';
import { Fct0201Component } from './fct0201/fct0201.component';
import { Fct0211Component } from './fct0211/fct0211.component';
import { Fct0212Component } from './fct0212/fct0212.component';
import { Fct0213Component } from './fct0213/fct0213.component';
import { Fct0240Component } from './fct0240/fct0240.component';
import { Fct0410Component } from './fct0410/fct0410.component';
import { Fct0501Component } from './fct0501/fct0501.component';
import { Fct0205Component } from './fct0205/fct0205.component';
import { Fct0206Component } from './fct0206/fct0206.component';
import { Fct0207Component } from './fct0207/fct0207.component';
import { Fct0234Component } from './fct0234/fct0234.component';
import { Fct0235Component } from './fct0235/fct0235.component';
import { Fct0237Component } from './fct0237/fct0237.component';
import { Fct0320Component } from './fct0320/fct0320.component';
import { Fct0450Component } from './fct0450/fct0450.component';
import { Fct0803Component } from './fct0803/fct0803.component';
import { Fct0804Component } from './fct0804/fct0804.component';
import { Fct0813Component } from './fct0813/fct0813.component';
import { Fct0109Component } from './fct0109/fct0109.component';
import { Fct0406Component } from './fct0406/fct0406.component';
import { Fct0407Component } from './fct0407/fct0407.component';
import { Fct0443Component } from './fct0443/fct0443.component';
import { Fct0417Component } from './fct0417/fct0417.component';
import { Fct0401Component } from './fct0401/fct0401.component';
import { Fct0101Component } from './fct0101/fct0101.component';
import { Fct0713Component } from './fct0713/fct0713.component';
import { Fct0902Component } from './fct0902/fct0902.component';
import { Fct0904Component } from './fct0904/fct0904.component';
import { Fct0907Component } from './fct0907/fct0907.component';
import { Fct4002Component } from './fct4002/fct4002.component';
import { Fct0807Component } from './fct0807/fct0807.component';
import { Fct9988Component } from './fct9988/fct9988.component';
import { Fct9916Component } from './fct9916/fct9916.component';
import { Fct0461Component } from './fct0461/fct0461.component';
import { Fct0304Component } from './fct0304/fct0304.component';
import { Fct9901Component } from './fct9901/fct9901.component';
import { Fct9902Component } from './fct9902/fct9902.component';
import { Fct0423Component } from './fct0423/fct0423.component';
import { Fct0702Component } from './fct0702/fct0702.component';
import { Fct9991Component } from './fct9991/fct9991.component';
import { Fct0706Component } from './fct0706/fct0706.component';
import { Fct0426Component } from './fct0426/fct0426.component';
import { Fct0409Component } from './fct0409/fct0409.component';
import { Fct0505Component } from './fct0505/fct0505.component';
import { Fct9910Component } from './fct9910/fct9910.component';
import { Fct0315Component } from './fct0315/fct0315.component';
import { Fct0316Component } from './fct0316/fct0316.component';
import { Fct9987Component } from './fct9987/fct9987.component';
import { Fct9985Component } from './fct9985/fct9985.component';
import { Fct9986Component } from './fct9986/fct9986.component';
import { Fct0214Component } from './fct0214/fct0214.component';
import { Fct0215Component } from './fct0215/fct0215.component';
import { Fct9995Component } from './fct9995/fct9995.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fct0218', component: Fct0218Component ,canActivate: [AuthGuardService]},
  { path: 'fct9993', component: Fct9993Component ,canActivate: [AuthGuardService]},
  { path: 'fct9994', component: Fct9994Component ,canActivate: [AuthGuardService]},
  { path: 'fct0226', component: Fct0226Component ,canActivate: [AuthGuardService]},
  { path: 'fct0227', component: Fct0227Component ,canActivate: [AuthGuardService]},
  { path: 'fct9908', component: Fct9908Component ,canActivate: [AuthGuardService]},
  { path: 'fct9905', component: Fct9905Component ,canActivate: [AuthGuardService]},
  { path: 'fct9906', component: Fct9906Component ,canActivate: [AuthGuardService]},
  { path: 'fct9996', component: Fct9996Component ,canActivate: [AuthGuardService]},
  { path: 'fct9992', component: Fct9992Component ,canActivate: [AuthGuardService]},
  { path: 'fct0242', component: Fct0242Component ,canActivate: [AuthGuardService]},
  { path: 'fct0232', component: Fct0232Component ,canActivate: [AuthGuardService]},
  { path: 'fct0412', component: Fct0412Component ,canActivate: [AuthGuardService]},
  { path: 'fct0418', component: Fct0418Component ,canActivate: [AuthGuardService]},
  { path: 'fct0220', component: Fct0220Component ,canActivate: [AuthGuardService]},
  { path: 'fct0416', component: Fct0416Component ,canActivate: [AuthGuardService]},
  { path: 'fct0220', component: Fct0220Component ,canActivate: [AuthGuardService]},
  { path: 'fct0230', component: Fct0230Component ,canActivate: [AuthGuardService]},
  { path: 'fct0231', component: Fct0231Component ,canActivate: [AuthGuardService]},
  { path: 'fct0246', component: Fct0246Component ,canActivate: [AuthGuardService]},
  { path: 'fct0426', component: Fct0426Component ,canActivate: [AuthGuardService]},
  { path: 'fct0202', component: Fct0202Component ,canActivate: [AuthGuardService]},
  { path: 'fct0203', component: Fct0203Component ,canActivate: [AuthGuardService]},
  { path: 'fct0305', component: Fct0305Component ,canActivate: [AuthGuardService]},
  { path: 'fct0301', component: Fct0301Component ,canActivate: [AuthGuardService]},
  { path: 'fct0302', component: Fct0302Component ,canActivate: [AuthGuardService]},
  { path: 'fct0313', component: Fct0313Component ,canActivate: [AuthGuardService]},
  { path: 'fct0314', component: Fct0314Component ,canActivate: [AuthGuardService]},
  { path: 'fct0317', component: Fct0317Component ,canActivate: [AuthGuardService]},
  { path: 'fct0801', component: Fct0801Component ,canActivate: [AuthGuardService]},
  { path: 'fct0805', component: Fct0805Component ,canActivate: [AuthGuardService]},
  { path: 'fct0811', component: Fct0811Component ,canActivate: [AuthGuardService]},
  { path: 'fct0812', component: Fct0812Component ,canActivate: [AuthGuardService]},
  { path: 'fct0110', component: Fct0110Component ,canActivate: [AuthGuardService]},
  { path: 'fct0208', component: Fct0208Component ,canActivate: [AuthGuardService]},
  { path: 'fct0209', component: Fct0209Component ,canActivate: [AuthGuardService]},
  { path: 'fct0318', component: Fct0318Component ,canActivate: [AuthGuardService]},
  { path: 'fct0404', component: Fct0404Component ,canActivate: [AuthGuardService]},
  { path: 'fct0405', component: Fct0405Component ,canActivate: [AuthGuardService]},
  { path: 'fct0421', component: Fct0421Component ,canActivate: [AuthGuardService]},
  { path: 'fct0425', component: Fct0425Component ,canActivate: [AuthGuardService]},
  { path: 'fct0430', component: Fct0430Component ,canActivate: [AuthGuardService]},
  { path: 'fct0434', component: Fct0434Component ,canActivate: [AuthGuardService]},
  { path: 'fct0435', component: Fct0435Component ,canActivate: [AuthGuardService]},
  { path: 'fct0437', component: Fct0437Component ,canActivate: [AuthGuardService]},
  { path: 'fct0444', component: Fct0444Component ,canActivate: [AuthGuardService]},
  { path: 'fct0445', component: Fct0445Component ,canActivate: [AuthGuardService]},
  { path: 'fct0508', component: Fct0508Component ,canActivate: [AuthGuardService]},
  { path: 'fct0509', component: Fct0509Component ,canActivate: [AuthGuardService]},
  { path: 'fct0601', component: Fct0601Component ,canActivate: [AuthGuardService]},
  { path: 'fct0707', component: Fct0707Component ,canActivate: [AuthGuardService]},
  { path: 'fct0225', component: Fct0225Component ,canActivate: [AuthGuardService]},
  { path: 'fct0223', component: Fct0223Component ,canActivate: [AuthGuardService]},
  { path: 'fct0210', component: Fct0210Component ,canActivate: [AuthGuardService]},
  { path: 'fct0219', component: Fct0219Component ,canActivate: [AuthGuardService]},
  { path: 'fct0229', component: Fct0229Component ,canActivate: [AuthGuardService]},
  { path: 'fct0502', component: Fct0502Component ,canActivate: [AuthGuardService]},
  { path: 'fct0503', component: Fct0503Component ,canActivate: [AuthGuardService]},
  { path: 'fct0108', component: Fct0108Component ,canActivate: [AuthGuardService]},
  { path: 'fct0204', component: Fct0204Component ,canActivate: [AuthGuardService]},
  { path: 'fct0510', component: Fct0510Component ,canActivate: [AuthGuardService]},
  { path: 'fct0511', component: Fct0511Component ,canActivate: [AuthGuardService]},
  { path: 'fct0504', component: Fct0504Component ,canActivate: [AuthGuardService]},
  { path: 'fct0710', component: Fct0710Component ,canActivate: [AuthGuardService]},
  { path: 'fct0711', component: Fct0711Component ,canActivate: [AuthGuardService]},
  { path: 'fct0411', component: Fct0411Component ,canActivate: [AuthGuardService]},
  { path: 'fct9903', component: Fct9903Component ,canActivate: [AuthGuardService]},
  { path: 'fct9907', component: Fct9907Component ,canActivate: [AuthGuardService]},
  { path: 'fct9909', component: Fct9909Component ,canActivate: [AuthGuardService]},
  { path: 'fct6800', component: Fct6800Component ,canActivate: [AuthGuardService]},
  { path: 'fct0701', component: Fct0701Component ,canActivate: [AuthGuardService]},
  { path: 'fct4102', component: Fct4102Component ,canActivate: [AuthGuardService]},
  { path: 'fct0709', component: Fct0709Component ,canActivate: [AuthGuardService]},
  { path: 'fct0228', component: Fct0228Component ,canActivate: [AuthGuardService]},
  { path: 'fct0211', component: Fct0211Component ,canActivate: [AuthGuardService]},
  { path: 'fct0212', component: Fct0212Component ,canActivate: [AuthGuardService]},
  { path: 'fct0213', component: Fct0213Component ,canActivate: [AuthGuardService]},
  { path: 'fct0240', component: Fct0240Component ,canActivate: [AuthGuardService]},
  { path: 'fct0410', component: Fct0410Component ,canActivate: [AuthGuardService]},
  { path: 'fct0501', component: Fct0501Component ,canActivate: [AuthGuardService]},
  { path: 'fct0201', component: Fct0201Component ,canActivate: [AuthGuardService]},
  { path: 'fct0205', component: Fct0205Component ,canActivate: [AuthGuardService]},
  { path: 'fct0206', component: Fct0206Component ,canActivate: [AuthGuardService]},
  { path: 'fct0207', component: Fct0207Component ,canActivate: [AuthGuardService]},
  { path: 'fct0234', component: Fct0234Component ,canActivate: [AuthGuardService]},
  { path: 'fct0235', component: Fct0235Component ,canActivate: [AuthGuardService]},
  { path: 'fct0237', component: Fct0237Component ,canActivate: [AuthGuardService]},
  { path: 'fct0320', component: Fct0320Component ,canActivate: [AuthGuardService]},
  { path: 'fct0450', component: Fct0450Component ,canActivate: [AuthGuardService]},
  { path: 'fct0803', component: Fct0803Component ,canActivate: [AuthGuardService]},
  { path: 'fct0804', component: Fct0804Component ,canActivate: [AuthGuardService]},
  { path: 'fct0813', component: Fct0813Component ,canActivate: [AuthGuardService]},
  { path: 'fct0109', component: Fct0109Component ,canActivate: [AuthGuardService]},
  { path: 'fct0406', component: Fct0406Component ,canActivate: [AuthGuardService]},
  { path: 'fct0407', component: Fct0407Component ,canActivate: [AuthGuardService]},
  { path: 'fct0443', component: Fct0443Component ,canActivate: [AuthGuardService]},
  { path: 'fct0417', component: Fct0417Component ,canActivate: [AuthGuardService]},
  { path: 'fct0401', component: Fct0401Component ,canActivate: [AuthGuardService]},
  { path: 'fct0101', component: Fct0101Component ,canActivate: [AuthGuardService]},
  { path: 'fct0713', component: Fct0713Component ,canActivate: [AuthGuardService]},
  { path: 'fct0902', component: Fct0902Component ,canActivate: [AuthGuardService]},
  { path: 'fct0904', component: Fct0904Component ,canActivate: [AuthGuardService]},
  { path: 'fct0907', component: Fct0907Component ,canActivate: [AuthGuardService]},
  { path: 'fct4002', component: Fct4002Component ,canActivate: [AuthGuardService]},
  { path: 'fct0807', component: Fct0807Component ,canActivate: [AuthGuardService]},
  { path: 'fct9988', component: Fct9988Component ,canActivate: [AuthGuardService]},
  { path: 'fct9916', component: Fct9916Component ,canActivate: [AuthGuardService]},
  { path: 'fct0461', component: Fct0461Component ,canActivate: [AuthGuardService]},
  { path: 'fct0304', component: Fct0304Component ,canActivate: [AuthGuardService]},
  { path: 'fct9902', component:Fct9902Component,canActivate: [AuthGuardService]},
  { path: 'fct9901', component:Fct9901Component,canActivate: [AuthGuardService]},
  { path: 'fct0423', component:Fct0423Component,canActivate: [AuthGuardService]},
  { path: 'fct0702', component:Fct0702Component,canActivate: [AuthGuardService]},
  { path: 'fct9991', component:Fct9991Component,canActivate: [AuthGuardService]},
  { path: 'fct0706', component:Fct0706Component,canActivate: [AuthGuardService]},
  { path: 'fct0426', component:Fct0426Component,canActivate: [AuthGuardService]},
  { path: 'fct0409', component:Fct0409Component,canActivate: [AuthGuardService]},
  { path: 'fct0505', component: Fct0505Component,canActivate: [AuthGuardService]},
  { path: 'fct9910', component: Fct9910Component ,canActivate: [AuthGuardService]},
  { path: 'fct0315', component: Fct0315Component ,canActivate: [AuthGuardService]},
  { path: 'fct0316', component: Fct0316Component ,canActivate: [AuthGuardService]},
  { path: 'fct9985', component: Fct9985Component ,canActivate: [AuthGuardService]},
  { path: 'fct9986', component: Fct9986Component ,canActivate: [AuthGuardService]},
  { path: 'fct9987', component: Fct9987Component ,canActivate: [AuthGuardService]},
  { path: 'fct0214', component: Fct0214Component ,canActivate: [AuthGuardService]},
  { path: 'fct0215', component: Fct0215Component ,canActivate: [AuthGuardService]},
  { path: 'fct9995', component: Fct9995Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FctRoutingModule { }
