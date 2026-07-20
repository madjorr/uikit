import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderDescriptionRow,
  PageHeaderRow,
  PageHeaderTags,
  PageHeaderTitle,
} from '../index';

describe('PageHeader', () => {
  it('renders the banner with title, tags, actions, and description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderTags>
            <span>Customer</span>
          </PageHeaderTags>
          <PageHeaderActions>
            <button>New</button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescriptionRow>
          <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
        </PageHeaderDescriptionRow>
      </PageHeader>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Reports').tagName).toBe('H1');
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByText('All scheduled reports.')).toHaveClass(
      'text-muted-foreground'
    );
  });

  it('renders a title-only header without tags, actions, or a description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Reports' })).toBeInTheDocument();
  });

  it('renders an edit button as a sibling of the title', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Untitled dashboard</PageHeaderTitle>
          <button aria-label="Edit title">Edit</button>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(screen.getByRole('button', { name: 'Edit title' })).toBeInTheDocument();
  });

  it('renders an edit button as a sibling of the description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
        </PageHeaderRow>
        <PageHeaderDescriptionRow>
          <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
          <button aria-label="Edit description">Edit</button>
        </PageHeaderDescriptionRow>
      </PageHeader>
    );
    expect(
      screen.getByRole('button', { name: 'Edit description' })
    ).toBeInTheDocument();
  });

  it('forwards refs on the root and the title', () => {
    let rootRef: HTMLDivElement | null = null;
    let titleRef: HTMLHeadingElement | null = null;
    render(
      <PageHeader
        ref={(el) => {
          rootRef = el;
        }}
      >
        <PageHeaderRow>
          <PageHeaderTitle
            ref={(el) => {
              titleRef = el;
            }}
          >
            Reports
          </PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(rootRef).toBeInstanceOf(HTMLDivElement);
    expect(titleRef).toBeInstanceOf(HTMLHeadingElement);
  });
});
