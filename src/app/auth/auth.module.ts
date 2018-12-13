import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {AuthComponent} from './auth.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

const AUTH_ROUTES: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
      {path: 'sign-in', component: LoginFormComponent},
      {path: 'sign-up', component: RegistrationFormComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(AUTH_ROUTES)
  ],
  declarations: [
    AuthComponent,
    LoginFormComponent,
    RegistrationFormComponent
  ],
  exports: [RouterModule]
})
export class AuthModule {
}
