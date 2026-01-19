      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        ui: {
          router(args) {
            return `/${args.document._sys.filename}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            list: true,
            name: "blocks",
            label: "Page Blocks",
            templates: [
              {
                name: "hero",
                label: "Hero Block",
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                  },
                  {
                    type: "string",
                    name: "subheading",
                    label: "Subheading",
                    ui: {
                      component: "textarea",
                    },
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Background Image",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Image Alt Text",
                  },
                ],
              },
              {
                name: "gallery",
                label: "Gallery Block",
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                  },
                  {
                    type: "object",
                    list: true,
                    name: "images",
                    label: "Images",
                    fields: [
                      {
                        type: "image",
                        name: "image",
                        label: "Image",
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Alt Text",
                      },
                    ],
                  },
                ],
              },
              {
                name: "richtext",
                label: "Rich Text Block",
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "Content",
                  },
                ],
              },
            ],
          },
        ],
      },
