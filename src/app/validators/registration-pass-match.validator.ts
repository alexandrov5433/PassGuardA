import { ValidatorFn } from "@angular/forms";

export function passwordMatchValadator():ValidatorFn {
    return (control) => {
        const pass = control.get('password')?.value || '';
        const rePass = control.get('rePassword')?.value || '';
        if (!pass) {
            return { 'passwordMatch': true };
        }
        return pass === rePass ? null : { 'passwordMatch': true };
    }
}