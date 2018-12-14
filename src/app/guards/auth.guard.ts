import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {first, map, tap} from 'rxjs/internal/operators';
import {User} from 'firebase';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.auth.user.pipe(
      first(),
      map((user: User) => !!user),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
