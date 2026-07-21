import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartPieIcon,
  CogIcon,
  MonitorIcon,
  ShieldCheckIcon,
} from '@acronis-platform/icons-react/stroke-mono';

// Design/QA aid, not a library component — never exported from `src/index.ts`,
// so no code from this file ships. It exists to prove the full-theming
// contract (PLTFRM-92644) end to end, alongside the two fixes that ship
// alongside it (PLTFRM-92495, PLTFRM-92642):
//
//   - Switch this Storybook's global "Brand" toolbar between `default` and
//     `deep_sky_itkontoret`, and "Mode" between light and dark — every color
//     below (Button, SidebarPrimary, the surface card, both text tones)
//     re-themes with zero extra imports.
//   - `--ui-text-on-surface-secondary` (the description copy below) now
//     correctly resolves per brand instead of a stale, brand-invariant literal
//     (PLTFRM-92495).
//   - Body copy renders in the library's font (Inter/system-ui), not the
//     browser's serif default — nothing here sets `font-family` explicitly
//     (PLTFRM-92642).
//
// This Storybook's own preview demonstrates the contract this story
// documents: `.storybook/preview.ts` imports only `../src/styles/index.css`
// (== `@acronis-platform/ui-react/styles`) and `.storybook/globals.ts` layers
// the brand's *bundled* override, `tokens-pd/css/<brand>.all.css`, when a
// non-default brand is selected — no per-component CSS import anywhere.
import { Button } from '../components/ui/button';
import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
} from '../components/ui/sidebar-primary';
import { TooltipProvider } from '../components/ui/tooltip';

const meta = {
  title: 'Foundations/Theming',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A real app only needs two root-level imports to get full theming — ' +
          "no component-level CSS import: `import '@acronis-platform/ui-react/styles'` " +
          "(base + every component's default tier) and, for a non-default brand, " +
          "`import '@acronis-platform/tokens-pd/css/<brand>.all.css'` (that brand's " +
          'semantic tier + every component tier, pre-bundled). Use the "Brand" and ' +
          '"Mode" toolbar controls above to see Button, SidebarPrimary, the surface ' +
          'card, and both text tones re-theme together.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrandAndModeShowcase: Story = {
  render: function BrandAndModeShowcaseStory() {
    return (
      <div className="flex h-[560px] w-full">
        <TooltipProvider delay={0}>
          <SidebarPrimary defaultExpanded className="shrink-0">
            <SidebarPrimaryHeader>Acronis</SidebarPrimaryHeader>
            <SidebarPrimaryContent>
              <SidebarPrimarySection>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<ChartPieIcon />} selected>
                    Intelligence
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />}>
                    Assets
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
                    Protection
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<CogIcon />}>
                    Settings
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimarySection>
            </SidebarPrimaryContent>
          </SidebarPrimary>
        </TooltipProvider>

        <main className="flex flex-1 items-start justify-center bg-[var(--ui-background-surface-secondary)] p-10">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-[var(--ui-background-surface-primary)] p-6">
            <h2 className="text-lg font-semibold text-[var(--ui-text-on-surface-primary)]">
              Protection overview
            </h2>
            {/* No font-family here — this inherits the library's global base font
                (PLTFRM-92642) and colors via --ui-text-on-surface-secondary, which
                now correctly resolves per brand instead of a stale literal
                (PLTFRM-92495). */}
            <p className="text-sm text-[var(--ui-text-on-surface-secondary)]">
              All workloads are protected and up to date. Switch the Brand and
              Mode controls in the toolbar above to see this card, the sidebar,
              and the buttons below re-theme together, with no extra imports.
            </p>
            <div className="flex gap-2">
              <Button variant="default">Run backup</Button>
              <Button variant="secondary">View report</Button>
            </div>
          </div>
        </main>
      </div>
    );
  },
};
