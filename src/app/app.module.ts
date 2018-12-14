import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {environment} from '../environments/environment';
import {MapComponent} from './map/map.component';
import {AboutAuthorComponent} from './about-author/about-author.component';
import {AuthGuard} from './guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '', redirectTo: '/map', pathMatch: 'full',
  },
  {
    path: 'map', component: MapComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'about-author', component: AboutAuthorComponent
      }
    ]
  },
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
    AngularFireDatabaseModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
