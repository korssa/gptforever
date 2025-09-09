"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (
            options: {
              pageLanguage: string;
              layout: string;
              multilanguagePage: boolean;
              autoDisplay: boolean;
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

export function GoogleTranslateWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    window.googleTranslateElementInit = function () {
      const target = document.getElementById("google_translate_element");
      if (!target) return;

      if (typeof window.google === "undefined" || !window.google.translate || !window.google.translate.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement?.InlineLayout?.HORIZONTAL || 'horizontal',
          multilanguagePage: true,
          autoDisplay: false,
        },
        "google_translate_element"
      );

      setTimeout(() => {
        initializeLanguageMapping();
      }, 800);
    };

    function updateLanguageOptions() {
      try {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (!combo || !combo.options) return;

        const options = Array.from(combo.options);

        const langToCountryMap: { [key: string]: string } = {
          en: "Australia",
          ko: "Korea",
          ja: "Japan",
          zh: "China",
          zh_cn: "China",
          zh_tw: "Taiwan",
          es: "Spain",
          fr: "France",
          de: "Germany",
          it: "Italy",
          ru: "Russia",
          pt: "Portugal",
          pt_br: "Brazil",
          ar: "Saudi Arabia",
          hi: "India",
          vi: "Vietnam",
          th: "Thailand",
          id: "Indonesia",
        };

        options.forEach((option) => {
          const langCode = option.value.trim().toLowerCase().replace("-", "_");
          if (!option.dataset.updated) {
            const nativeName = option.text.trim() || langCode;
            const country = langToCountryMap[langCode] || langCode.toUpperCase();
            option.text = `${country} - ${nativeName}`;
            option.dataset.updated = "true";
          }
        });

        options.sort((a, b) => a.text.localeCompare(b.text));
        combo.innerHTML = "";
        options.forEach((opt) => combo.appendChild(opt));
      } catch {}
    }

    function hideFeedbackElements() {
      const feedbackSelectors = [
        ".goog-te-balloon-frame",
        ".goog-te-ftab",
        ".goog-te-ftab-float",
        ".goog-tooltip",
        ".goog-tooltip-popup",
        ".goog-te-banner-frame",
        ".goog-te-spinner-pos",
      ];
      feedbackSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).style.display = "none";
          (el as HTMLElement).style.visibility = "hidden";
          (el as HTMLElement).style.opacity = "0";
        });
      });
    }

    function handleAdminModeChange(enabled: boolean) {
      try {
        const saveDraftSafely = () => {
          try {
            const event = new CustomEvent('memo:save-draft');
            window.dispatchEvent(event);
          } catch {}
        };
        saveDraftSafely();
      } catch {}

      if (enabled) {
        try {
          document.documentElement.setAttribute("translate", "no");
          document.body.setAttribute("translate", "no");

          const elements = document.querySelectorAll(".goog-te-combo, .goog-te-gadget, .skiptranslate, iframe[src*='translate']");
          elements.forEach((el) => {
            const e = el as HTMLElement;
            e.style.display = "none";
            e.style.visibility = "hidden";
            e.style.opacity = "0";
            e.style.pointerEvents = "none";
          });

          if (window.google) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.google as any).translate = {
              TranslateElement: function () {
                return null;
              },
            };
          }
        } catch {}
      } else {
        try {
          document.documentElement.removeAttribute("translate");
          document.body.removeAttribute("translate");

          const elements = document.querySelectorAll(".goog-te-combo, .goog-te-gadget, .skiptranslate");
          elements.forEach((el) => {
            const e = el as HTMLElement;
            e.style.display = "";
            e.style.visibility = "";
            e.style.opacity = "";
            e.style.pointerEvents = "";
          });

          setTimeout(() => {
            if (typeof window.googleTranslateElementInit === "function") {
              window.googleTranslateElementInit();
            }
          }, 500);
        } catch {}
      }
    }

    window.adminModeChange = handleAdminModeChange;

    function refreshWidget() {
      try {
        const existingElement = document.getElementById("google_translate_element");
        if (existingElement) {
          existingElement.innerHTML = '';
        }

        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }

        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.head.appendChild(script);

        setTimeout(() => {
          if (typeof window.googleTranslateElementInit === "function") {
            window.googleTranslateElementInit();
          }
        }, 500);

      } catch {}
    }

    function initializeLanguageMapping() {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (!combo || combo.options.length < 2) return false;

      updateLanguageOptions();
      hideFeedbackElements();

      combo.removeEventListener("change", handleComboChange);
      combo.addEventListener("change", handleComboChange);

      return true;
    }

    function handlePageRefresh() {
      sessionStorage.setItem('widget-needs-refresh', 'true');
    }

    function checkAndRefreshWidget() {
      const needsRefresh = sessionStorage.getItem('widget-needs-refresh');
      if (needsRefresh === 'true') {
        sessionStorage.removeItem('widget-needs-refresh');
        setTimeout(() => {
          refreshWidget();
        }, 1000);
      }
    }

    function handleComboChange() {
      setTimeout(() => {
        updateLanguageOptions();
        hideFeedbackElements();
        setTimeout(() => {
          const el = document.getElementById("google_translate_element");
          if (el) el.style.opacity = "0";
        }, 1000);
      }, 100);
    }

    const observer = new MutationObserver(() => {
      if (initializeLanguageMapping()) {
        observer.disconnect();
      }
    });

    window.addEventListener('beforeunload', handlePageRefresh);

    window.addEventListener("load", () => {
      checkAndRefreshWidget();
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });

    function addRefreshButton() {
      const refreshButton = document.createElement('button');
      refreshButton.textContent = '🔄';
      refreshButton.title = 'Google Translate 위젯 새로고침';
      refreshButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;

      refreshButton.addEventListener('click', () => {
        refreshWidget();
      });

      document.body.appendChild(refreshButton);
    }

    if (process.env.NODE_ENV === 'development') {
      setTimeout(addRefreshButton, 2000);
    }

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) document.head.removeChild(existingScript);
      observer.disconnect();
      window.removeEventListener('beforeunload', handlePageRefresh);
      const refreshButton = document.querySelector('button[title="Google Translate 위젯 새로고침"]');
      if (refreshButton) {
        document.body.removeChild(refreshButton);
      }
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="translate-widget-horizontal flex-shrink-0"
      suppressHydrationWarning={true}
    />
  );
}