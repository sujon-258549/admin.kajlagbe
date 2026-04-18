import type { ThemeConfig } from "antd";

/** Aligns Ant Design tokens with Tailwind `:root` --primary (#052e16). */
export const PRIMARY = "#052e16";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY,
    colorLink: PRIMARY,
    colorInfo: PRIMARY,
  },
};
