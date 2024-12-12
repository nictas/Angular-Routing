import { Component } from '@angular/core';

@Component({
  selector: 'pm-home',
  templateUrl: './welcome.component.html',
  standalone: false
})
export class WelcomeComponent {
  public pageTitle = 'Welcome';
}
