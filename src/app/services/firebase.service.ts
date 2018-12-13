import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {UserAuthData} from '../auth/interfaces';
import {AngularFireDatabase} from 'angularfire2/database'
import {Point} from '../classes';
import {Observable} from 'rxjs/index';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _authError: object;
  private userId: string;
  public points$: Observable<Point[]>;

  constructor(private fireAuth: AngularFireAuth,
              private fireDatabase: AngularFireDatabase,
              private router: Router) {
    this.fireAuth.authState.subscribe((user: User) => {
      if (user) {
        this.userId = user.uid;
      }
    });

  }

  public get authError(): object {
    return this._authError;
  }

  public set authError(error: object) {
    this._authError = error;
  }

  public login(data: UserAuthData): void {
    const {email, password} = data;
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this._authError = null;
        this.router.navigate(['/map']);
      })
      .catch((err: object) => this.authError = err);
  }

  public isEmailAvailable(email: string): Promise<any> {
    return this.fireAuth.auth.fetchSignInMethodsForEmail(email);
  }

  public createUser(data: UserAuthData): void {
    const {email, password, name, surname} = data;
    this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.login(data))
      .then(() => this.fireAuth.auth.currentUser
        .updateProfile({displayName: `${name} ${surname}`, photoURL: null}));
  }

  public savePointsOnServer(points: Point[]): void {
    points.forEach((point: Point) => {
      this.fireDatabase.database.ref(`${this.userId}/points`).push(point);
    });
  }

  public loadPointsFromServer(): Promise<DataSnapshot> {
    return this.fireDatabase.database.ref(`${this.userId}/points`)
      .once('value', (data: DataSnapshot) => {

      });
  }
}
