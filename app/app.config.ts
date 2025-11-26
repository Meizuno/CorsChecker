export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    container: {
      base: "py-4 sm:py-6 lg:py-8",
    },
    select: {
      slots: {
        base: "w-full",
      }
    },
    input: {
      slots: {
        root: "w-full",
      },
    },
  },
});
