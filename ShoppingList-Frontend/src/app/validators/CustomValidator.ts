import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class CustomValidator {
  static validatePasswordEqual(controlName: string, controlName2: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const control2 = controls.get(controlName2);

      if (control?.value !== control2?.value) {
        controls.get(controlName2)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
