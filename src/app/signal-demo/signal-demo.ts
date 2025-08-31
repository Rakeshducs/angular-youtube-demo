import {
  Component,
  computed,
  effect,
  signal,
  untracked,
  DestroyRef,
  resource,
  linkedSignal,
} from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SignalInputOutputDemo } from '../signal-demo-parent/child/signal-input-output-demo';

@Component({
  selector: 'app-signal-demo',
  templateUrl: './signal-demo.html',
  styleUrls: ['./signal-demo.css'],
  imports: [CommonModule, DatePipe, SignalInputOutputDemo],
  standalone: true,
})
export class SignalDemo {
  private destroy = inject(DestroyRef);

  // Basic signals for demonstration
  count = signal<number>(0, { equal: Object.is });
  name = signal<string>('CodeSmarts');
  doubleCount = computed(() => this.count() * 2);

  // Parent signals for input/output demo
  parentTitle = signal<string>('Angular Signal Tutorial');
  parentCount = signal<number>(42);
  parentSlider = signal<number>(50);
  sliderChangedBy = signal<'parent' | 'child'>('parent');

  // Output event tracking
  lastValueChange = signal<number | null>(null);
  lastUserAction = signal<{ action: string; timestamp: Date } | null>(null);

  // Tutorial step tracking
  currentTutorialStep = signal<number>(1);
  tutorialSteps = [
    {
      title: 'Understanding Inputs',
      description:
        'Inputs allow parent components to pass data to child components. Think of it like passing parameters to a function.',
      action:
        'Try changing the title or count in the parent controls above and watch how the child component updates automatically!',
    },
    {
      title: 'Understanding Outputs',
      description:
        'Outputs allow child components to send events back to parent components. Think of it like returning values from a function.',
      action:
        'Click the "Trigger Value Change" or "Trigger User Action" buttons in the child component and see the events appear in the parent!',
    },
    {
      title: 'Two-Way Binding',
      description:
        'Two-way binding allows data to flow in both directions simultaneously. Both parent and child can modify the same value.',
      action:
        'Try changing the slider value from either the parent controls or the child controls - both will stay synchronized!',
    },
  ];

  // Data flow logging
  dataFlowLog = signal<string[]>([]);

  // Linked signals for teaching concept
  firstName = signal<string>('Ada');
  lastName = signal<string>('Lovelace');
  // Advanced linkedSignal for teaching
  // - source: watches both firstName and lastName
  // - computation: updates fullName unless user has overridden it
  // - equal: only updates if the string actually changes
  fullName = linkedSignal<[string, string], string>({
    source: computed(() => [this.firstName(), this.lastName()]),
    computation: ([first, last], previous) => {
      const computedName = `${first} ${last}`;
      // If the computed name changed, reset to computedName
      if (
        !previous ||
        previous.source?.[0] !== first ||
        previous.source?.[1] !== last
      ) {
        return computedName;
      }
      // Otherwise, preserve the override
      return previous.value ?? computedName;
    },
    equal: (a, b) => a === b,
  });

  // Method to demonstrate linkedSignal is writable
  setFullName = (name: string) => this.fullName.set(name);

  // Resource concept for teaching
  userId = signal<number>(1);
  userResource = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params }) => this.fetchUser(params.id),
  });

  // Computed signal for user name display
  userName = computed(() => {
    const user = this.userResource.value();
    return user?.name || 'No user loaded';
  });

  // Computed signal for loading state
  isLoading = computed(() => this.userResource.isLoading());

  // Tutorial navigation methods
  nextTutorialStep = () => {
    if (this.currentTutorialStep() < this.tutorialSteps.length) {
      this.currentTutorialStep.update((step) => step + 1);
      this.logDataFlow(
        `📚 Moved to tutorial step ${this.currentTutorialStep()}`
      );
    }
  };

  prevTutorialStep = () => {
    if (this.currentTutorialStep() > 1) {
      this.currentTutorialStep.update((step) => step - 1);
      this.logDataFlow(
        `📚 Moved to tutorial step ${this.currentTutorialStep()}`
      );
    }
  };

  goToTutorialStep = (step: number) => {
    this.currentTutorialStep.set(step);
    this.logDataFlow(`📚 Jumped to tutorial step ${step}`);
  };

  // Data flow logging method
  private logDataFlow = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.dataFlowLog.update((logs) => [logEntry, ...logs.slice(0, 9)]); // Keep last 10 entries
    console.log(logEntry);
  };

  // Simulated async fetch function
  private fetchUser(id: number): Promise<{ name: string }> {
    console.log('🌐 Fetching user with ID:', id);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id <= 0) {
          console.log('❌ Invalid user ID:', id);
          reject(new Error('Invalid user ID'));
          return;
        }
        console.log('✅ User fetched:', { name: 'User ' + id });
        resolve({ name: 'User ' + id });
      }, 1000);
    });
  }

  // Methods to update signals for demonstration
  setFirstName = (name: string) => this.firstName.set(name);
  setLastName = (name: string) => this.lastName.set(name);
  setUserId = (id: number) => {
    console.log('🔄 Setting userId to:', id);
    this.userId.set(id);
  };

  // Parent control methods
  updateParentSlider = (value: number) => {
    this.parentSlider.set(value);
    this.sliderChangedBy.set('parent');
    this.logDataFlow(`👨‍💼 Parent changed slider to: ${value}`);
  };

  // Output event handlers
  handleValueChange = (value: number) => {
    console.log('📤 Child sent value change:', value);
    this.lastValueChange.set(value);
    this.logDataFlow(`📤 Child sent value change: ${value}`);
  };

  handleUserAction = (action: { action: string; timestamp: Date }) => {
    console.log('📤 Child sent user action:', action);
    this.lastUserAction.set(action);
    this.logDataFlow(`📤 Child sent user action: ${action.action}`);
  };

  private timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Log initial data flow
    this.logDataFlow('🚀 Component initialized');

    effect((onCleanup) => {
      const current = this.count();
      const currentName = untracked(this.name);
      console.log(`🟢 Count changed to ${current} for user: ${currentName}`);
      this.logDataFlow(`🟢 Count signal changed to: ${current}`);
      this.timerId = setTimeout(() => {
        console.log(`⏱ Simulated effect for count ${current}`);
      }, 2000);
      onCleanup(() => {
        if (this.timerId) {
          console.log('🧹 Cleaning up timer for count:', current);
          clearTimeout(this.timerId);
          this.timerId = null;
        }
      });
    });

    // Effect to log parent title changes
    effect(() => {
      const title = this.parentTitle();
      this.logDataFlow(`📥 Parent title changed to: "${title}"`);
    });

    // Effect to log parent count changes
    effect(() => {
      const count = this.parentCount();
      this.logDataFlow(`📥 Parent count changed to: ${count}`);
    });

    this.destroy.onDestroy(() => {
      console.log('🗑 Component destroyed');
      this.logDataFlow('🗑 Component destroyed');
    });
  }

  increment = () => {
    this.count.update((v) => v + 1);
    this.logDataFlow('➕ Count incremented');
  };

  decrement = () => {
    this.count.update((v) => v - 1);
    this.logDataFlow('➖ Count decremented');
  };

  reset = () => {
    this.count.set(0);
    this.logDataFlow('🔁 Count reset to 0');
  };

  toggleName = () => {
    const newName = this.name() === 'CodeSmarts' ? 'AngularPro' : 'CodeSmarts';
    this.name.set(newName);
    this.logDataFlow(`🔄 Name toggled to: ${newName}`);
  };

  logUntracked = () => {
    const nameValue = untracked(this.name);
    const countValue = this.count();
    console.log('🔍 Untracked Name:', nameValue, '| Count:', countValue);
    this.logDataFlow(
      `🔍 Logged untracked values - Name: ${nameValue}, Count: ${countValue}`
    );
  };
}
