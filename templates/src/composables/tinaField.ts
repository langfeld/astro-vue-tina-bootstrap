/**
 * Generates Tina Visual Editing field identifier for `data-tina-field`.
 *
 * Tina injects `_content_source` into query results. We use its queryId + path.
 */
export function tinaField<
  T extends Record<string, any> | undefined | null,
>(
  object: T,
  property?: keyof Omit<NonNullable<T>, "__typename" | "_sys">,
  index?: number,
): string {
  if (!object || !(object as any)._content_source) return "";

  const queryId = (object as any)._content_source.queryId as string;
  const path = (object as any)._content_source.path
    ? ([...(object as any)._content_source.path] as Array<string | number>)
    : ([] as Array<string | number>);

  if (property) {
    path.push(property as string);

    if (typeof index === "number") {
      path.push(index);
    }
  }

  return [queryId, path.join(".")].join("---");
}
