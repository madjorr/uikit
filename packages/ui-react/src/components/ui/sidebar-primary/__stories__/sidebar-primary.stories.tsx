import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoltIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartGrowthIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  HeadsetIcon,
  InboxIcon,
  LayoutGridIcon,
  MonitorIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Tag } from '../../tag';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
} from '../sidebar-primary';

const meta = {
  title: 'UI/SidebarPrimary',
  component: SidebarPrimary,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    expanded: {
      control: 'boolean',
      description:
        'Controlled rail-width state. When set, the consumer owns it and the trigger only emits `onExpandedChange`. `data-state="expanded|collapsed"` drives every token switch.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultExpanded: {
      control: 'boolean',
      description:
        'Uncontrolled initial expanded state. Ignored when `expanded` is provided.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'State',
      },
    },
    onExpandedChange: {
      control: false,
      description:
        'Fires with the next expanded value whenever the rail toggles (e.g. via the collapse trigger), in both controlled and uncontrolled modes.',
      table: {
        type: { summary: '(expanded: boolean) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Replace the rendered `<nav>` with another element or component (Base UI composition). Accepts a React element or a render function.',
      table: { type: { summary: 'useRender.RenderProp' }, category: 'Composition' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Primary'" },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      description:
        'Composed sidebar parts (Header, Content, Section, Menu, Footer, …).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof SidebarPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

// A stand-in for the consumer-slotted product logo (R7) — the Header just sizes
// whatever img/svg lands inside it.
function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Acronis">
      <path d="M12 2 2 22h20L12 2Zm0 6 5 10H7l5-10Z" />
    </svg>
  );
}

function Shell({
  children,
  height = 620,
}: {
  children: React.ReactNode;
  /** Fixed viewport height — sidebars fill their container (`h-full`). */
  height?: number;
}) {
  return <div style={{ height, display: 'flex' }}>{children}</div>;
}

// The Acronis Cyber Platform nav from the Figma example: a primary section of
// product areas plus a secondary section (inbox / favorites).
function PrimaryNav() {
  return (
    <SidebarPrimaryContent>
      <SidebarPrimarySection>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
            Assets
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
            Protection management
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
            Clients
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<HeadsetIcon />}>
            Service desk
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<BoltIcon />}>
            Automation
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
            Marketplace
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<ChartGrowthIcon />}>
            Partner portal
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<BuildingIcon />}>
            My company
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimarySection>
      <SidebarPrimarySection>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
            My inbox
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
            Favorites
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimarySection>
    </SidebarPrimaryContent>
  );
}

// The Figma example always pairs the footer's "Collapse menu" row with a
// `⌘H` shortcut extras — keep the demo content honest to that.
function FooterNav() {
  return (
    <SidebarPrimaryFooter>
      <SidebarPrimaryMenu>
        <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
          Help
        </SidebarPrimaryMenuItem>
        {/* Uncontrolled rail: the trigger toggles `expanded` via context. */}
        <SidebarPrimaryCollapseTrigger
          icon={<ChevronsLeftIcon />}
          extras={<SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />}
        >
          Collapse menu
        </SidebarPrimaryCollapseTrigger>
      </SidebarPrimaryMenu>
    </SidebarPrimaryFooter>
  );
}

export const Default: Story = {
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <LogoMark />
        </SidebarPrimaryHeader>
        <PrimaryNav />
        <FooterNav />
      </SidebarPrimary>
    </Shell>
  ),
};

export const Collapsed: Story = {
  name: 'Collapsed (rail)',
  render: () => (
    <Shell>
      <SidebarPrimary expanded={false}>
        <SidebarPrimaryHeader>
          <LogoMark />
        </SidebarPrimaryHeader>
        <PrimaryNav />
        <FooterNav />
      </SidebarPrimary>
    </Shell>
  ),
};

export const Selected: Story = {
  name: 'Selected vs unselected',
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
                Selected item
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
                Unselected item
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
                Another item
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
    </Shell>
  ),
};

export const ExtrasVariants: Story = {
  name: 'MenuItemExtras — all variants',
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem
                href="#"
                icon={<StarIcon />}
                extras={
                  <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />
                }
              >
                Shortcut
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem
                href="#"
                icon={<LayoutGridIcon />}
                extras={<SidebarPrimaryMenuItemExtras variant="externalLink" />}
              >
                External link
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem
                href="#"
                icon={<BoltIcon />}
                extras={
                  <SidebarPrimaryMenuItemExtras
                    variant="tag"
                    tag={
                      <Tag variant="info" size="sm">
                        New
                      </Tag>
                    }
                  />
                }
              >
                Tag
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem
                href="#"
                icon={<BriefcaseIcon />}
                extras={
                  <SidebarPrimaryMenuItemExtras
                    variant="tag-externalLink"
                    tag={
                      <Tag variant="info" size="sm">
                        Beta
                      </Tag>
                    }
                  />
                }
              >
                Tag + external link
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
    </Shell>
  ),
};

export const Sections: Story = {
  name: 'Multiple sections',
  render: () => (
    <Shell>
      <SidebarPrimary>
        <SidebarPrimaryContent>
          {/* First section: no top divider/padding-top (anatomy.yaml `firstSection`). */}
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
                Assets
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
                Protection management
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
          {/* Every following section gets a top divider (`:not(:first-child)`). */}
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
                My inbox
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
                Favorites
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              {/* `icon` is optional — the label just starts flush left. */}
              <SidebarPrimaryMenuItem href="#">General settings</SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<BuildingIcon />}>
                My company
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
      </SidebarPrimary>
    </Shell>
  ),
};

export const StickyFooter: Story = {
  name: 'Overflow (sticky header/footer)',
  render: () => (
    // A short viewport forces `SidebarPrimaryContent` to scroll internally
    // (`flex-1 overflow-y-auto`); the header and footer are `shrink-0` flex
    // siblings, so they stay pinned and fully visible regardless of how much
    // content is above/below them — no extra "sticky" wiring needed.
    <Shell height={280}>
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <LogoMark />
        </SidebarPrimaryHeader>
        <PrimaryNav />
        <FooterNav />
      </SidebarPrimary>
    </Shell>
  ),
};

export const Controlled: Story = {
  name: 'Controlled expand/collapse',
  render: function ControlledRail() {
    const [expanded, setExpanded] = useState(true);
    return (
      <Shell>
        <SidebarPrimary expanded={expanded} onExpandedChange={setExpanded}>
          <SidebarPrimaryHeader>
            <LogoMark />
          </SidebarPrimaryHeader>
          <SidebarPrimaryContent>
            <SidebarPrimarySection>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
                  Assets
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
                  Protection management
                </SidebarPrimaryMenuItem>
              </SidebarPrimaryMenu>
            </SidebarPrimarySection>
          </SidebarPrimaryContent>
          <FooterNav />
        </SidebarPrimary>
      </Shell>
    );
  },
};
