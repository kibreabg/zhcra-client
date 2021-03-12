import { Component, OnInit } from '@angular/core';
import { LoginService } from '../feature/auth/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zhcra',
  templateUrl: './zhcra.component.html',
  styleUrls: ['./zhcra.component.css']
})
export class ZhcraComponent implements OnInit {

  titleHead = 'ZHCRA';
  titleTail = 'Portal';
  username = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginService.getUser().subscribe(user => {
      this.username = user.username;
    });
  }

  logout() {
    return this.loginService.logout().subscribe(message => {
      localStorage.removeItem('token');
      this.router.navigate(['/auth']);
    });
  }

}
