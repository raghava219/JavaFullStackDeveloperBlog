import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  //imports: [],
  //templateUrl: './auth-button-component.component.html',
  template: '<button (click)="auth.loginWithRedirect()">Log in</button>',
  styleUrl: './auth-button-component.component.css'
})  
export class AuthButtonComponentComponent {
  constructor(public auth: AuthService) {}

}
