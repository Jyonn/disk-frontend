import { NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResComponent } from "./res.component";
import {ResHomeComponent} from "./res-home.component";

const routes: Routes = [
  { path: 'res', component: ResHomeComponent},
  { path: 'res/:slug', component: ResComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
