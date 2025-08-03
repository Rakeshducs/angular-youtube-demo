import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalInputOutputDemo } from './child/signal-input-output-demo';

@Component({
  selector: 'app-signal-demo-parent',
  standalone: true,
  imports: [CommonModule, SignalInputOutputDemo],
  templateUrl: './signal-demo-parent.html'
})
export class SignalDemoParent {
  // Parent state signals
  parentTitle = signal('Parent Demo');
  parentCount = signal(42);
  parentSlider = signal(75);
  parentModel = signal(0); // Changed to number to match modelValue
  parentRequiredModel = signal('Required Model Value');
  parentSliderModel = signal(50);

  // Event log signal
  eventLog = signal<Array<{
    timestamp: Date;
    message: string;
    value?: any;
    type: 'input' | 'output' | 'model';
  }>>([]);

  // Computed signals
  combinedTitle = computed(() => `${this.parentTitle()} - Count: ${this.parentCount()}`);
  
  totalValue = computed(() => this.parentCount() + this.parentSlider() + this.parentSliderModel());
  
  status = computed(() => {
    const count = this.parentCount();
    const slider = this.parentSlider();
    if (count > 50 && slider > 50) return 'High Performance';
    if (count > 25 && slider > 25) return 'Medium Performance';
    return 'Low Performance';
  });

  constructor() {
    // Effect to log parent state changes
    effect(() => {
      this.addToLog('input', 'Parent state updated', {
        title: this.parentTitle(),
        count: this.parentCount(),
        slider: this.parentSlider(),
        model: this.parentModel()
      });
    });
  }

  // Event handlers
  handleValueChange(value: number) {
    this.addToLog('output', 'Value change received from child', value);
  }

  handleUserAction(action: { action: string; timestamp: Date }) {
    this.addToLog('output', 'User action received from child', action);
  }

  // Helper methods
  addToLog(type: 'input' | 'output' | 'model', message: string, value?: any) {
    this.eventLog.update(log => [
      {
        timestamp: new Date(),
        message,
        value: value ? JSON.stringify(value, null, 2) : undefined,
        type
      },
      ...log.slice(0, 19) // Keep only last 20 entries
    ]);
  }

  clearLog() {
    this.eventLog.set([]);
  }
} 