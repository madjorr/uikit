import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from '../popover';

function DemoPopover(props: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Popover defaultOpen={props.defaultOpen} onOpenChange={props.onOpenChange}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent data-testid="popup">
        <h4>Dimensions</h4>
        <p>Set the dimensions for the layer.</p>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default and opens from the trigger', async () => {
    const user = userEvent.setup();
    render(<DemoPopover />);
    expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('renders open with defaultOpen', () => {
    render(<DemoPopover defaultOpen />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('themes the popup from the --ui-popover-container-* tokens', () => {
    render(<DemoPopover defaultOpen />);
    expect(screen.getByTestId('popup')).toHaveClass(
      'bg-[var(--ui-popover-container-color)]',
      'border-[var(--ui-popover-container-border-color)]',
      'rounded-[var(--ui-popover-container-border-radius)]',
      'min-w-[var(--ui-popover-container-min-width)]',
      'max-w-[var(--ui-popover-container-max-width)]'
    );
  });

  it('renders PopoverBody with the --ui-popover-body-* rhythm tokens', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverBody data-testid="body">Content</PopoverBody>
        </PopoverContent>
      </Popover>
    );
    expect(screen.getByTestId('body')).toHaveClass(
      'gap-[var(--ui-popover-body-gap)]',
      'py-[var(--ui-popover-body-padding-y)]'
    );
  });

  it('renders PopoverFooter with the --ui-footer-* chrome tokens', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverFooter data-testid="footer">
            <button>Cancel</button>
            <button>Apply</button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass(
      'bg-[var(--ui-footer-default-color)]',
      'h-[var(--ui-footer-global-height)]'
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('forwards the ref on PopoverBody and PopoverFooter', () => {
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverBody ref={bodyRef}>Content</PopoverBody>
          <PopoverFooter ref={footerRef} />
        </PopoverContent>
      </Popover>
    );
    expect(bodyRef.current).toBeInstanceOf(HTMLElement);
    expect(footerRef.current).toBeInstanceOf(HTMLElement);
  });

  it('fires onOpenChange and closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DemoPopover defaultOpen onOpenChange={onOpenChange} />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>content</PopoverContent>
      </Popover>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
