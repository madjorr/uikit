import * as React from 'react';
import {
  EyeIcon,
  EyeCrossedIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { ButtonIconInput } from '../button-icon-input';

// Mirrors the Figma "InputPassword" component: an `InputText`-shaped field
// (label / required / description / error) with a built-in show/hide toggle.
// Unlike `InputText`, the box itself isn't the bare `Input` primitive — the
// design gives InputPassword its own token tier (`--ui-input-password-*`)
// down to the box fill/border, so the value input renders borderless/
// transparent inside a themed flex container alongside the toggle button
// (the tier's own `global-box-gap` token implies this layout, not an
// absolutely-positioned overlay). The toggle is the Figma "ButtonIconInput"
// instance, rendered here via the `ButtonIconInput` component. Visibility is
// fully internal state; nothing in the design calls for a consumer-controlled
// mode.
export interface InputPasswordProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'children' | 'type'> {
  /** Field label, rendered above the input. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Helper text below the input. Hidden while `error` is set. */
  description?: React.ReactNode;
  /**
   * Error message below the input. Its presence switches the field to the error
   * treatment (red box border + red message).
   */
  error?: React.ReactNode;
  /** Accessible label for the toggle button while the password is hidden. */
  showPasswordLabel?: string;
  /** Accessible label for the toggle button while the password is shown. */
  hidePasswordLabel?: string;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  (
    {
      className,
      id,
      label,
      required,
      description,
      error,
      disabled,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const messageId = `${inputId}-message`;
    const [visible, setVisible] = React.useState(false);

    const hasError = error != null && error !== '';
    const message = hasError ? error : description;
    const hasMessage = message != null && message !== '';

    return (
      <div className="flex w-full min-w-[var(--ui-input-password-global-container-width-min)] flex-col gap-[var(--ui-input-password-global-container-gap)]">
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-password-global-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-password-global-label-color-disabled)]'
                : 'text-[var(--ui-input-password-global-label-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-password-global-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            'flex h-[var(--ui-input-password-global-box-height)] items-center gap-[var(--ui-input-password-global-box-gap)] rounded-[var(--ui-input-password-global-box-border-radius)] border-[length:var(--ui-input-password-global-box-border-width)] px-[var(--ui-input-password-global-box-padding-x)] py-[var(--ui-input-password-global-box-padding-y)] transition-colors',
            hasError
              ? 'border-[var(--ui-input-password-error-msg-box-border-color-idle)] bg-[var(--ui-input-password-global-box-color-idle)] has-[:focus-visible]:border-[var(--ui-input-password-error-msg-box-border-color-hover)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[var(--ui-focus-error)]'
              : cn(
                  'border-[var(--ui-input-password-normal-box-border-color-idle)] bg-[var(--ui-input-password-global-box-color-idle)]',
                  !disabled &&
                    'hover:border-[var(--ui-input-password-normal-box-border-color-hover)] hover:bg-[var(--ui-input-password-global-box-color-hover)]',
                  'has-[:focus-visible]:border-[var(--ui-input-password-normal-box-border-color-hover)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[var(--ui-focus-primary)]'
                ),
            disabled &&
              'cursor-not-allowed border-[var(--ui-input-password-normal-box-border-color-disabled)] bg-[var(--ui-input-password-global-box-color-disabled)]'
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-sm leading-6 outline-none',
              disabled
                ? 'text-[var(--ui-input-password-global-value-color-disabled)] placeholder:text-[var(--ui-input-password-global-placeholder-color-disabled)]'
                : 'text-[var(--ui-input-password-global-value-color-idle)] placeholder:text-[var(--ui-input-password-global-placeholder-color-idle)]',
              className
            )}
            {...props}
          />
          <ButtonIconInput
            variant={hasError ? 'error' : 'normal'}
            onClick={() => setVisible((prev) => !prev)}
            disabled={disabled}
            aria-label={visible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={visible}
            className="shrink-0"
          >
            {visible ? <EyeIcon /> : <EyeCrossedIcon />}
          </ButtonIconInput>
        </div>

        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs leading-4',
              hasError
                ? 'text-[var(--ui-input-password-error-msg-error-color)]'
                : disabled
                  ? 'text-[var(--ui-input-password-normal-description-color-disabled)]'
                  : 'text-[var(--ui-input-password-normal-description-color-idle)]'
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
