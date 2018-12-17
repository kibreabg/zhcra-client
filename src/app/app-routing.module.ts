import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';
import { MedicineInformationComponent } from './medicine-information/medicine-information.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { ZhcraComponent } from './zhcra/zhcra.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ArtGuidelineComponent } from './art-guideline/art-guideline.component';
import { MemoComponent } from './memo/memo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'zhcra',
    component: ZhcraComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'quickaccesstools', component: QuickAccessToolsComponent, canActivate: [AuthGuard] },
      { path: 'guidelines', component: GuidelinesComponent, canActivate: [AuthGuard] },
      { path: 'artguidelines', component: ArtGuidelineComponent, canActivate: [AuthGuard] },
      { path: 'memos', component: MemoComponent, canActivate: [AuthGuard] },
      { path: 'medicineinformation', component: MedicineInformationComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
