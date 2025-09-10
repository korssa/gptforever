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
              includedLanguages?: string;
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
    __widget_initialized?: boolean; // 🔒 중복 실행 방지 플래그도 여기에!
  }
}

