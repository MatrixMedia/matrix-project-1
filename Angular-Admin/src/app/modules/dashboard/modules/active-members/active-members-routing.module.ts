import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { TrackComponent } from './track/track.component';
const routes: Routes = [
  {path:'', component:ListComponent},
  {path:'user-role/:type', component:ListComponent},
  {path:'view/:id', component:ViewComponent},
  {path:'my-profile/:id', component:ViewComponent},
  {path:'track', component:TrackComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveMembersRoutingModule { }
