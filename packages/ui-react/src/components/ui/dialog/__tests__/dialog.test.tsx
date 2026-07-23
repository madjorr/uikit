import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogVariant,
} from '../dialog';

// The default portal renders the popup into document.body, which Testing
// Library's `screen` queries — Base UI requires the popup to sit in a portal.
function OpenDialog(props: { open?: boolean } = {}) {
  return (
    <DialogRoot open={props.open ?? true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogBody>
        <DialogFooter>Footer</DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

describe('DialogRoot', () => {
  it('renders the open dialog with its title, description, and footer', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete account')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders the close button as an accessible "Close" button on the button-icon token', () => {
    render(<OpenDialog />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass('text-[var(--ui-button-icon-global-icon-color-idle)]');
  });

  it('lets closeLabel override the close button accessible name', () => {
    render(
      <DialogRoot open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogCloseButton closeLabel="Fermer" />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
  });

  it('drives the popup surface from the --ui-dialog-container-* tokens', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'bg-[var(--ui-dialog-container-color)]',
      'text-foreground'
    );
  });

  it('defaults to the sm size (--ui-dialog-container-size-sm / 512px)', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'max-w-[var(--ui-dialog-container-size-sm)]'
    );
  });

  it('supports the large size (832px, kept for backward compatibility)', () => {
    render(
      <DialogRoot open>
        <DialogContent size="large">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[832px]');
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DialogRoot open>
        <DialogContent ref={ref}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </DialogRoot>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('opens from the trigger and closes via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogRoot onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogCloseButton />
        </DialogContent>
      </DialogRoot>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});

describe('Dialog', () => {
  it('renders the default variant title, body, and footer buttons', () => {
    render(<Dialog open />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Dialog title')).toBeInTheDocument();
    expect(
      within(dialog).getByText('Drop any content into this slot.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it.each<[DialogVariant, string, string]>([
    ['default', 'Dialog title', 'Label'],
    ['rename', 'Rename object name', 'Rename'],
    ['save changes', 'Save changes', 'Save'],
    ['reset password', 'Reset password', 'Reset'],
    ['discard changes', 'Discard changes', 'Confirm'],
    ['accept', 'Accept object name', 'Accept'],
    ['read-only', 'License agreement', 'Done'],
  ])('renders the %s variant title and primary action', (variant, title, primary) => {
    render(<Dialog open variant={variant} />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: primary })).toBeInTheDocument();
  });

  it('renders the rename variant as a prefilled text field', () => {
    render(<Dialog open variant="rename" />);
    expect(screen.getByRole('textbox', { name: 'Object name' })).toHaveValue(
      'Current name'
    );
  });

  it('renders read-only with a single primary action and no secondary button', () => {
    render(<Dialog open variant="read-only" />);
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
      <Dialog open variant="save changes">
        <p>Custom body content</p>
      </Dialog>
    );
    expect(screen.getByText('Custom body content')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'You have unsaved changes. Do you want to save them before leaving?'
      )
    ).not.toBeInTheDocument();
  });

  it('lets title/secondaryLabel/primaryLabel/closeLabel override the variant defaults', () => {
    render(
      <Dialog
        open
        variant="discard changes"
        title="Ignorer les modifications"
        secondaryLabel="Retour"
        primaryLabel="Confirmer"
        closeLabel="Fermer"
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText('Ignorer les modifications')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retour' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
  });

  it('passing secondaryLabel on a variant with no default secondary button shows it', () => {
    render(<Dialog open variant="read-only" secondaryLabel="Close instead" />);
    expect(
      screen.getByRole('button', { name: 'Close instead' })
    ).toBeInTheDocument();
  });

  it('shows a loading spinner overlay when hasLoading is set', () => {
    render(<Dialog open hasLoading />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('does not render the loading overlay by default', () => {
    render(<Dialog open />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('dismisses via the secondary button and emits open-change', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Dialog open ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });

  it('defaults the wide variant to the large size', () => {
    render(<Dialog open variant="wide" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[832px]');
  });

  it('lets size override the variant default (wide at sm)', () => {
    render(<Dialog open variant="wide" size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'max-w-[var(--ui-dialog-container-size-sm)]'
    );
  });

  it('lets the footer prop replace the canned footer with free-form actions', () => {
    render(
      <Dialog
        open
        variant="wide"
        title="Configure discovery agent"
        footer={
          <>
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <Button>Configure</Button>
          </>
        }
      />
    );
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    // The canned wide-variant labels ("Confirm") must not also render.
    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument();
  });
});
