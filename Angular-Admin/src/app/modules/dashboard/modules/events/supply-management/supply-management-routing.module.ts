import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {path:'list/:id', component:ListComponent},
  {path:'create-supplier/:id',component: CreateComponent},
  {path:'edit-supplier/:id/:supplierId',component: CreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyManagementRoutingModule { }
