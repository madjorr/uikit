'use client';

import { useState } from 'react';
import { CardFilter } from '@acronis-platform/ui-react';
import { ServerIcon, CircleWarningIcon } from '@acronis-platform/icons-react/stroke-mono';

export function CardFilterDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <CardFilter variant="static" label="Total workloads" value="128" icon={<ServerIcon />} />
      <CardFilter
        variant="clickable"
        label="Alerts"
        value="7"
        icon={<CircleWarningIcon />}
        selected={selected}
        onClick={() => setSelected((prev) => !prev)}
      />
      <CardFilter variant="static-empty" label="Pending" />
    </>
  );
}
