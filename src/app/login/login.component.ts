import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(private loginService: LoginService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

  }

  login() {
    return this.loginService.login(this.user).subscribe( authCheck => {
      localStorage.setItem('token', authCheck.access_token);
      this.router.navigate(['/zhcra/guidelines']);
    } );
  }
}
