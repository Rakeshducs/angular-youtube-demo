import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalInputOutputDemo } from './child/signal-input-output-demo';

@Component({
  selector: 'app-signal-demo-parent',
  standalone: true,
  imports: [CommonModule, SignalInputOutputDemo],
  templateUrl: './signal-demo-parent.html',
})
export class SignalDemoParent {
  // Parent state signals (inputs to child)
  parentTitle = signal('Parent Demo');
  parentCount = signal(42);
  parentSlider = signal(75);

  // Child output event signals
  lastValueChange = signal<number | null>(null);
  lastUserAction = signal<{ action: string; timestamp: Date } | null>(null);

  // Visual feedback for slider changes
  sliderChangedBy = signal<'parent' | 'child' | null>(null);
  lastSliderValue = signal(75);

  // Event handlers
  handleValueChange(value: number) {
    this.lastValueChange.set(value);
  }

  handleUserAction(action: { action: string; timestamp: Date }) {
    this.lastUserAction.set(action);
  }

  // Method to handle parent slider changes
  updateParentSlider(value: number) {
    this.parentSlider.set(value);
    this.sliderChangedBy.set('parent');
    this.lastSliderValue.set(value);

    // Clear the indicator after 2 seconds
    setTimeout(() => {
      this.sliderChangedBy.set(null);
    }, 2000);
  }
}
