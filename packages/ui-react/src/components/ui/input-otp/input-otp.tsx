import * as React from 'react';

import { cn } from '@/lib/utils';

// Mirrors the Figma "inputOTP" component: a bare row of single-character boxes
// (no label/description — like `Input`, field furniture is a future `Field`
// wrapper). Themed by the `--ui-input-otp-*` token tier. Each slot is a plain
// `<input>`; typing a digit advances focus to the next slot, Backspace on an
// empty slot clears and moves back to the previous one, and pasting a full
// code distributes it across the slots from the focused one onward. `error`
// reddens every box (via `--ui-input-otp-box-border-color-error`); there is no
// disabled treatment in the design, so `disabled` falls back to the generic
// `disabled:opacity-50` convention used elsewhere in this package.
export interface InputOTPProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'onChange' | 'defaultValue' | 'children'
  > {
  /** Number of single-character slots. */
  length?: number;
  /** Controlled value (the digits entered so far, left to right). */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the full value on every change. */
  onChange?: (value: string) => void;
  /** Fires once, the moment the value reaches `length` characters. */
  onComplete?: (value: string) => void;
  /** Disables every slot. */
  disabled?: boolean;
  /** Switches every slot to the error treatment. */
  error?: boolean;
  /** Focuses the first slot on mount. */
  autoFocus?: boolean;
  /** Builds the accessible name for a slot from its 1-based index and the total length. */
  slotAriaLabel?: (index: number, length: number) => string;
}

const defaultSlotAriaLabel = (index: number, length: number) =>
  `Digit ${index} of ${length}`;

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      length = 6,
      value,
      defaultValue,
      onChange,
      onComplete,
      disabled,
      error,
      autoFocus,
      slotAriaLabel = defaultSlotAriaLabel,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ''
    );
    const isControlled = value != null;
    const currentValue = (isControlled ? value : internalValue).slice(
      0,
      length
    );
    const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const completedRef = React.useRef(false);

    const commitValue = (next: string) => {
      const clipped = next.slice(0, length);
      if (!isControlled) setInternalValue(clipped);
      onChange?.(clipped);
      if (clipped.length === length) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.(clipped);
        }
      } else {
        completedRef.current = false;
      }
    };

    const focusSlot = (index: number) => {
      const slot = slotRefs.current[index];
      slot?.focus();
      slot?.select();
    };

    React.useEffect(() => {
      if (autoFocus) focusSlot(0);
      // Only run on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSlotChange = (index: number, raw: string) => {
      const char = raw.slice(-1);
      const chars = currentValue.split('');
      chars[index] = char;
      commitValue(chars.join(''));
      if (char && index < length - 1) focusSlot(index + 1);
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Backspace' && !currentValue[index] && index > 0) {
        event.preventDefault();
        const chars = currentValue.split('');
        chars[index - 1] = '';
        commitValue(chars.join(''));
        focusSlot(index - 1);
      } else if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        focusSlot(index - 1);
      } else if (event.key === 'ArrowRight' && index < length - 1) {
        event.preventDefault();
        focusSlot(index + 1);
      }
    };

    const handlePaste = (
      index: number,
      event: React.ClipboardEvent<HTMLInputElement>
    ) => {
      const text = event.clipboardData.getData('text').replace(/\s/g, '');
      if (!text) return;
      event.preventDefault();
      const chars = currentValue.split('');
      let cursor = index;
      for (const char of text) {
        if (cursor >= length) break;
        chars[cursor] = char;
        cursor += 1;
      }
      commitValue(chars.join(''));
      focusSlot(Math.min(cursor, length - 1));
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex justify-[var(--ui-input-otp-container-justify-content)] gap-3',
          className
        )}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              slotRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={currentValue[index] ?? ''}
            placeholder={String(index + 1)}
            disabled={disabled}
            aria-label={slotAriaLabel(index + 1, length)}
            aria-invalid={error || undefined}
            onChange={(event) => handleSlotChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              'ui-input-otp-value-text-style h-[var(--ui-input-otp-box-height)] w-[var(--ui-input-otp-box-width)] rounded-[var(--ui-input-otp-box-border-radius)] border-[length:var(--ui-input-otp-box-border-width)] bg-[var(--ui-input-otp-box-color)] px-[var(--ui-input-otp-box-padding-x)] py-[var(--ui-input-otp-box-padding-y)] text-center text-[var(--ui-input-otp-value-color)] caret-[var(--ui-input-otp-value-color)] placeholder:text-[var(--ui-input-otp-placeholder-color)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-[var(--ui-input-otp-box-border-color-error)] focus-visible:ring-[var(--ui-focus-error)]'
                : 'border-[var(--ui-input-otp-box-border-color-idle)] focus-visible:border-[var(--ui-input-otp-box-border-color-active)] focus-visible:ring-[var(--ui-focus-primary)]'
            )}
          />
        ))}
      </div>
    );
  }
);
InputOTP.displayName = 'InputOTP';

export { InputOTP };
