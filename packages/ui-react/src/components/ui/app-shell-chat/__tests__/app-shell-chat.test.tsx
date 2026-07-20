import { createRef } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SidebarPrimary } from '../../sidebar-primary';
import {
  AppShellChat,
  AppShellChatChat,
  AppShellChatChatBody,
  AppShellChatChatHeader,
  AppShellChatContent,
  AppShellChatContentBody,
  AppShellChatContentHeader,
  AppShellChatSidebar,
  getAppShellChatInitialLayout,
  getLiveChatDefaultWidth,
  useAppShellChatInitialLayout,
} from '../app-shell-chat';

// happy-dom's default `window.innerWidth` (1024) sits in the narrowest
// breakpoint tier, so tests that care about the WIDE (512px, both sidebars
// open) tier need to stub a wider viewport. Restored after every test so the
// stub can't leak into an unrelated one.
const ORIGINAL_INNER_WIDTH = window.innerWidth;
function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
}
afterEach(() => setViewportWidth(ORIGINAL_INNER_WIDTH));

describe('AppShellChat', () => {
  it('renders every part', () => {
    const { container } = render(
      <AppShellChat>
        <AppShellChatSidebar>nav</AppShellChatSidebar>
        <AppShellChatContent>
          <AppShellChatContentHeader>header</AppShellChatContentHeader>
          <AppShellChatContentBody>body</AppShellChatContentBody>
        </AppShellChatContent>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
          <AppShellChatChatBody>chat</AppShellChatChatBody>
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(
      container.querySelector('[data-slot="app-shell-chat"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('aside[data-slot="app-shell-chat-sidebar"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="app-shell-chat-content"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="app-shell-chat-content-header"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="app-shell-chat-content-body"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('aside[data-slot="app-shell-chat-chat"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="app-shell-chat-chat-header"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="app-shell-chat-chat-body"]')
    ).toBeInTheDocument();
  });

  it('renders with only SidebarPrimary in the rail — SidebarSecondary is optional', () => {
    const { container } = render(
      <AppShellChat>
        <AppShellChatSidebar>
          <SidebarPrimary aria-label="Primary" />
        </AppShellChatSidebar>
        <AppShellChatContent>content</AppShellChatContent>
      </AppShellChat>
    );
    const sidebar = container.querySelector(
      'aside[data-slot="app-shell-chat-sidebar"]'
    );
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    // No second nav landmark — SidebarSecondary was never rendered.
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
  });

  it('shows the chat header label at the default width', () => {
    setViewportWidth(1920); // wide tier — uncontrolled Chat starts at 512px
    render(
      <AppShellChatChat>
        <AppShellChatChatHeader label="Acronis AI" />
      </AppShellChatChat>
    );
    expect(screen.getByText('Acronis AI')).toBeInTheDocument();
  });

  it('shows the icon-only rail (no visible label) at the min width, but keeps an accessible name', () => {
    const { container } = render(
      <AppShellChatChat width={48}>
        <AppShellChatChatHeader label="Acronis AI" />
      </AppShellChatChat>
    );
    // The Acronis mark renders as an svg…
    expect(container.querySelector('svg')).toBeInTheDocument();
    // …the full title is not rendered as visible text (that's the expanded
    // header's own span, absent here)…
    expect(
      container.querySelector('.ui-typography-headings-title')
    ).not.toBeInTheDocument();
    // …but the label stays in the DOM as `sr-only` (same pattern
    // `SidebarPrimaryMenuItem` uses), so the icon-only trigger still has a
    // real accessible name instead of none at all.
    expect(screen.getByText('Acronis AI')).toHaveClass('sr-only');
    // The chat panel reflects the collapsed (icon-only) visual state.
    expect(
      container.querySelector('[data-slot="app-shell-chat-chat"]')
    ).toHaveAttribute('data-state', 'collapsed');
  });

  it('keeps an accessible name at the min width even when the label is a non-string ReactNode', () => {
    render(
      <AppShellChatChat width={48}>
        <AppShellChatChatHeader label={<strong>Acronis AI</strong>} />
      </AppShellChatChat>
    );
    // A `typeof label === 'string'` check would leave this with NO
    // accessible name at all — the sr-only span renders the real node
    // (any ReactNode), not a derived string.
    expect(screen.getByText('Acronis AI').closest('.sr-only')).not.toBeNull();
  });

  it('hides the chat body at the min width', () => {
    render(
      <AppShellChatChat width={48}>
        <AppShellChatChatBody>Chat body</AppShellChatChatBody>
      </AppShellChatChat>
    );
    expect(screen.getByText('Chat body')).toHaveClass('hidden');
  });

  it('renders a resize separator', () => {
    render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatBody>Chat</AppShellChatChatBody>
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(
      screen.getByRole('separator', { name: /resize chat/i })
    ).toBeInTheDocument();
  });

  it('double-clicking the resize edge resets the width', async () => {
    setViewportWidth(1920); // wide tier — the live default is 512px
    const onWidthChange = vi.fn();
    render(
      <AppShellChat>
        <AppShellChatChat width={800} onWidthChange={onWidthChange}>
          <AppShellChatChatBody>Chat</AppShellChatChatBody>
        </AppShellChatChat>
      </AppShellChat>
    );
    const edge = screen.getByRole('separator', { name: /resize chat/i });
    await userEvent.dblClick(edge);
    expect(onWidthChange).toHaveBeenCalledWith(512);
  });

  it('resizes with the arrow keys and resets with Home', async () => {
    setViewportWidth(1920); // wide tier — uncontrolled Chat starts at 512px
    const onWidthChange = vi.fn();
    render(
      <AppShellChat>
        <AppShellChatChat onWidthChange={onWidthChange}>
          <AppShellChatChatBody>Chat</AppShellChatChatBody>
        </AppShellChatChat>
      </AppShellChat>
    );
    const edge = screen.getByRole('separator', { name: /resize chat/i });
    edge.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onWidthChange).toHaveBeenLastCalledWith(528);
    await userEvent.keyboard('{ArrowRight}');
    expect(onWidthChange).toHaveBeenLastCalledWith(512);
    await userEvent.keyboard('{Home}');
    expect(onWidthChange).toHaveBeenLastCalledWith(512);
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShellChat ref={ref}>
        <AppShellChatContent>x</AppShellChatContent>
      </AppShellChat>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'app-shell-chat');
  });

  it('forwards a ref to the chat panel', () => {
    const chatRef = createRef<HTMLElement>();
    render(
      <AppShellChat>
        <AppShellChatChat ref={chatRef}>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(chatRef.current?.tagName).toBe('ASIDE');
  });
});

describe('getAppShellChatInitialLayout (sidebars — frozen at mount)', () => {
  it('returns the wide layout (both sidebars open) at 1680px and up', () => {
    expect(getAppShellChatInitialLayout(1920)).toEqual({
      primaryExpanded: true,
      secondaryExpanded: true,
    });
    expect(getAppShellChatInitialLayout(1680)).toEqual({
      primaryExpanded: true,
      secondaryExpanded: true,
    });
  });

  it('returns the narrow layout (primary closed) below 1680px, all the way down', () => {
    expect(getAppShellChatInitialLayout(1679)).toEqual({
      primaryExpanded: false,
      secondaryExpanded: true,
    });
    expect(getAppShellChatInitialLayout(1280)).toEqual({
      primaryExpanded: false,
      secondaryExpanded: true,
    });
    expect(getAppShellChatInitialLayout(600)).toEqual({
      primaryExpanded: false,
      secondaryExpanded: true,
    });
  });

  it('falls back to the wide layout when there is no viewport width to measure', () => {
    expect(getAppShellChatInitialLayout(undefined)).toEqual({
      primaryExpanded: true,
      secondaryExpanded: true,
    });
  });
});

describe('useAppShellChatInitialLayout (sidebars — frozen at mount)', () => {
  it('resolves from the viewport width at first render', () => {
    setViewportWidth(1440);
    const { result } = renderHook(() => useAppShellChatInitialLayout());
    expect(result.current).toEqual({
      primaryExpanded: false,
      secondaryExpanded: true,
    });
  });

  it('never re-resolves after mount, even if the viewport changes', () => {
    setViewportWidth(1920);
    const { result } = renderHook(() => useAppShellChatInitialLayout());
    expect(result.current.primaryExpanded).toBe(true);

    setViewportWidth(1024);
    window.dispatchEvent(new Event('resize'));
    expect(result.current.primaryExpanded).toBe(true);
  });
});

describe('getLiveChatDefaultWidth', () => {
  it('returns 512px at 1680px and up', () => {
    expect(getLiveChatDefaultWidth(1920)).toBe(512);
    expect(getLiveChatDefaultWidth(1680)).toBe(512);
  });

  it('returns 448px from 1280px up to 1680px', () => {
    expect(getLiveChatDefaultWidth(1679)).toBe(448);
    expect(getLiveChatDefaultWidth(1280)).toBe(448);
  });

  it('returns 48px (icon rail) below 1280px', () => {
    expect(getLiveChatDefaultWidth(1279)).toBe(48);
    expect(getLiveChatDefaultWidth(600)).toBe(48);
  });

  it('falls back to 512px when there is no viewport width to measure', () => {
    expect(getLiveChatDefaultWidth(undefined)).toBe(512);
  });
});

describe('AppShellChat — Chat width is live (unlike the sidebars)', () => {
  it('starts Chat compact (48px, icon-only) at a 1024px viewport, uncontrolled', () => {
    setViewportWidth(1024);
    const { container } = render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(
      container.querySelector('[data-slot="app-shell-chat-chat"]')
    ).toHaveAttribute('data-state', 'collapsed');
    // The full (visible) title is absent — only the `sr-only` variant renders.
    expect(
      container.querySelector('.ui-typography-headings-title')
    ).not.toBeInTheDocument();
  });

  it('starts Chat expanded at a 1920px viewport, uncontrolled', () => {
    setViewportWidth(1920);
    render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(screen.getByText('Acronis AI')).toBeInTheDocument();
  });

  it('reflows live when the viewport changes after mount, as long as the user has not manually resized', () => {
    setViewportWidth(1024);
    const { container } = render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(
      container.querySelector('.ui-typography-headings-title')
    ).not.toBeInTheDocument();

    setViewportWidth(1920);
    act(() => window.dispatchEvent(new Event('resize')));
    expect(screen.getByText('Acronis AI')).toHaveClass('ui-typography-headings-title');
  });

  it('stops reflowing once the user has manually resized it', async () => {
    setViewportWidth(1920);
    render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    expect(screen.getByText('Acronis AI')).toBeInTheDocument();

    const edge = screen.getByRole('separator', { name: /resize chat/i });
    edge.focus();
    await userEvent.keyboard('{ArrowLeft}'); // establishes an explicit override (528px)

    setViewportWidth(1024); // would otherwise live-reflow to the 48px compact tier
    act(() => window.dispatchEvent(new Event('resize')));
    expect(screen.getByText('Acronis AI')).toBeInTheDocument();
  });

  it('restores live viewport tracking after a double-click/Home reset, instead of freezing at the reset value', async () => {
    setViewportWidth(1920);
    const { container } = render(
      <AppShellChat>
        <AppShellChatChat>
          <AppShellChatChatHeader label="Acronis AI" />
        </AppShellChatChat>
      </AppShellChat>
    );
    const edge = screen.getByRole('separator', { name: /resize chat/i });
    edge.focus();
    await userEvent.keyboard('{ArrowLeft}'); // establishes an explicit override
    expect(screen.getByText('Acronis AI')).toHaveClass('ui-typography-headings-title');

    await userEvent.keyboard('{Home}'); // reset — must clear the override, not just set it to 512
    setViewportWidth(1024); // if the override were still active, this would have no effect
    act(() => window.dispatchEvent(new Event('resize')));
    expect(
      container.querySelector('.ui-typography-headings-title')
    ).not.toBeInTheDocument();
  });
});
