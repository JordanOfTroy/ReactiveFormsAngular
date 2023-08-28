import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-customer-contact-form',
  templateUrl: './customer-contact-form.component.html',
  styleUrls: ['./customer-contact-form.component.css']
})
export class CustomerContactFormComponent {

  form: FormGroup;
  fb: FormBuilder = new FormBuilder;  // we'll want to be able to access this later outside of the controller

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: [ 'Henry' ],
      lastName: [ 'Cavill' ],
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
    });
  }

  reset(): void {
    this.form.controls['firstName'].setValue('');
    this.form.controls['lastName'].setValue('');
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

  clearAllTheShit(): void {
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

}