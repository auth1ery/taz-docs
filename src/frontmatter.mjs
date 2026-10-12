// Frontmatter here is one `key: value` per line, nothing nested, so a YAML
// parser (and the dependency) would only add ways to get it wrong.
export function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return { data: {}, body: source, bodyLine: 1, errors: [{ line: 1, message: 'the file has to start with a frontmatter block between two --- lines' }] };
  }

  const data = {};
  const errors = [];
  match[1].split('\n').forEach((line, i) => {
    if (!line.trim()) return;
    const pair = line.match(/^([a-z]+):\s*(.*)$/);
    if (!pair) {
      errors.push({ line: i + 2, message: `frontmatter lines look like "key: value", not "${line}"` });
      return;
    }
    const [, key, value] = pair;
    if (key in data) errors.push({ line: i + 2, message: `"${key}" is set twice` });
    data[key] = value.trim();
  });

  return { data, body: source.slice(match[0].length), bodyLine: match[0].split('\n').length, errors };
}
