import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {UserAuthData} from '../auth/interfaces';
import {AngularFireDatabase} from 'angularfire2/database';
import {Point} from '../classes';
import Reference = firebase.database.Reference;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _authError: any;
  private userId: string;

  constructor(private fireAuth: AngularFireAuth,
              private fireDatabase: AngularFireDatabase,
              private router: Router) {
    this.detectUserAuthChanges();
  }

  private detectUserAuthChanges() {
    this.fireAuth.authState.subscribe((user: User) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  public get authError(): any {
    return this._authError;
  }

  public set authError(error: any) {
    this._authError = error;
  }

  public login(data: UserAuthData): void {
    const {email, password} = data;
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this._authError = null;
        this.router.navigate(['/map']);
      })
      .catch((err: any) => this.authError = err);
  }

  public logout(): void {
    this.fireAuth.auth.signOut().catch((err: any) => alert(`Something went wrong: ${err}`));
  }

  public isEmailAvailable(email: string): Promise<any> {
    return this.fireAuth.auth.fetchSignInMethodsForEmail(email);
  }

  public createUser(data: UserAuthData): void {
    const {email, password, name, surname} = data;
    this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.login(data);
        this.fireAuth.auth.currentUser
          .updateProfile({displayName: `${name} ${surname}`, photoURL: null})
          .catch((err: any) => alert(`For a some reason cannot update user profile: ${err}`));
      })
      .catch((err: any) => alert(`Something went wrong: ${err}`));
  }

  public savePointsOnServer(points: Point[]): void {
    points.forEach((point: Point) => {
      this.fireDatabase.database.ref(`${this.userId}/points`).push(point);
    });
  }

  public loadPointsFromServer(): Reference {
    return this.fireDatabase.database.ref(`${this.userId}/points`);
  }
}
