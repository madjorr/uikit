// Figma Code Connect — status: COMPLETE
// Mapped to the "ui-react" Figma file's Table component family: TableHeaderCell
// (node 3427-207) -> TableHead, TableActions (4536-414), TableSettings
// (3698-497), TableDataCell (4536-97) -> TableCell's `column` variant, and
// TableDataRow (4536-699) -> TableRow's `selected` state. Row-selection
// checkboxes use the dedicated "TableCheckbox" node (3698-746), connected from
// `Checkbox` itself (see checkbox.figma.tsx) — Table has no separate checkbox
// component. TableFooter/TableCaption have no Figma counterpart (design has no
// footer/caption row), so they're intentionally unconnected.
import figma from '@figma/code-connect';

import { TableActions, TableCell, TableHead, TableRow, TableSettings } from './table';

figma.connect(
  TableHead,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3427-207',
  {
    props: {
      // idle/hover/active/focus are visual pseudo-states, not code props.
      sortable: figma.boolean('hasSortIcon'),
    },
    example: ({ sortable }) => <TableHead sortable={sortable}>Table header</TableHead>,
  }
);

figma.connect(
  TableActions,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-414',
  {
    // idle/hover/active/focus are visual pseudo-states, not code props.
    example: () => <TableActions aria-label="Row actions" />,
  }
);

figma.connect(
  TableSettings,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3698-497',
  {
    // idle/hover/active/focus are visual pseudo-states, not code props.
    example: () => <TableSettings aria-label="Column settings" />,
  }
);

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
    },
    example: ({ column }) => <TableCell column={column}>Simple value</TableCell>,
  }
);

figma.connect(
  TableRow,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4536-699',
  {
    props: {
      // hover/focused are visual/keyboard pseudo-states, not code props;
      // selectedChecked is `selected` + a checked row-leading checkbox.
      selected: figma.enum('state', {
        selected: true,
        selectedChecked: true,
      }),
    },
    example: ({ selected }) => (
      <TableRow selected={selected}>
        <TableCell>Simple value</TableCell>
      </TableRow>
    ),
  }
);
