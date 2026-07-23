import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DialogWelcome } from '../dialog-welcome';

const baseProps = {
  title: 'Welcome',
  description: 'Feature description.',
};

describe('DialogWelcome', () => {
  it('labels the dialog with the title and renders the description', () => {
    render(<DialogWelcome {...baseProps} open />);
    const dialog = screen.getByRole('dialog', { name: 'Welcome' });
    expect(
      within(dialog).getByText('Feature description.')
    ).toBeInTheDocument();
  });

  it('renders the image slot content', () => {
    render(
      <DialogWelcome
        {...baseProps}
        open
        image={<img alt="Welcome illustration" src="welcome.png" />}
      />
    );
    expect(
      screen.getByRole('img', { name: 'Welcome illustration' })
    ).toBeInTheDocument();
  });

  it('renders without an image', () => {
    render(<DialogWelcome {...baseProps} open />);
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders no footer controls (footer/carousel is out of scope)', () => {
    render(<DialogWelcome {...baseProps} open />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('lets children override the title + description text block', () => {
    render(
      <DialogWelcome {...baseProps} open>
        <p>Custom body content</p>
      </DialogWelcome>
    );
    expect(screen.getByText('Custom body content')).toBeInTheDocument();
    expect(screen.queryByText('Feature description.')).not.toBeInTheDocument();
  });

  it('emits open-change when dismissed with Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogWelcome {...baseProps} defaultOpen onOpenChange={onOpenChange} />
    );
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DialogWelcome {...baseProps} open ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });
});
