import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `font-scale-demo.stories.tsx`: it exists so
// design/QA can see the effect of the bare `--ui-size-*`/`--ui-radius-*`/
// `--ui-stroke-*` custom properties (generated from the `units.{size,radius,
// stroke}` primitive scales via dedicated build code, not a semantic token —
// see `resolveUnitsScalarTokens` in `tools/style-dictionary`) at every scale
// step, and doubles as a visual regression net for this feature going
// forward. Unlike `units.gap`, none of these three get a utility-class
// grammar — only the bare vars — so this demo applies them via inline
// `style`, same as the font scale demo.
const SIZES = [
  6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 76, 96, 128, 224, 256, 320,
  384, 512, 632,
] as const;
const RADII = [2, 4, 8, 12, 16, 24, 'full'] as const;
const STROKES = ['1', '1-6', '2', '2-5', '3'] as const;

function ScaleRow({
  label,
  children,
}: {
  label: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="units-scale-row flex items-center gap-6 py-3">
      <span className="units-scale-label w-16 shrink-0 font-mono text-sm">
        {label}
      </span>
      {children}
    </div>
  );
}

function UnitsScaleDemo() {
  return (
    <div className="p-8">
      <style>{`
        .units-scale-row { border-bottom: 1px solid var(--ui-border-on-surface-divider); }
        .units-scale-label { color: var(--ui-text-on-surface-secondary); }
        .units-scale-heading { color: var(--ui-text-on-surface-primary); }
        .units-scale-swatch { background-color: var(--ui-background-brand-primary-active); }
        .units-scale-box { border: 1px dashed var(--ui-border-on-surface-border); }
      `}</style>

      <h2 className="units-scale-heading mb-2 font-mono text-xs font-semibold uppercase">
        --ui-size-*
      </h2>
      {SIZES.map((size) => (
        <ScaleRow key={size} label={size}>
          <div
            className="units-scale-swatch shrink-0"
            style={{
              width: `var(--ui-size-${size})`,
              height: `var(--ui-size-${size})`,
              maxWidth: '128px',
              maxHeight: '128px',
            }}
          />
        </ScaleRow>
      ))}

      <h2 className="units-scale-heading mt-8 mb-2 font-mono text-xs font-semibold uppercase">
        --ui-radius-*
      </h2>
      {RADII.map((radius) => (
        <ScaleRow key={radius} label={radius}>
          <div
            className="units-scale-swatch size-16 shrink-0"
            style={{ borderRadius: `var(--ui-radius-${radius})` }}
          />
        </ScaleRow>
      ))}

      <h2 className="units-scale-heading mt-8 mb-2 font-mono text-xs font-semibold uppercase">
        --ui-stroke-*
      </h2>
      {STROKES.map((stroke) => (
        <ScaleRow key={stroke} label={stroke}>
          <div
            className="units-scale-box size-16 shrink-0"
            style={{
              borderWidth: `var(--ui-stroke-${stroke})`,
              borderStyle: 'solid',
              borderColor: 'var(--ui-border-on-surface-border-active)',
            }}
          />
        </ScaleRow>
      ))}
    </div>
  );
}

const meta: Meta<typeof UnitsScaleDemo> = {
  title: 'Foundations/Units Scale',
  component: UnitsScaleDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live demo of the bare `--ui-size-*`/`--ui-radius-*`/`--ui-stroke-*` ' +
          'custom properties, generated from the `units.{size,radius,stroke}` ' +
          "primitive scales for a consumer's own local classes. One row per " +
          'scale step, grouped by family. Unlike `units.gap`, none of these ' +
          'three also emit a utility-class grammar — see the Spacing demo for ' +
          'that.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof UnitsScaleDemo>;

export const UnitsScaleDemoStory: Story = {
  name: 'UnitsScaleDemo',
  render: () => <UnitsScaleDemo />,
};
