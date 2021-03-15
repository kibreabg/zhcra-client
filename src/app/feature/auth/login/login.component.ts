import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../../../core/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  user = new User();

  constructor(private loginService: LoginService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

  }

  login() {
    this.user.username = this.form.get('username').value;
    this.user.password = this.form.get('password').value;

    return this.loginService.login(this.user).subscribe(
      response => {
        localStorage.setItem('token', response.accessToken);
        this.router.navigate(['/guidelines']);
      },
      error => {
        console.log('HTTP Error: ', error);
      });
  }
}
