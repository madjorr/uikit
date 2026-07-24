import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputOTP } from '../input-otp';

describe('InputOTP', () => {
  it('renders `length` slots, each with an accessible name', () => {
    render(<InputOTP length={4} />);
    expect(screen.getByLabelText('Digit 1 of 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 4 of 4')).toBeInTheDocument();
    expect(screen.queryByLabelText('Digit 5 of 4')).not.toBeInTheDocument();
  });

  it('defaults to 6 slots', () => {
    render(<InputOTP />);
    expect(screen.getByLabelText('Digit 6 of 6')).toBeInTheDocument();
  });

  it('numbers each empty slot placeholder by position', () => {
    render(<InputOTP length={3} />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveAttribute(
      'placeholder',
      '1'
    );
    expect(screen.getByLabelText('Digit 3 of 3')).toHaveAttribute(
      'placeholder',
      '3'
    );
  });

  it('advances focus to the next slot on digit entry and reports the value', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 3');
    await userEvent.type(slot1, '1');
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveFocus();
  });

  it('fires onComplete once the value reaches `length` characters', async () => {
    const onComplete = vi.fn();
    render(<InputOTP length={3} onComplete={onComplete} />);
    await userEvent.type(screen.getByLabelText('Digit 1 of 3'), '123');
    expect(onComplete).toHaveBeenCalledExactlyOnceWith('123');
  });

  it('clears the previous slot and moves back on Backspace from an empty slot', async () => {
    render(<InputOTP length={3} defaultValue="12" />);
    const slot3 = screen.getByLabelText('Digit 3 of 3');
    slot3.focus();
    await userEvent.keyboard('{Backspace}');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveValue('');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveFocus();
  });

  it('distributes a pasted code across the slots', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={4} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 4');
    slot1.focus();
    await userEvent.paste('1234');
    expect(onChange).toHaveBeenLastCalledWith('1234');
  });

  it('applies aria-invalid to every slot when `error` is set', () => {
    render(<InputOTP length={2} error />);
    expect(screen.getByLabelText('Digit 1 of 2')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Digit 2 of 2')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('disables every slot when `disabled` is set', () => {
    render(<InputOTP length={2} disabled />);
    expect(screen.getByLabelText('Digit 1 of 2')).toBeDisabled();
    expect(screen.getByLabelText('Digit 2 of 2')).toBeDisabled();
  });

  it('focuses the first slot when `autoFocus` is set', () => {
    render(<InputOTP length={3} autoFocus />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveFocus();
  });

  it('supports a controlled value', () => {
    render(<InputOTP length={3} value="12" onChange={() => {}} />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveValue('1');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveValue('2');
    expect(screen.getByLabelText('Digit 3 of 3')).toHaveValue('');
  });

  it('forwards the ref to the root group element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<InputOTP ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'group');
  });
});
