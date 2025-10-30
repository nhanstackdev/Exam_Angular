import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './pages/test/test.component';
import { HomeComponent } from './pages/home/home.component';
import {TableComponent} from "./pages/table/table.component";
import { ToastComponent } from './pages/toast/toast.component';

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  {path: "table", component: TableComponent },
  { path: "toast", component: ToastComponent },
  { path: "test", component: TestComponent },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
