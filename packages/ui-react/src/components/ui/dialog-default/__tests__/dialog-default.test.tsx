import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DialogDefault, type DialogDefaultVariant } from '../dialog-default';

describe('DialogDefault', () => {
  it('renders the default variant title, body, and footer buttons', () => {
    render(<DialogDefault open />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Dialog title')).toBeInTheDocument();
    expect(
      within(dialog).getByText('Drop any content into this slot.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it.each<[DialogDefaultVariant, string, string]>([
    ['default', 'Dialog title', 'Label'],
    ['rename', 'Rename object name', 'Rename'],
    ['save changes', 'Save changes', 'Save'],
    ['reset password', 'Reset password', 'Reset'],
    ['discard changes', 'Discard changes', 'Confirm'],
    ['accept', 'Accept object name', 'Accept'],
    ['read-only', 'License agreement', 'Done'],
  ])('renders the %s variant title and primary action', (variant, title, primary) => {
    render(<DialogDefault open variant={variant} />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: primary })).toBeInTheDocument();
  });

  it('renders the rename variant as a prefilled text field', () => {
    render(<DialogDefault open variant="rename" />);
    expect(screen.getByRole('textbox', { name: 'Object name' })).toHaveValue(
      'Current name'
    );
  });

  it('renders read-only with a single primary action and no secondary button', () => {
    render(<DialogDefault open variant="read-only" />);
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Go back' })
    ).not.toBeInTheDocument();
  });

  it('lets children override the variant body copy', () => {
    render(
      <DialogDefault open variant="save changes">
        <p>Custom body content</p>
      </DialogDefault>
    );
    expect(screen.getByText('Custom body content')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'You have unsaved changes. Do you want to save them before leaving?'
      )
    ).not.toBeInTheDocument();
  });

  it('shows a loading spinner overlay when hasLoading is set', () => {
    render(<DialogDefault open hasLoading />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('does not render the loading overlay by default', () => {
    render(<DialogDefault open />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('dismisses via the secondary button and emits open-change', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DialogDefault open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DialogDefault open ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });
});
