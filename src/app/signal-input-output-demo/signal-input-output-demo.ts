import {
  Component,
  input,
  output,
  model,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signal-input-output-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-input-output-demo.html',
})
export class SignalInputOutputDemo {
  // ===== INPUT SIGNALS =====

  // Basic input with default value
  title = input('Signal Demo');

  // Required input (must be provided)
  userName = input.required<string>();

  // Input with transform function
  count = input(0, {
    transform: (value: number | string) => Number(value) || 0,
  });

  // Input with alias for template
  sliderValue = input(50, { alias: 'value' });

  // Boolean input with transform
  isEnabled = input(false, {
    transform: (value: boolean | string) => Boolean(value),
  });

  // ===== OUTPUT SIGNALS =====

  // Basic output
  onValueChange = output<number>();

  // Output with specific type
  onUserAction = output<{ action: string; timestamp: Date }>();

  // ===== MODEL SIGNALS =====

  // Model input for two-way binding
  modelValue = model(0);

  // Required model input
  requiredModel = model.required<string>();

  // Model with alias
  sliderModel = model(25, { alias: 'value' });

  // ===== COMPUTED SIGNALS =====

  // Computed based on inputs
  displayTitle = computed(() => `${this.title()} - ${this.userName()}`);

  // Computed based on model
  modelDisplay = computed(() => `Current value: ${this.modelValue()}`);

  // Computed based on multiple signals
  status = computed(() => {
    const count = this.count();
    const enabled = this.isEnabled();
    return enabled ? `Active (${count})` : 'Disabled';
  });

  // ===== METHODS =====

  // Method to trigger output
  triggerValueChange() {
    const newValue = this.count() + 1;
    this.onValueChange.emit(newValue);
  }

  // Method to trigger user action output
  triggerUserAction(action: string) {
    this.onUserAction.emit({
      action,
      timestamp: new Date(),
    });
  }

  // Method to update model
  updateModel() {
    this.modelValue.update((value) => value + 10);
  }

  // Method to update slider model
  updateSlider(value: number) {
    this.sliderModel.set(value);
  }

  // Method to update required model
  updateRequiredModel(value: string) {
    this.requiredModel.set(value);
  }

  constructor() {
    // Effect to log when inputs change
    effect(() => {
      console.log('🔄 Inputs changed:', {
        title: this.title(),
        userName: this.userName(),
        count: this.count(),
        sliderValue: this.sliderValue(),
        isEnabled: this.isEnabled(),
      });
    });

    // Effect to log when models change
    effect(() => {
      console.log('📊 Models changed:', {
        modelValue: this.modelValue(),
        requiredModel: this.requiredModel(),
        sliderModel: this.sliderModel(),
      });
    });
  }
}
