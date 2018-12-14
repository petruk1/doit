import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../shared/validators/custom-validators';
import {FirebaseService} from '../../services/firebase.service';
import {UserAuthData} from '../interfaces';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  public registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private firebaseService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null,
        [
          Validators.required,
          CustomValidators.emailFormat
        ], [
          CustomValidators.emailAvailability(600, this.firebaseService)
        ]
      ],
      password: [null, [Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  public createAccount(data: UserAuthData): void {
     this.firebaseService.createUser(data);
  }

  public get name(): AbstractControl {
    return this.registrationForm.get('name');
  }

  public get surname(): AbstractControl {
    return this.registrationForm.get('surname');
  }

  public get email(): AbstractControl {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl {
    return this.registrationForm.get('password');
  }
}
