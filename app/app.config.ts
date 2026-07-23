export default defineAppConfig({
  ui: {
    colors: {
      primary: "wewak",
      neutral: "stone",
    },
    card: {
      slots: {
        root: "rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md shadow-primary/5",
        header: "border-b border-stone-100 dark:border-stone-800 px-6 py-5",
        body: "px-6 py-6",
        footer: "border-t border-stone-100 dark:border-stone-800 px-6 py-5",
      },
    },
    input: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
        base: "rounded-xl border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200",
      },
    },
    inputNumber: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
        base: "rounded-xl border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200",
      },
    },
    textarea: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
        base: "rounded-xl border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200",
      },
    },
    button: {
      defaultVariants: {
        size: "lg",
        color: "primary",
      },
      slots: {
        base: "rounded-full font-medium tracking-wide transition-all duration-300 active:scale-95 cursor-pointer",
      },
    },
    select: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "w-full rounded-xl border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200",
      },
    },
    selectMenu: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "w-full rounded-xl border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200",
        input: "border-b border-stone-200 dark:border-stone-800 [&_input]:rounded-none [&_input]:border-0 [&_input]:focus:ring-0",
      },
    },
    badge: {
      defaultVariants: {
        color: "primary",
        variant: "soft",
      },
      slots: {
        base: "rounded-full font-semibold tracking-wide px-3 py-1 text-xs",
      },
    },
    table: {
      slots: {
        th: "text-base font-semibold text-stone-700 dark:text-stone-300 py-4",
        td: "text-base text-stone-600 dark:text-stone-400 py-4",
      },
    },
    modal: {
      slots: {
        content: "rounded-3xl border border-stone-100 dark:border-stone-800 shadow-2xl p-2",
        footer: "justify-end gap-2",
      },
    },
  },
});
