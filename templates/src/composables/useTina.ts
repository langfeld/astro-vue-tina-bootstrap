import type { Ref } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, triggerRef, watchEffect } from "vue";

// Tiny deep clone to avoid mutating Tina-owned objects in-place
export function fastClone<T>(obj: T): T {
  return obj === undefined ? (undefined as T) : JSON.parse(JSON.stringify(obj));
}

type TinaUseTinaArgs<TData extends Record<string, any>> = {
  query: string;
  variables: object;
  data: TData | null;
  /** Key inside `data` that contains your document. Example: "page" */
  contentType: string;
};

/**
 * Minimal Tina Visual Editing bridge (works with local `tinacms dev`).
 * - Sends {type:"open"} to the parent Tina iframe
 * - Receives {type:"updateData"} updates
 * - Optional quick-edit overlay handling
 */
export function useTina<TData extends Record<string, any>>(
  props: TinaUseTinaArgs<TData>,
): { data: Ref<TData>; isClient: Ref<boolean> } {
  const id = computed(() =>
    hashFromQuery(JSON.stringify({ query: props.query, variables: props.variables })),
  );

  const defaultData: TData = { ...(props.data || {}) } as TData;
  const dataRef = ref<TData>(defaultData) as Ref<TData>;
  const isClient = ref(typeof window !== "undefined");
  const quickEditEnabled = ref(false);

  const isInIframe =
    typeof window !== "undefined" && (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

  const handleMessage = (event: MessageEvent) => {
    const msg = event.data;
    if (!msg) return;

    if (msg.id === id.value && msg.type === "updateData") {
      if (!msg.data) return;
      const next = msg.data[props.contentType];
      if (next) {
        dataRef.value = fastClone(next);
        triggerRef(dataRef);
      }
    }

    if (msg.type === "quickEditEnabled") {
      quickEditEnabled.value = isInIframe && !!msg.value;
    }
  };

  const postToTop = (payload: any) => {
    if (typeof window === "undefined") return;
    try {
      window.top?.postMessage(payload, window.location.origin);
    } catch {
      window.top?.postMessage(payload, "*");
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("message", handleMessage);
  }

  onMounted(() => {
    isClient.value = true;
    postToTop({ type: "quick-edit", value: true });
    postToTop({ type: "open", ...fastClone(props), id: id.value });
  });

  onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", handleMessage);
      postToTop({ type: "close", id: id.value });
    }
  });

  const applyQuickEditStyles = () => {
    const style = document.createElement("style");
    style.id = "__tina-quick-edit-styles";
    style.type = "text/css";
    style.textContent = `
    [data-tina-field] {
      outline: 2px dashed rgba(34,150,254,0.5);
      transition: box-shadow ease-out 150ms;
    }
    [data-tina-field]:hover {
      box-shadow: inset 100vi 100vh rgba(34,150,254,0.3);
      outline: 2px solid rgba(34,150,254,1);
      cursor: pointer;
    }
    [data-tina-field-overlay] {
      outline: 2px dashed rgba(34,150,254,0.5);
      position: relative;
    }
    [data-tina-field-overlay]:hover {
      cursor: pointer;
      outline: 2px solid rgba(34,150,254,1);
    }
    [data-tina-field-overlay]::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 20;
      transition: opacity ease-out 150ms;
      background-color: rgba(34,150,254,0.3);
      opacity: 0;
    }
    [data-tina-field-overlay]:hover::after {
      opacity: 1;
    }
  `;
    document.head.appendChild(style);
    document.body.classList.add("__tina-quick-editing-enabled");

    const mouseDownHandler = (e: MouseEvent) => {
      const attributeNames = (e.target as HTMLElement).getAttributeNames();
      const tinaAttribute = attributeNames.find((name) =>
        name.startsWith("data-tina-field"),
      );
      let fieldName;

      if (tinaAttribute) {
        e.preventDefault();
        e.stopPropagation();
        fieldName = (e.target as HTMLElement).getAttribute(tinaAttribute);
      } else {
        const ancestor = (e.target as HTMLElement).closest(
          "[data-tina-field], [data-tina-field-overlay]",
        );
        if (ancestor) {
          const ancestorAttributeNames = ancestor.getAttributeNames();
          const ancestorTinaAttribute = ancestorAttributeNames.find((name) =>
            name.startsWith("data-tina-field"),
          );
          if (ancestorTinaAttribute) {
            e.preventDefault();
            e.stopPropagation();
            fieldName = ancestor.getAttribute(ancestorTinaAttribute);
          }
        }
      }

      if (fieldName) {
        postToTop({ type: "field:selected", fieldName });
      }
    };

    document.addEventListener("click", mouseDownHandler, true);

    onBeforeUnmount(() => {
      document.removeEventListener("click", mouseDownHandler, true);
      document.body.classList.remove("__tina-quick-editing-enabled");
      style.remove();
    });
  };

  watchEffect(() => {
    if (quickEditEnabled.value) {
      applyQuickEditStyles();
    }
  });

  return { data: dataRef, isClient };
}

function hashFromQuery(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(36);
}
