import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCard {
  userName = 'Kunaljit Nath';
  userAge = 28;
  @Input() userData: any;
@Output() notify = new EventEmitter<string>();
  updateName() {
    this.userName = 'Updated Name!';
  }
  sendMessage() {
    this.notify.emit('Hello from UserCard!');
  }
}
