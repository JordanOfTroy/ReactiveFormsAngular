import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-customer-contact-form',
  templateUrl: './customer-contact-form.component.html',
  styleUrls: ['./customer-contact-form.component.css']
})
export class CustomerContactFormComponent {

  form: FormGroup;
  fb: FormBuilder = new FormBuilder;  // we'll want to be able to access this later outside of the controller
  customErrorStateMatcher: ErrorStateMatcher = new CustomErrorStateMatcher();

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: [ 'Henry', Validators.compose([ Validators.required, this.forbiddenNameValidator() ]) ],
      lastName: [ 'Cavill', Validators.required ],
      email: ['Henry@Cavill.com', Validators.compose([ Validators.required, Validators.email ])],
      phoneNumbers: fb.array([
        fb.group({
        alias: ['Home'],
        number: ['555-555-5555']
      }),
        fb.group({
        alias: ['Mobile'],
        number: ['555-555-0000']
      }),
        fb.group({
        alias: ['Office'],
        number: ['555-555-1234']
      }),
    ]),
      address: fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      })
    }, { validator: this.forbiddenFullNameValidator })
  }

  reset(): void {
    this.form.controls['firstName'].setValue('');
    this.form.controls['lastName'].setValue('');
    this.form.controls['email'].setValue('');
  }

  fillDefaultAddress(): void {
    this.form.patchValue({
      address: {
        street: '6969 DILF Drive',
        city: 'Daddy Town',
        state: 'CA',
        zip: '90000',
      }
    });
  }

  clearAllTheShiz(): void {
    this.form.patchValue({
      firstName: '',
      lastName: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
      }
    })
  }

  get phoneNumbers(): FormArray {
    return this.form.get('phoneNumbers') as FormArray;
  }

  addPhone(): void {
    this.phoneNumbers.push(this.fb.group({
      alias: [''],
      number: ['']
    }));
  }

  resetAll(): void {
    this.form.reset()
  }

  // Custom Validator
  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = new RegExp(/donald/i).test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }
  
  //cross field validation
  forbiddenFullNameValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const firstName = control.get('firstName').value;
    const lastName = control.get('lastName').value;
    const fullName = `${ firstName } ${ lastName }`;
    const forbidden = new RegExp(/^mickey mouse$/i).test(fullName);
    return forbidden ? { 'forbiddenFullName': { value: fullName } } : null;
  }

}

class CustomErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl, form: FormGroupDirective): boolean {
    return form.getError('forbiddenFullName') || control.invalid;
  }

}