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

@Component({
  selector: 'app-signal-demo',
  templateUrl: './signal-demo.html',
  styleUrls: ['./signal-demo.css'],
})
export class SignalDemo {
  private destroy = inject(DestroyRef);

  count = signal<number>(0, { equal: Object.is });
  name = signal<string>('CodeSmarts');
  doubleCount = computed(() => this.count() * 2);

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

  private timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const current = this.count();
      const currentName = untracked(this.name);
      console.log(`🟢 Count changed to ${current} for user: ${currentName}`);
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
    this.destroy.onDestroy(() => {
      console.log('🗑 Component destroyed');
    });
  }

  increment = () => this.count.update((v) => v + 1);
  decrement = () => this.count.update((v) => v - 1);
  reset = () => this.count.set(0);
  toggleName = () =>
    this.name.set(this.name() === 'CodeSmarts' ? 'AngularPro' : 'CodeSmarts');
  logUntracked = () => {
    const nameValue = untracked(this.name);
    const countValue = this.count();
    console.log('🔍 Untracked Name:', nameValue, '| Count:', countValue);
  };
}
