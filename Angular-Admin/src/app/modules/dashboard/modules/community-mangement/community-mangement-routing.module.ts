import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSettingComponent } from './global-setting/global-setting.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

const routes: Routes = [
  {path:'',component:ProfileEditComponent},
  {path:'profile-edit', component:ProfileEditComponent},
  {path:'global-setting',component:GlobalSettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityMangementRoutingModule { }
