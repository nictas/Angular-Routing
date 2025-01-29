import { Component } from '@angular/core';

import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { slideInAnimation } from './app.animation';
import { AuthService } from './user/auth.service';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation],
  standalone: false
})
export class AppComponent {
  pageTitle = 'Acme Product Management';
  isLoading = false;

  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService) {
    this.router.events.subscribe((event: Event) => {
      this.reactToRoutingEvent(event);
    });
  }

  reactToRoutingEvent(event: Event) {
    if (event instanceof NavigationStart) {
      this.isLoading = true;
    } else if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
      this.isLoading = false;
    }
  }

  displayMessages(): void {
    this.router.navigate([{ outlets: { popup: ['messages'] } }]);
    this.messageService.isDisplayed = true;
  }

  hideMessages(): void {
    this.messageService.isDisplayed = false;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
    console.log('Log out');
  }
}
