import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { passwordMissMatchValidator } from '../../shared/passwordmissmatch.directive';
import { AuthService } from '../../services/auth.service';
import { RegisterPostData } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private registerService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
    number: new FormControl('', [Validators.required, Validators.pattern(/^\+355(6[7-9]\d{7}|4\d{7})$/)]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required])
  },{
    validators: passwordMissMatchValidator
  });

  onRegister(){
    const postData = {...this.registerForm.value};
    delete postData.confirmpassword;
    this.registerService.registerUser(postData as RegisterPostData).subscribe({
      next: (response) =>{
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registered successfully'
        })
        this.router.navigate(['login']);
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ja ke fut kot'
        })
      }
    });
  }
  get fullName(){
    return this.registerForm.controls['fullName'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }

  get number(){
    return this.registerForm.controls['number'];
  }

  get password(){
    return this.registerForm.controls['password'];
  }

  get confirmpassword(){
    return this.registerForm.controls['confirmpassword'];
  }
}
