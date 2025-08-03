import {
  Component,
  EventEmitter,
  Input,
  Output,
  input,
  output,
  model,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  // Old approach with @Input/@Output decorators
  userName = 'Kunaljit Nath';
  userAge = 28;
  @Input() userData: any;
  @Output() notify = new EventEmitter<string>();

  // New signal-based approach
  // Input signals
  signalUserName = input('Default User');
  signalUserAge = input(25);
  signalUserData = input<any>(null);
  signalIsActive = input(false, {
    transform: (value: boolean | string) => Boolean(value),
  });

  // Output signals
  signalNotify = output<string>();
  signalUserAction = output<{ action: string; userId: string }>();

  // Model signals for two-way binding
  signalUserEmail = model('user@example.com');
  signalUserRole = model('user');

  // Computed signals
  signalDisplayName = computed(
    () => `${this.signalUserName()} (${this.signalUserAge()})`
  );
  signalUserStatus = computed(() =>
    this.signalIsActive() ? 'Active' : 'Inactive'
  );
  signalFullProfile = computed(() => ({
    name: this.signalUserName(),
    age: this.signalUserAge(),
    email: this.signalUserEmail(),
    role: this.signalUserRole(),
    isActive: this.signalIsActive(),
  }));

  // Old methods
  updateName() {
    this.userName = 'Updated Name!';
  }

  sendMessage() {
    this.notify.emit('Hello from UserCard!');
  }

  // New signal-based methods
  updateSignalName() {
    // Note: We can't directly update input signals, but we can trigger outputs
    this.signalNotify.emit('Signal name update requested');
  }

  sendSignalMessage() {
    this.signalNotify.emit('Hello from Signal UserCard!');
  }

  triggerSignalAction(action: string) {
    this.signalUserAction.emit({
      action,
      userId: this.signalUserName(),
    });
  }

  updateSignalEmail(email: string) {
    this.signalUserEmail.set(email);
  }

  updateSignalRole(role: string) {
    this.signalUserRole.set(role);
  }
}
