// Figma Code Connect — status: COMPLETE
// Maps the Figma "Table" component family (fileKey lrU3ydIyvPYQNE6ixdsKtJ) to
// this package's table primitives. Two Figma nodes have no direct mapping:
// - `tableHeaderSortIcon` (3435-268) is folded into `TableHeaderCell`'s own
//   `sortDirection` prop, not exported separately.
// - The page-frame node (2948-2416) is a composition board, not a component;
//   its `TableHeaderRow`/`TableDataRow` slot layout is what informed
//   `Table`/`TableHeader`/`TableBody` composing plain `TableRow`s.
import figma from '@figma/code-connect';

import { Checkbox } from '../checkbox';
import { Tag } from '../tag';
import {
  TableActions,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableSettings,
} from './table';

// TableHeaderCell — header label with an optional 3-state sort affordance.
figma.connect(
  TableHeaderCell,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3427-207',
  {
    props: {
      children: figma.string('Value'),
      hasSort: figma.boolean('hasSortIcon'),
    },
    example: ({ children, hasSort }) =>
      hasSort ? (
        <TableHeaderCell sortDirection={false} onSort={() => {}}>
          {children}
        </TableHeaderCell>
      ) : (
        <TableHeaderCell>{children}</TableHeaderCell>
      ),
  }
);

// TableActions — per-row "more actions" kebab control.
figma.connect(
  TableActions,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-414',
  {
    example: () => <TableActions aria-label="Row actions" />,
  }
);

// TableSettings — header column-settings gear control.
figma.connect(
  TableSettings,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-497',
  {
    example: () => <TableSettings aria-label="Column settings" />,
  }
);

// TableCheckbox — row/header selection reuses the existing Checkbox as-is;
// the Figma wrapper adds no styling beyond TableCell's own padding.
figma.connect(
  Checkbox,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-746',
  {
    props: {
      variant: figma.enum('variant', {
        checked: true,
      }),
    },
    example: ({ variant }) => (
      <Checkbox aria-label="Select row" defaultChecked={variant} />
    ),
  }
);

// TableDataCell — content-type variants are composition patterns over
// TableCell (icon/status/severity/date/tag), not separate props.
figma.connect(
  TableCell,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-97',
  {
    props: {
      column: figma.enum('column', {
        text: 'text',
        iconText: 'iconText',
        status: 'status',
        severity: 'severity',
        date: 'date',
        tag: 'tag',
      }),
      value: figma.string('value'),
    },
    example: ({ column, value }) =>
      column === 'tag' ? (
        <TableCell>
          <Tag variant="info">{value}</Tag>
        </TableCell>
      ) : (
        <TableCell>{value}</TableCell>
      ),
  }
);

// TableDataRow — row states (idle/hover/selected/focused); hover is a CSS
// pseudo-state and focused is the shared focus-within ring, so only
// `selected` maps to a real prop.
figma.connect(
  TableRow,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-699',
  {
    props: {
      selected: figma.enum('state', {
        selected: true,
        selectedChecked: true,
      }),
    },
    example: ({ selected }) => (
      <TableRow selected={selected}>
        <TableCell>Value</TableCell>
      </TableRow>
    ),
  }
);
