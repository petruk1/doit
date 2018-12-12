import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {map, take, tap} from 'rxjs/internal/operators';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.auth.user.pipe(
      take(1),
      map((user: User) => !!user),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
