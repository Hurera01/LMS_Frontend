import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzOptionModule } from 'ng-zorro-antd/core/option';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
        NzButtonModule,
        NzCheckboxModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        CommonModule,
        RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  roles = [
    { label: 'Admin', value: 0 },
    { label: 'Librarian', value: 1 },
    { label: 'Student', value: 2 }
  ];


  constructor(private authService: AuthService, private router: Router) {}

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    role: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // confirmPassword: ['', [Validators.required]]
  });

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log('Registration successful', res);
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Registration error', err);
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
