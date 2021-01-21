import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mobi7front';
  constructor() {}

  ngOnInit() {}

  getActiveNav(path: string) {
    if (location.pathname.includes(path)) {
      return true;
    }
    return false;
  }
}
