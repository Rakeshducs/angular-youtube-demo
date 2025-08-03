import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalDemo } from './signal-demo/signal-demo';
import { SignalDemoParent } from './signal-input-output-demo/signal-demo-parent';

@Component({
  selector: 'app-root',
  imports: [CommonModule, SignalDemo, SignalDemoParent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-youtube-demo');
  message = '';
  isLoggedIn = true;
  items = ['Angular', 'Tailwind', 'YouTube'];
  role = 'admin';

  // Active tab signal for navigation
  activeTab = signal('signals');

  handleNotification(msg: string) {
    this.message = msg;
  }
}
