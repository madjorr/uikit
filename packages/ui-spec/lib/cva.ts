import ts from 'typescript';

/**
 * Extract the variant groups of a `cva(base, { variants: {...} })` call from a
 * TypeScript source string, returning a map of group name → declared keys.
 * Example: `{ variant: ['default', 'secondary', ...], size: ['default', 'sm', 'lg'] }`.
 *
 * Used by the conformance test to assert a component's real `cva` variants match
 * the enums declared in its `api.yaml`. Returns `{}` if no `cva` call is found.
 */
export function extractCvaGroups(source: string): Record<string, string[]> {
  const sourceFile = ts.createSourceFile(
    'component.tsx',
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX
  );

  let result: Record<string, string[]> = {};

  const visit = (node: ts.Node): void => {
    if (
      Object.keys(result).length === 0 &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'cva' &&
      node.arguments.length >= 2 &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      const variants = findProperty(node.arguments[1], 'variants');
      if (variants && ts.isObjectLiteralExpression(variants)) {
        result = collectGroups(variants);
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return result;
}

/** Find a property's initializer object within an object literal. */
function findProperty(
  obj: ts.ObjectLiteralExpression,
  name: string
): ts.Expression | undefined {
  for (const prop of obj.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      propertyName(prop) === name
    ) {
      return prop.initializer;
    }
  }
  return undefined;
}

/** Map each group (variant, size, …) to the keys of its object literal. */
function collectGroups(
  variants: ts.ObjectLiteralExpression
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const prop of variants.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isObjectLiteralExpression(prop.initializer)
    ) {
      const group = propertyName(prop);
      if (group) {
        groups[group] = prop.initializer.properties
          .map((p) => (ts.isPropertyAssignment(p) ? propertyName(p) : undefined))
          .filter((k): k is string => Boolean(k));
      }
    }
  }
  return groups;
}

function propertyName(prop: ts.PropertyAssignment): string | undefined {
  const { name } = prop;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
  return undefined;
}
