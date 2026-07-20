# PageHeader — behavior

```gherkin
Scenario: Title + actions
  Given a PageHeader with a PageHeaderRow of a title and actions
  Then the title sits at the left and the actions at the right edge
```

```gherkin
Scenario: Tags share the row with actions
  Given a PageHeaderRow with a title, a PageHeaderTags slot, and a PageHeaderActions slot
  Then tags sit next to the title and actions stay flush right, even when tags are empty
```

```gherkin
Scenario: Description under the title
  Given a PageHeaderDescriptionRow below the title row
  Then the muted description renders capped at 512px width
```

```gherkin
Scenario: Editable title or description
  Given a page that lets the user rename its title or description inline (e.g. a
  full-page wizard like Create Dashboard)
  Then render a ButtonIcon with the pencil icon as a sibling next to the title or
  the description — PageHeader has no dedicated part for it, since it's the same
  atom either row
```

```gherkin
Scenario: Breadcrumb above PageHeader
  Given a page that also shows a breadcrumb trail
  Then render a Breadcrumb as a separate sibling above PageHeader, not nested inside it
```
