import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build scans, so nothing here
// ships. It exists so design/UX can pick a viewport from the toolbar above
// and see, live, which of ui-react's pinned breakpoints (`src/styles/index.css`'s
// `@theme` block) is active at that width — to sign off on the overrides
// against Tailwind's stock scale before they land in a real component.
//
// Named viewports scoped to this story only (not the whole Storybook) so the
// toolbar for every other component's stories keeps Storybook's own default
// viewport presets.
const BREAKPOINT_VIEWPORTS = {
  sm: {
    name: 'sm — 640px (Tailwind default, unchanged)',
    styles: { width: '640px', height: '400px' },
    type: 'desktop',
  },
  md: {
    name: 'md — 768px (Tailwind default, unchanged)',
    styles: { width: '768px', height: '400px' },
    type: 'desktop',
  },
  lg: {
    name: 'lg — 1024px (unchanged)',
    styles: { width: '1024px', height: '400px' },
    type: 'desktop',
  },
  xl: {
    name: 'xl — 1280px (matches Tailwind default; design range 1281-1440)',
    styles: { width: '1280px', height: '400px' },
    type: 'desktop',
  },
  '2xl': {
    name: '2xl — 1440px (was 1536px)',
    styles: { width: '1440px', height: '400px' },
    type: 'desktop',
  },
  '3xl': {
    name: '3xl — 1680px (new step)',
    styles: { width: '1680px', height: '400px' },
    type: 'desktop',
  },
  '4xl': {
    name: '4xl — 1920px (new step)',
    styles: { width: '1920px', height: '400px' },
    type: 'desktop',
  },
} as const;

// A single box whose border/background color and label swap at each pinned
// breakpoint. Colors are plain Tailwind palette utilities, not `--ui-*`
// tokens — this is diagnostic tooling, not shipped UI, so the "every color
// resolves to a token" rule doesn't apply here.
//
// Font size scales up with each step too — reviewing the large breakpoints
// (xl/2xl/3xl) usually means zooming the browser out to fit that width on a
// normal monitor, which shrinks everything on screen proportionally. Scaling
// the label up as the breakpoint grows keeps it legible after that zoom-out
// instead of shrinking to unreadable.
function BreakpointIndicator() {
  return (
    <div
      className={[
        'flex min-h-40 w-full items-center justify-center rounded-lg border-4 p-6 text-center',
        'border-gray-400 bg-gray-100 text-gray-700',
        'sm:border-blue-400 sm:bg-blue-50 sm:text-blue-700',
        'md:border-teal-400 md:bg-teal-50 md:text-teal-700',
        'lg:border-green-500 lg:bg-green-50 lg:text-green-700',
        'xl:border-yellow-500 xl:bg-yellow-50 xl:text-yellow-800',
        '2xl:border-orange-500 2xl:bg-orange-50 2xl:text-orange-800',
        '3xl:border-red-500 3xl:bg-red-50 3xl:text-red-800',
        '4xl:border-purple-500 4xl:bg-purple-50 4xl:text-purple-800',
        'font-mono text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl',
      ].join(' ')}
    >
      <span className="block sm:hidden">base — below 640px</span>
      <span className="hidden sm:max-md:block">
        sm — 640-767px (Tailwind default)
      </span>
      <span className="hidden md:max-lg:block">
        md — 768-1023px (Tailwind default)
      </span>
      <span className="hidden lg:max-xl:block">lg — 1024-1279px</span>
      <span className="hidden xl:max-2xl:block">
        xl — 1280-1439px (ours; design range 1281-1440, rounded to 1280px for
        a clean rem value)
      </span>
      <span className="hidden 2xl:max-3xl:block">
        2xl — 1440-1679px (ours; design range 1441-1680, rounded to 1440px
        for a clean rem value)
      </span>
      <span className="hidden 3xl:max-4xl:block">
        3xl — 1680-1919px (new step; design range 1681-1920, rounded to
        1680px for a clean rem value)
      </span>
      <span className="hidden 4xl:block">
        4xl — 1920px+ (new step, beyond the given design ranges)
      </span>
    </div>
  );
}

const meta: Meta<typeof BreakpointIndicator> = {
  title: 'Foundations/Breakpoints',
  component: BreakpointIndicator,
  parameters: {
    layout: 'fullscreen',
    viewport: { options: BREAKPOINT_VIEWPORTS },
    docs: {
      description: {
        component:
          'Live demo of the breakpoint scale pinned in `src/styles/index.css`. ' +
          'Pick a named viewport from the toolbar above (sm / md / lg / xl / ' +
          '2xl / 3xl / 4xl) to see which step is active at that width.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BreakpointIndicator>;

export const BreakpointsDemo: Story = {
  render: () => (
    <div className="p-8">
      <BreakpointIndicator />
    </div>
  ),
};
