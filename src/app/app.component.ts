import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  titleHead = 'ZIMBABWE CLINICAL RESOURCES';
  titleTail = 'PORTAL';

  constructor() { }

  ngOnInit(): void {

  }

}
