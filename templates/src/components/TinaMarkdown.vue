<script setup lang="ts">
import { computed, type Component } from "vue";

interface TinaMarkdownProps {
  content: any[] | any;
  components?: Record<string, Component | string>;
}

const props = withDefaults(defineProps<TinaMarkdownProps>(), {
  components: () => ({}),
});

// Standard HTML-Elemente (wie in offizieller TinaMarkdown)
const defaultComponents: Record<string, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  a: "a",
  ul: "ul",
  ol: "ol",
  li: "li",
  blockquote: "blockquote",
  code_block: "pre",
  img: "img",
  hr: "hr",
  break: "br",
};

// Text-Node mit Formatierung rendern
const renderTextNode = (node: any): string => {
  if (!node || node.text === undefined) return "";

  let text = escapeHtml(node.text);

  // Text-Formatierungen (wie in Tina)
  if (node.bold) text = `<strong>${text}</strong>`;
  if (node.italic) text = `<em>${text}</em>`;
  if (node.underline) text = `<u>${text}</u>`;
  if (node.code) text = `<code>${text}</code>`;
  if (node.strikethrough) text = `<s>${text}</s>`;

  return text;
};

// HTML escapen für Sicherheit
const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Rekursiv Nodes rendern (wie offizielle TinaMarkdown)
const renderNode = (node: any): string => {
  if (!node) return "";

  // Text-Node (Blatt)
  if (node.text !== undefined) {
    return renderTextNode(node);
  }

  // Kinder rekursiv rendern
  const children = node.children
    ? node.children.map((child: any) => renderNode(child)).join("")
    : "";

  // MDX Custom Components (wie in Tina)
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    const componentName = node.name;
    if (componentName && props.components?.[componentName]) {
      // Custom Component wird hier nicht gerendert (würde Vue Component benötigen)
      // Fallback: Zeige Platzhalter
      return `<div class="mdx-component" data-component="${componentName}">
        [Custom Component: ${componentName}]
      </div>`;
    }
  }

  // Element-Type bestimmen
  const elementType = props.components?.[node.type] || defaultComponents[node.type];

  // Spezielle Attribute für bestimmte Elemente
  let attributes = "";
  if (node.type === "a" && node.url) {
    attributes = ` href="${escapeHtml(node.url)}"`;
  } else if (node.type === "img") {
    attributes = ` src="${escapeHtml(node.url || "")}" alt="${escapeHtml(node.alt || "")}"`;
  } else if (node.type === "code_block") {
    const lang = node.lang ? ` class="language-${escapeHtml(node.lang)}"` : "";
    return `<pre><code${lang}>${children}</code></pre>`;
  }

  // Self-closing elements
  if (node.type === "hr" || node.type === "break" || node.type === "img") {
    return `<${elementType}${attributes} />`;
  }

  // Standard-Element mit Kindern
  if (typeof elementType === "string") {
    return `<${elementType}${attributes}>${children}</${elementType}>`;
  }

  // Fallback
  return children;
};

const htmlContent = computed(() => {
  // Content normalisieren (wie in Tina)
  const contentArray = Array.isArray(props.content)
    ? props.content
    : props.content?.children || [];

  return contentArray.map((node: any) => renderNode(node)).join("");
});
</script>

<template>
  <!-- Wrapper für potentielle Custom Components -->
  <div class="tina-markdown" v-html="htmlContent" />
</template>

<style>
/* Optional: Basis-Styling für Markdown */
.tina-markdown {
  line-height: 1.6;
}

.tina-markdown code {
  background: #f4f4f4;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.tina-markdown pre {
  background: #f4f4f4;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

.tina-markdown pre code {
  background: none;
  padding: 0;
}

.tina-markdown blockquote {
  border-left: 4px solid #ddd;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
}

.mdx-component {
  border: 2px dashed #ccc;
  padding: 1em;
  margin: 1em 0;
  background: #f9f9f9;
  color: #666;
  font-style: italic;
}
</style>

