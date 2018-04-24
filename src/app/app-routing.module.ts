import { NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResComponent } from "./components/res/res.component";
import { ResHomeComponent } from "./components/res/res-home.component";
import { LoginComponent } from "./components/user/login.component";
import { ProfileComponent } from "./components/user/profile.component";
import { RedirectComponent } from "./components/base/redirect.component";
import { OauthComponent } from "./components/user/oauth.component";

const routes: Routes = [
  // { path: '', component: LoginComponent},
  { path: 's/:res_str_id', component: RedirectComponent},
  { path: 'user/profile/next/:next', component: ProfileComponent},
  { path: 'user/profile', component: ProfileComponent},
  // { path: 'user/:mode/next/:next', component: LoginComponent},
  // { path: 'user/:mode', component: LoginComponent},
  { path: 'res', component: ResHomeComponent},
  { path: 'res/:slug', component: ResComponent},
  { path: 'oauth/qtb/callback', component: OauthComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
