export {};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (
            options: {
              pageLanguage: string;
              layout?: string;
              multilanguagePage?: boolean;
              autoDisplay?: boolean;
            },
            element: string
          ): unknown;
          InlineLayout?: {
            HORIZONTAL?: string;
          };
        };
      };
    };
    adminModeChange?: (enabled: boolean) => void;
  }
}
