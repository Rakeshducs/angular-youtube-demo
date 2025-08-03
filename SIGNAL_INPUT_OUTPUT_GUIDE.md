# Angular Signal Input/Output/Model Guide

This guide demonstrates the implementation of Angular's new signal-based input, output, and model properties as explained in the [Angular documentation](https://angular.dev/guide/components/inputs) and [outputs guide](https://angular.dev/guide/components/outputs).

## 🎯 Overview

Angular v17+ introduces signal-based inputs, outputs, and models that provide better type safety, performance, and developer experience compared to the traditional `@Input` and `@Output` decorators.

## 📥 Input Signals

### Basic Input with Default Value

```typescript
// Basic input with default value
title = input("Signal Demo");
```

### Required Input

```typescript
// Required input (must be provided)
userName = input.required<string>();
```

### Input with Transform Function

```typescript
// Input with transform function for type conversion
count = input(0, { transform: (value: number | string) => Number(value) || 0 });
```

### Input with Alias

```typescript
// Input with alias for template binding
sliderValue = input(50, { alias: "value" });
```

### Boolean Input with Transform

```typescript
// Boolean input with transform
isEnabled = input(false, { transform: (value: boolean | string) => Boolean(value) });
```

## 📤 Output Signals

### Basic Output

```typescript
// Basic output
onValueChange = output<number>();
```

### Output with Complex Type

```typescript
// Output with specific type
onUserAction = output<{ action: string; timestamp: Date }>();
```

### Emitting Output Values

```typescript
// Method to trigger output
triggerValueChange() {
  const newValue = this.count() + 1;
  this.onValueChange.emit(newValue);
}
```

## 🔄 Model Signals (Two-way Binding)

### Basic Model

```typescript
// Model input for two-way binding
modelValue = model(0);
```

### Required Model

```typescript
// Required model input
requiredModel = model.required<string>();
```

### Model with Alias

```typescript
// Model with alias
sliderModel = model(25, { alias: "value" });
```

### Updating Model Values

```typescript
// Method to update model
updateModel() {
  this.modelValue.update(value => value + 10);
}

// Direct set
updateSlider(value: number) {
  this.sliderModel.set(value);
}
```

## 🧮 Computed Signals

### Computed Based on Inputs

```typescript
// Computed based on inputs
displayTitle = computed(() => `${this.title()} - ${this.userName()}`);
```

### Computed Based on Models

```typescript
// Computed based on model
modelDisplay = computed(() => `Current value: ${this.modelValue()}`);
```

### Complex Computed

```typescript
// Computed based on multiple signals
status = computed(() => {
  const count = this.count();
  const enabled = this.isEnabled();
  return enabled ? `Active (${count})` : "Disabled";
});
```

## 🎮 Usage Examples

### Template Binding

#### Input Binding

```html
<!-- Basic input binding -->
<app-component [title]="'Custom Title'"></app-component>

<!-- Required input -->
<app-component [userName]="'John Doe'"></app-component>

<!-- Input with alias -->
<app-component [value]="75"></app-component>

<!-- Boolean input -->
<app-component [isEnabled]="true"></app-component>
```

#### Output Binding

```html
<!-- Output event binding -->
<app-component (onValueChange)="handleValueChange($event)"></app-component>

<!-- Complex output binding -->
<app-component (onUserAction)="handleUserAction($event)"></app-component>
```

#### Two-way Model Binding

```html
<!-- Two-way binding with model -->
<app-component [(modelValue)]="parentValue"></app-component>

<!-- Model with alias -->
<app-component [(value)]="parentSliderValue"></app-component>
```

### Parent-Child Communication

#### Parent Component

```typescript
export class ParentComponent {
  parentValue = signal(0);
  parentSlider = signal(50);

  handleValueChange(value: number) {
    console.log("Value changed:", value);
  }

  handleUserAction(action: { action: string; timestamp: Date }) {
    console.log("User action:", action);
  }
}
```

#### Child Component Template

```html
<app-signal-demo [title]="'Custom Title'" [userName]="'Demo User'" [count]="25" [value]="60" [isEnabled]="true" [(modelValue)]="parentValue" [(requiredModel)]="parentRequiredModel" [(value)]="parentSlider" (onValueChange)="handleValueChange($event)" (onUserAction)="handleUserAction($event)"></app-signal-demo>
```

## 🔍 Effects and Monitoring

### Monitoring Input Changes

```typescript
constructor() {
  // Effect to log when inputs change
  effect(() => {
    console.log('🔄 Inputs changed:', {
      title: this.title(),
      userName: this.userName(),
      count: this.count(),
      sliderValue: this.sliderValue(),
      isEnabled: this.isEnabled()
    });
  });
}
```

### Monitoring Model Changes

```typescript
constructor() {
  // Effect to log when models change
  effect(() => {
    console.log('📊 Models changed:', {
      modelValue: this.modelValue(),
      requiredModel: this.requiredModel(),
      sliderModel: this.sliderModel()
    });
  });
}
```

## 🆚 Comparison: Old vs New Approach

### Old Approach (@Input/@Output)

```typescript
export class OldComponent {
  @Input() title = "Default";
  @Input() count = 0;
  @Output() valueChange = new EventEmitter<number>();

  updateValue() {
    this.valueChange.emit(this.count + 1);
  }
}
```

### New Approach (Signals)

```typescript
export class NewComponent {
  title = input("Default");
  count = input(0);
  valueChange = output<number>();

  updateValue() {
    this.valueChange.emit(this.count() + 1);
  }
}
```

## 🎨 Template Usage Comparison

### Old Template

```html
<old-component [title]="'Hello'" [count]="42" (valueChange)="handleChange($event)"> </old-component>
```

### New Template

```html
<new-component [title]="'Hello'" [count]="42" (valueChange)="handleChange($event)"> </new-component>
```

## 🚀 Benefits of Signal-based Approach

1. **Better Type Safety**: Signals provide better TypeScript inference
2. **Performance**: Signals are more efficient for change detection
3. **Developer Experience**: Cleaner syntax and better IDE support
4. **Reactivity**: Built-in reactivity with computed and effects
5. **Future-proof**: Part of Angular's modern architecture

## 📋 Key Points

- **Input signals are read-only**: You cannot directly update input signals
- **Model signals are writable**: Components can update their own model signals
- **Output signals emit values**: Use `.emit()` to send values to parent components
- **Computed signals are reactive**: They automatically update when dependencies change
- **Effects run automatically**: They execute when signal values change

## 🛠️ Migration Tips

1. Replace `@Input()` with `input()`
2. Replace `@Output()` with `output()`
3. Use `model()` for two-way binding
4. Update templates to use the new syntax
5. Leverage `computed()` for derived values
6. Use `effect()` for side effects

## 📚 Additional Resources

- [Angular Input Properties Guide](https://angular.dev/guide/components/inputs)
- [Angular Output Properties Guide](https://angular.dev/guide/components/outputs)
- [Angular Signals Guide](https://angular.dev/guide/signals)

---

This implementation demonstrates all the key concepts of Angular's signal-based input, output, and model properties with practical examples and interactive demos.
