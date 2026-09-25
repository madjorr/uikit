import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `spacing-demo.stories.tsx`: it exists so
// design/QA can see the effect of the bare `--ui-font-size-*`/
// `--ui-font-weight-*`/`--ui-line-height-*`/`--ui-letter-spacing-*` custom
// properties (generated from the `font.*` primitive scales via dedicated
// build code, not a semantic token — see `resolveFontScalarTokens` in
// `tools/style-dictionary`) at every scale step, and doubles as a visual
// regression net for this feature going forward. `font-family` is
// deliberately absent from this demo — there is no `--ui-font-family-*` var
// (the kit ships no `@font-face`), so this story only exercises the four
// scalars that do get one.
const FONT_SIZES = [10, 11, 12, 14, 18, 20, 24, 32] as const;
const FONT_WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;
const LINE_HEIGHTS = [16, 20, 24, 32, 40, 48] as const;
const LETTER_SPACINGS = ['0', '0-3', '1'] as const;

function ScaleRow({
  label,
  style,
}: {
  label: string | number;
  style: React.CSSProperties;
}) {
  return (
    <div className="font-scale-row flex items-center gap-6 py-3">
      <span className="font-scale-label w-16 shrink-0 font-mono text-sm">
        {label}
      </span>
      <span className="font-scale-sample" style={style}>
        The quick brown fox jumps.
      </span>
    </div>
  );
}

function FontScaleDemo() {
  return (
    <div className="p-8">
      <style>{`
        .font-scale-row { border-bottom: 1px solid var(--ui-border-on-surface-divider); }
        .font-scale-label { color: var(--ui-text-on-surface-secondary); }
        .font-scale-sample { color: var(--ui-text-on-surface-primary); }
        .font-scale-heading { color: var(--ui-text-on-surface-primary); }
      `}</style>

      <h2 className="font-scale-heading mb-2 font-mono text-xs font-semibold uppercase">
        --ui-font-size-*
      </h2>
      {FONT_SIZES.map((size) => (
        <ScaleRow
          key={size}
          label={size}
          style={{ fontSize: `var(--ui-font-size-${size})` }}
        />
      ))}

      <h2 className="font-scale-heading mt-8 mb-2 font-mono text-xs font-semibold uppercase">
        --ui-font-weight-*
      </h2>
      {FONT_WEIGHTS.map((weight) => (
        <ScaleRow
          key={weight}
          label={weight}
          style={{ fontWeight: `var(--ui-font-weight-${weight})` }}
        />
      ))}

      <h2 className="font-scale-heading mt-8 mb-2 font-mono text-xs font-semibold uppercase">
        --ui-line-height-*
      </h2>
      {LINE_HEIGHTS.map((height) => (
        <ScaleRow
          key={height}
          label={height}
          style={{
            lineHeight: `var(--ui-line-height-${height})`,
            border: '1px dashed var(--ui-border-on-surface-border)',
          }}
        />
      ))}

      <h2 className="font-scale-heading mt-8 mb-2 font-mono text-xs font-semibold uppercase">
        --ui-letter-spacing-*
      </h2>
      {LETTER_SPACINGS.map((spacing) => (
        <ScaleRow
          key={spacing}
          label={spacing}
          style={{ letterSpacing: `var(--ui-letter-spacing-${spacing})` }}
        />
      ))}
    </div>
  );
}

const meta: Meta<typeof FontScaleDemo> = {
  title: 'Foundations/Font Scale',
  component: FontScaleDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live demo of the bare `--ui-font-size-*`/`--ui-font-weight-*`/' +
          '`--ui-line-height-*`/`--ui-letter-spacing-*` custom properties, ' +
          "generated from the `font.*` primitive scales for a consumer's " +
          'own local classes (as opposed to the preset `.ui-typography-*` ' +
          'combinations — see the Typography docs page). One row per scale ' +
          'step, grouped by family. `font-family` has no bare variable and ' +
          'is intentionally not shown here.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FontScaleDemo>;

export const FontScaleDemoStory: Story = {
  name: 'FontScaleDemo',
  render: () => <FontScaleDemo />,
};
