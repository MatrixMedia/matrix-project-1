import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateEventComponent } from './create/create.component';
import { TaskComponent } from './task/task.component';
import { TaskManagementListComponent } from './task-management-list/task-management-list.component';
import { PaymentHistoryListComponent } from './payment-history-list/payment-history-list.component';
// import { TaskManagementListComponent } from './task-management-list/task-management-list.component';
//import { EventSupplyManagementListComponent } from './event-supply-management-list/event-supply-management-list.component';

const routes: Routes = [
  {path: '',component: ListComponent},
  {path: 'list/:value',component: ListComponent},
  {path: 'add',component: CreateEventComponent },
  {path: 'edit/:id', component: CreateEventComponent},
  {path: 'create-task/:id', component: TaskComponent},
  {path: 'edit-task/:id/:taskId', component: TaskComponent},
  {path: 'task-management-list/:id', component: TaskManagementListComponent},
  {path: 'payment-history-list/:id', component: PaymentHistoryListComponent},
  {path: 'supply-management',loadChildren: () =>
    import('./supply-management/supply-management.module').then(
      (module) => module.SupplyManagementModule
    ),
  },
  {path: 'memory-management', loadChildren: () => 
    import('./memory-managemnt/memory-managemnt.module').then( 
      (module)=> module.MemoryManagemntModule
    ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
