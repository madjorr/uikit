// Figma Code Connect — Dialog: status NEEDS_FIGMA_URL, DialogDefault: COMPLETE
// Dialog is a compositional overlay (no variant/size props) ported from
// ui-legacy without a "ready for dev" Figma node — only the node URL is
// missing below. Replace 'FIGMA_NODE_URL' with the component-set link and
// flip the status via `/figma-component Dialog <url> --update`.
// DialogDefault is mapped to the "DialogDefault" component set in the
// ui-react Figma file (node 6343:58898). Property names verified via
// get_context_for_code_connect: `variant` (variant enum), `hasLoading`
// (boolean), `DialogBody` (slot → children).
import figma from '@figma/code-connect';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDefault,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

figma.connect(Dialog, 'FIGMA_NODE_URL', {
  example: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Description</DialogDescription>
        </DialogBody>
        <DialogFooter>Actions</DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

figma.connect(
  DialogDefault,
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
      <DialogDefault variant={variant} hasLoading={hasLoading} defaultOpen>
        {children}
      </DialogDefault>
    ),
  }
);
