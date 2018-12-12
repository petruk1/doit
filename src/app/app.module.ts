import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {environment} from '../environments/environment';
import {AuthModule} from './auth/auth.module';
import {MapComponent} from './map/map.component';
import {AboutAuthorComponent} from './about-author/about-author.component';
import {AuthGuard} from './guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: '', redirectTo: '/map', pathMatch: 'full',
  }, {
    path: 'map', component: MapComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AboutAuthorComponent

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AuthModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
