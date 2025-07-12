import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-directive-demo',
  imports: [CommonModule, FormsModule],
  templateUrl: './directive-demo.html',
  styleUrl: './directive-demo.css',
})
export class DirectiveDemoComponent {
  // Used in @if block
  isLoggedIn = true;

  // Used in @for block
  fruits = ['Apple', 'Banana', 'Orange'];

  // Used in @switch block
  status: 'active' | 'pending' | 'unknown' = 'active';

  // Used in @class block
  isSuccess = true;

  userName = 'Rakesh'; // 👈 Used for ngModel
  // Used in @style block
  fontSize = 16;

  toggleStatus(): void {
    this.isSuccess = !this.isSuccess;
  }

  increaseFont(): void {
    this.fontSize += 2;
  }
}
