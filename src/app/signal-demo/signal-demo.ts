import {
  Component,
  computed,
  effect,
  signal,
  untracked,
  DestroyRef,
} from '@angular/core';
import { inject } from '@angular/core';

@Component({
  selector: 'app-signal-demo',
  templateUrl: './signal-demo.html',
  styleUrls: ['./signal-demo.css'],
})
export class SignalDemo {
  private destroy = inject(DestroyRef);

  // Signals
  count = signal(0, { equal: (a, b) => a === b });
  name = signal('CodeSmarts');

  doubleCount = computed(() => this.count() * 2);

  private timerId: any;

  constructor() {
    // Effect that only tracks `count`, not `name`
    effect((onCleanup) => {
      const current = this.count();
      const currentName = untracked(this.name); // won't trigger reactivity

      console.log(`🟢 Count changed to ${current} for user: ${currentName}`);

      this.timerId = setTimeout(() => {
        console.log(`⏱ Simulated effect for count ${current}`);
      }, 2000);

      onCleanup(() => {
        console.log('🧹 Cleaning up timer for count:', current);
        clearTimeout(this.timerId);
      });
    });

    this.destroy.onDestroy(() => {
      console.log('🗑 Component destroyed');
    });
  }

  increment() {
    this.count.update((value) => value + 1);
  }

  decrement() {
    this.count.update((value) => value - 1);
  }

  reset() {
    this.count.set(0);
  }

  toggleName() {
    this.name.set(this.name() === 'CodeSmarts' ? 'AngularPro' : 'CodeSmarts');
  }

  logUntracked() {
    const nameValue = untracked(this.name); // explicitly reading without tracking
    const countValue = this.count();
    console.log('🔍 Untracked Name:', nameValue, '| Count:', countValue);
  }
}
