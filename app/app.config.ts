export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: "shadow-lg",
      },
    },
    colors: {
      primary: "eastern-blue",
    },
    input: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
      },
    },
    textarea: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
      },
    },
    button: {
      defaultVariants: {
        size: "lg",
      },
    },
    select: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "w-full",
      },
    },
    selectMenu: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "w-full",
      },
    },
    table: {
      slots: {
        th: "text-base",
        td: "text-base",
      },
    },
    modal: {
      slots: {
        footer: "justify-end",
      },
    },
  },
});
