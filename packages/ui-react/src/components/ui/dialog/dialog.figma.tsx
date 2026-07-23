// Figma Code Connect — DialogRoot: status NEEDS_FIGMA_URL, Dialog: COMPLETE
// DialogRoot (the composable primitive) is internal-only and was ported from
// ui-legacy without a "ready for dev" Figma node — only the node URL is
// missing below. Replace 'FIGMA_NODE_URL' with the component-set link and
// flip the status via `/figma-component Dialog <url> --update`.
// Dialog (the public component) is mapped to the "DialogDefault" component set
// in the ui-react Figma file (node 6343:58898) — the code-facing name stays
// `Dialog`; only the Figma component is named "DialogDefault". Property names
// verified via get_context_for_code_connect: `variant` (variant enum),
// `hasLoading` (boolean), `DialogBody` (slot → children). The `wide` variant
// (legacy free-form footer, kept for backward compatibility) has no Figma
// counterpart and is intentionally left out of the mapping below.
import figma from '@figma/code-connect';

import {
  DialogRoot,
  DialogBody,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

figma.connect(DialogRoot, 'FIGMA_NODE_URL', {
  example: () => (
    <DialogRoot defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Description</DialogDescription>
        </DialogBody>
        <DialogFooter>Actions</DialogFooter>
      </DialogContent>
    </DialogRoot>
  ),
});

figma.connect(
  Dialog,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6343-58898',
  {
    props: {
      variant: figma.enum('variant', {
        default: 'default',
        rename: 'rename',
        'save changes': 'save changes',
        'reset password': 'reset password',
        'discard changes': 'discard changes',
        accept: 'accept',
        'read-only': 'read-only',
      }),
      hasLoading: figma.boolean('hasLoading'),
      children: figma.children('DialogBody'),
    },
    example: ({ variant, hasLoading, children }) => (
      <Dialog variant={variant} hasLoading={hasLoading} defaultOpen>
        {children}
      </Dialog>
    ),
  }
);
