import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserCard } from './user-card/user-card';
import { DirectiveDemoComponent } from './directive-demo/directive-demo';
import { SignalDemo } from './signal-demo/signal-demo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserCard, DirectiveDemoComponent, SignalDemo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-youtube-demo');
  message = '';
  isLoggedIn = true;
  items = ['Angular', 'Tailwind', 'YouTube'];
  role = 'admin';

  handleNotification(msg: string) {
    this.message = msg;
  }
}
