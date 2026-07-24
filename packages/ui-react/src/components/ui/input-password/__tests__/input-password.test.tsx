import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputPassword } from '../input-password';

describe('InputPassword', () => {
  it('renders a labelled password input associated via htmlFor/id', () => {
    render(<InputPassword label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputPassword label="Password" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    // The label's raw text content is "Password*"; match with a regex since
    // `type="password"` has no ARIA role to query by accessible name.
    expect(screen.getByLabelText(/Password/)).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('shows the description when no error is set', () => {
    render(<InputPassword label="Password" description="At least 8 characters" />);
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('replaces the description with the error message and sets aria-invalid', () => {
    render(
      <InputPassword
        label="Password"
        description="At least 8 characters"
        error="Too short"
      />
    );
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('toggles between password and text on reveal, updating the accessible name', async () => {
    render(<InputPassword label="Password" defaultValue="secret" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const toggle = screen.getByRole('button', { name: 'Show password' });
    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('supports custom toggle accessible-name overrides', () => {
    render(
      <InputPassword
        label="Password"
        showPasswordLabel="Reveal"
        hidePasswordLabel="Conceal"
      />
    );
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('disables the input and the toggle button together', () => {
    render(<InputPassword label="Password" disabled />);
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputPassword label="Password" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards arbitrary input props', async () => {
    const onChange = vi.fn();
    render(<InputPassword label="Password" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Password'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
