import { Component, input, output, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signal-input-output-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-input-output-demo.html',
})
export class SignalInputOutputDemo {
  // ===== INPUT SIGNALS =====
  title = input('Signal Demo');
  userName = input('User'); // Made optional with default
  count = input(0, {
    transform: (value: number | string) => Number(value) || 0,
  });

  // ===== OUTPUT SIGNALS =====
  onValueChange = output<number>();
  onUserAction = output<{ action: string; timestamp: Date }>();
  sliderChanged = output<void>();

  // ===== MODEL SIGNALS =====
  sliderValue = model(50, { alias: 'value' });

  // ===== COMPUTED SIGNALS =====
  displayTitle = computed(() => `${this.title()} - ${this.userName()}`);

  // ===== METHODS =====
  triggerValueChange() {
    const newValue = this.count() + 1;
    this.onValueChange.emit(newValue);
  }

  triggerUserAction(action: string) {
    this.onUserAction.emit({
      action,
      timestamp: new Date(),
    });
  }

  updateSliderValue(value: number) {
    this.sliderValue.set(value);
    this.sliderChanged.emit();
  }
}
