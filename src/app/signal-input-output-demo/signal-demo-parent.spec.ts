import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalDemoParent } from './signal-demo-parent';
import { SignalInputOutputDemo } from './signal-input-output-demo';

describe('SignalDemoParent', () => {
  let component: SignalDemoParent;
  let fixture: ComponentFixture<SignalDemoParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalDemoParent, SignalInputOutputDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalDemoParent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.parentTitle()).toBe('Parent Demo');
    expect(component.parentCount()).toBe(42);
    expect(component.parentSlider()).toBe(75);
    expect(component.parentModel()).toBe('Initial Model Value');
    expect(component.parentRequiredModel()).toBe('Required Model Value');
    expect(component.parentSliderModel()).toBe(50);
  });

  it('should compute combined title correctly', () => {
    expect(component.combinedTitle()).toBe('Parent Demo - Count: 42');

    component.parentTitle.set('New Title');
    expect(component.combinedTitle()).toBe('New Title - Count: 42');
  });

  it('should compute total value correctly', () => {
    expect(component.totalValue()).toBe(42 + 75 + 50); // 167

    component.parentCount.set(100);
    expect(component.totalValue()).toBe(100 + 75 + 50); // 225
  });

  it('should compute status correctly', () => {
    // Default values: count=42, slider=75
    expect(component.status()).toBe('Medium Performance');

    component.parentCount.set(60);
    component.parentSlider.set(60);
    expect(component.status()).toBe('High Performance');

    component.parentCount.set(10);
    component.parentSlider.set(10);
    expect(component.status()).toBe('Low Performance');
  });

  it('should handle value change events', () => {
    const spy = spyOn(component, 'addToLog');
    component.handleValueChange(123);

    expect(spy).toHaveBeenCalledWith(
      'output',
      'Value change received from child',
      123
    );
  });

  it('should handle user action events', () => {
    const spy = spyOn(component, 'addToLog');
    const action = { action: 'test', timestamp: new Date() };
    component.handleUserAction(action);

    expect(spy).toHaveBeenCalledWith(
      'output',
      'User action received from child',
      action
    );
  });

  it('should add entries to log', () => {
    const initialLogLength = component.eventLog().length;
    component.addToLog('input', 'Test message', { test: 'value' });

    expect(component.eventLog().length).toBe(initialLogLength + 1);
    expect(component.eventLog()[0].message).toBe('Test message');
    expect(component.eventLog()[0].type).toBe('input');
  });

  it('should clear log', () => {
    component.addToLog('input', 'Test message');
    expect(component.eventLog().length).toBeGreaterThan(0);

    component.clearLog();
    expect(component.eventLog().length).toBe(0);
  });

  it('should limit log to 20 entries', () => {
    // Add 25 entries
    for (let i = 0; i < 25; i++) {
      component.addToLog('input', `Message ${i}`);
    }

    expect(component.eventLog().length).toBe(20);
    expect(component.eventLog()[0].message).toBe('Message 24'); // Most recent first
  });
});
