import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import { ButtonMenu } from '../../button-menu';
import { Tag } from '../../tag';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderDescriptionRow,
  PageHeaderRow,
  PageHeaderTags,
  PageHeaderTitle,
} from '../page-header';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    children: {
      control: false,
      description:
        'PageHeader structure — a `PageHeaderRow` (title + optional edit button + tags + actions) and an optional `PageHeaderDescriptionRow`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root `<div>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const DESCRIPTION_TEXT =
  "The first time you land on a section I'll explain what it's for, how it relates to the rest of the console, and the common workflows partners use.";

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithTags: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithTagsAndActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
        <PageHeaderActions>
          <Button variant="secondary">Quick access</Button>
          <ButtonMenu variant="secondary">Export data</ButtonMenu>
          <ButtonMenu>Add user</ButtonMenu>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithTitleEditable: Story = {
  name: 'Default Header + Editable (full page wizards)',
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <ButtonIcon variant="secondary" aria-label="Edit title">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionAndTags: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionTagsAndActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
        <PageHeaderActions>
          <Button variant="secondary">Cancel</Button>
          <Button>Save</Button>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionEditable: Story = {
  name: 'with Description + Editable (full page wizards)',
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <ButtonIcon variant="secondary" aria-label="Edit title">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
        <ButtonIcon variant="secondary" aria-label="Edit description">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};
