import j from 'jscodeshift';

export function findFirstMember(node) {
  if (j.MemberExpression.check(node)) {
    return findFirstMember(node.object);
  }
  return node;
}

export function findLastMember(node) {
  if (j.MemberExpression.check(node)) {
    return findLastMember(node.property);
  }
  return node;
}

export function matchLast(matcher) {
  return (nodes) => nodes.length > 0 && j.match(nodes[nodes.length - 1], matcher);
}

export function insertAfterDirectives(body, newNode) {
  let i = 0;
  for (;i < body.length; i++) {
    if (!j.ExpressionStatement.check(body[i]) || !j.Literal.check(body[i].expression)) {
      break;
    }
  }
  body.splice(i, 0, newNode);
  return body;
}

export function isUndefined(node) {
  return j.match(node, {
    type: 'Identifier',
    name: 'undefined',
  }) || j.match(node, {
    type: 'UnaryExpression',
    operator: 'void',
    argument: {type: 'Literal', value: 0},
  });
}

export function pathIsFirstMember({node, parentPath: {node: parentNode}}) {
  return !j.MemberExpression.check(parentNode) || parentNode.object === node;
}

const IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

export function isValidIdentifier(identifier) {
  return typeof identifier === 'string' && IDENTIFIER_REGEX.test(identifier);
}

export function getPropertyName({key, computed}) {
  if (computed) { return null; }
  return j.Identifier.check(key) ? key.name : key.value;
}

export function containsThisExpression(node) {
  return j(node).find(j.ThisExpression).size() > 0;
}

export function isFunctionExpression(node) {
  return j.FunctionExpression.check(node) || j.ArrowFunctionExpression.check(node);
}

export function getBlockStatementFromFunction({body}) {
  if (!j.BlockStatement.check(body)) {
    return j.blockStatement([j.returnStatement(body)]);
  }

  return body;
}

// from https://github.com/sindresorhus/globals/blob/1e9ebc39828b92bd5c8ec7dc7bb07d62f2fb0153/globals.json#L852

// Waiting for https://github.com/benmosher/eslint-plugin-import/commit/92f7d655dbba9c0c169cd129baf1af4ecd8a2456 to merge
// eslint-disable-next-line import/prefer-default-export
export const MOCHA_FUNCTIONS = new Set([
  'after',
  'afterEach',
  'before',
  'beforeEach',
  'context',
  'describe',
  'it',
  'mocha',
  'setup',
  'specify',
  'suite',
  'suiteSetup',
  'suiteTeardown',
  'teardown',
  'test',
  'xcontext',
  'xdescribe',
  'xit',
  'xspecify',
]);
