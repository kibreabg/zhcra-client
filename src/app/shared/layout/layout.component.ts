import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/feature/auth/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  titleHead = 'ZCRA';
  titleTail = 'Portal';
  username = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
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
