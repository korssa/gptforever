"use client";

import { useEffect } from "react";

export function GoogleTranslateWidget() {
  useEffect(() => {
    // ====== 1) 언어 전체 매핑 빌더: (코드, 나라(영어), 언어(자국어)) ======
    function buildMaps() {
      const entries: Array<[string, string, string]> = [
        // A
        ["af", "South Africa", "Afrikaans"],
        ["sq", "Albania", "Shqip"],
        ["am", "Ethiopia", "አማርኛ"],
        ["ar", "Saudi Arabia", "العربية"],
        ["hy", "Armia", "Հայերեն"],
        ["az", "Azerbaijan", "Azərbaycan dili"],
        // B
        ["eu", "Basque Country", "Euskara"],
        ["be", "Belarus", "Беларуская"],
        ["bn", "Bangladesh", "বাংলা"],
        ["bs", "Bosnia and Herzegovina", "Bosanski"],
        ["bg", "Bulgaria", "Български"],
        // C
        ["ca", "Catalonia", "Català"],
        ["ceb", "Philippines", "Cebuano"],
        ["zh-cn", "China", "中文(简体)"],
        ["zh-tw", "Taiwan", "中文(繁體)"],
        ["zh", "China", "中文"],
        ["co", "Corsica", "Corsu"],
        ["hr", "Croatia", "Hrvatski"],
        ["cs", "Czech Republic", "Čeština"],
        // D
        ["da", "Denmark", "Dansk"],
        ["nl", "Netherlands", "Nederlands"],
        // E
        ["en-us", "USA", "English"],
        ["en-gb", "UK", "English"],
        ["en-au", "Australia", "English"],
        ["en-nz", "New Zealand", "English"],
        ["en-ca", "Canada", "English"],
    
        ["eo", "—", "Esperanto"],
        ["et", "Estonia", "Eesti"],
        // F
        ["fi", "Finland", "Suomi"],
        ["fr", "France", "Français"],
        ["fy", "Netherlands", "Frysk"],
        // G
        ["gl", "Spain (Galicia)", "Galego"],
        ["ka", "Georgia", "ქართული"],
        ["de", "Germany", "Deutsch"],
        ["el", "Greece", "Ελληνικά"],
        ["gu", "India", "ગુજરાતી"],
        // H
        ["ht", "Haiti", "Kreyòl ayisyen"],
        ["ha", "Nigeria", "Hausa"],
        ["haw", "Hawaii", "ʻŌlelo Hawaiʻi"],
        ["he", "Israel", "עברית"],
        ["hi", "India", "हिन्दी"],
        ["hmn", "—", "Hmoob"],
        ["hu", "Hungary", "Magyar"],
        // I
        ["is", "Iceland", "Íslenska"],
        ["ig", "Nigeria", "Igbo"],
        ["id", "Indonesia", "Bahasa Indonesia"],
        ["ga", "Ireland", "Gaeilge"],
        ["it", "Italy", "Italiano"],
        // J
        ["ja", "Japan", "日本語"],
        ["jv", "Indonesia", "Basa Jawa"],
        // K
        ["kn", "India", "ಕನ್ನಡ"],
        ["kk", "Kazakhstan", "Қазақ тілі"],
        ["km", "Cambodia", "ភាសាខ្មែរ"],
        ["rw", "Rwanda", "Kinyarwanda"],
        ["ko", "Korea", "한국어"],
        ["ku", "Kurdistan", "Kurdî"],
        ["ky", "Kyrgyzstan", "Кыргызча"],
        // L
        ["lo", "Laos", "ລາວ"],
        ["la", "—", "Latina"],
        ["lv", "Latvia", "Latviešu"],
        ["lt", "Lithuania", "Lietuvių"],
        ["lb", "Luxembourg", "Lëtzebuergesch"],
        // M
        ["mk", "North Macedonia", "Македонски"],
        ["mg", "Madagascar", "Malagasy"],
        ["ms", "Malaysia", "Bahasa Melayu"],
        ["ml", "India", "മലയാളം"],
        ["mt", "Malta", "Malti"],
        ["mi", "New Zealand", "Māori"],
        ["mr", "India", "मराठी"],
        ["mn", "Mongolia", "Монгол"],
        ["my", "Myanmar", "မြန်မာစာ"],
        // N
        ["ne", "Nepal", "नेपाली"],
        ["no", "Norway", "Norsk"],
        ["ny", "Malawi", "ChiChewa"],
        // O
        ["or", "India", "ଓଡ଼ିଆ"],
        // P
        ["ps", "Afghanistan", "پښتو"],
        ["fa", "Iran", "فارسی"],
        ["pl", "Poland", "Polski"],
        ["pt-br", "Brazil", "Português (BR)"],
        ["pt", "Portugal", "Português"],
        ["pa", "India", "ਪੰਜਾਬੀ"],
        // R
        ["ro", "Romania", "Română"],
        ["ru", "Russia", "Русский"],
        // S
        ["sm", "Samoa", "Gagana Samoa"],
        ["gd", "Scotland", "Gàidhlig"],
        ["sr", "Serbia", "Српски"],
        ["st", "Lesotho", "Sesotho"],
        ["sn", "Zimbabwe", "Shona"],
        ["sd", "Pakistan", "سنڌي"],
        ["si", "Sri Lanka", "සිංහල"],
        ["sk", "Slovakia", "Slovenčina"],
        ["sl", "Slovenia", "Slovenščina"],
        ["so", "Somalia", "Soomaali"],
        ["es-mx", "Mexico", "Español"],
        ["es", "Spain", "Español"],
        ["su", "Indonesia", "Basa Sunda"],
        ["sw", "Kenya", "Kiswahili"],
        ["sv", "Sweden", "Svenska"],
        // T
        ["tl", "Philippines", "Tagalog"],
        ["tg", "Tajikistan", "Тоҷикӣ"],
        ["ta", "India", "தமிழ்"],
        ["tt", "Tatarstan", "Татар"],
        ["te", "India", "తెలుగు"],
        ["th", "Thailand", "ไทย"],
        ["tr", "Turkey", "Türkçe"],
        ["tk", "Turkmenistan", "Türkmençe"],
        // U
        ["uk", "Ukraine", "Українська"],
        ["ur", "Pakistan", "اردو"],
        ["ug", "Xinjiang", "ئۇيغۇرچە"],
        ["uz", "Uzbekistan", "Oʻzbekcha"],
        // V/W/X/Y/Z
        ["vi", "Vietnam", "Tiếng Việt"],
        ["cy", "Wales", "Cymraeg"],
        ["xh", "South Africa", "isiXhosa"],
        ["yi", "—", "ייִדיש"],
        ["yo", "Nigeria", "Yorùbá"],
        ["zu", "South Africa", "isiZulu"],
      ];
  const includedLanguages = entries.map(([code]) => code).join(",");
  const countryByLang: Record<string, string> = {};
  const nativeByLang: Record<string, string> = {};

  for (const [code, country, native] of entries) {
    const c = code.toLowerCase();
    countryByLang[c] = country;
    nativeByLang[c] = native;

    const base = c.split("-")[0];
    if (!countryByLang[base]) countryByLang[base] = country;
    if (!nativeByLang[base]) nativeByLang[base] = native;
  }

  return {
    countryByLang,
    nativeByLang,
    includedLanguages, // ✅ 자동 생성된 언어 목록도 함께 반환
  };
}

    // ====== 2) 콤보 옵션을 "Country - Native"로 일괄 변환 ======
    function updateLanguageOptions() {
      try {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (!combo || !combo.options) return;

        const { countryByLang, nativeByLang } = buildMaps();
        const options = Array.from(combo.options);

        const norm = (v: string) => v.trim().toLowerCase().split("|")[0];

        const selectedValue = combo.value.toLowerCase();

        options.forEach((option) => {
          if (option.dataset.updated === "true") return;

          const code = norm(option.value);
          const base = code.split("-")[0];

          const country = countryByLang[code] ?? countryByLang[base] ?? base.toUpperCase();
          const native = nativeByLang[code] ?? nativeByLang[base] ?? (option.text.trim() || base);

          option.text = `${country} - ${native}`;
          option.dataset.updated = "true";
        });

        // 정렬 후 재삽입
        options.sort((a, b) => a.text.localeCompare(b.text));
        combo.innerHTML = "";
        options.forEach((opt) => combo.appendChild(opt));

        // 선택 항목 정확히 복원
        const selectedOption = options.find((opt) => opt.value.toLowerCase() === selectedValue);
        if (selectedOption) {
          selectedOption.selected = true;
          combo.value = selectedOption.value;
        }
      } catch {
        // no-op
      }
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
          const e = el as HTMLElement;
          e.style.display = "none";
          e.style.visibility = "hidden";
          e.style.opacity = "0";
        });
      });
    }

    function handleAdminModeChange(enabled: boolean) {
      try {
        const saveDraftSafely = () => {
          try {
            const event = new CustomEvent("memo:save-draft");
            window.dispatchEvent(event);
          } catch {
            // no-op
          }
        };
        saveDraftSafely();
      } catch {
        // no-op
      }

      if (enabled) {
        try {
          document.documentElement.setAttribute("translate", "no");
          document.body.setAttribute("translate", "no");

          const elements = document.querySelectorAll(
            ".goog-te-combo, .goog-te-gadget, .skiptranslate, iframe[src*='translate']"
          );
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
        } catch {
          // no-op
        }
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
        } catch {
          // no-op
        }
      }
    }

    window.adminModeChange = handleAdminModeChange;

    function initializeLanguageMapping() {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (!combo || combo.options.length < 2) return false;

      updateLanguageOptions();
      hideFeedbackElements();

      combo.removeEventListener("change", handleComboChange);
      combo.addEventListener("change", handleComboChange);

      return true;
    }

    // 실시간 피드백 감시 루프 (5초마다 재시도)
    let feedbackLoop: number | undefined;
    function startFeedbackLoop() {
      if (feedbackLoop) window.clearInterval(feedbackLoop);
      feedbackLoop = window.setInterval(() => {
        hideFeedbackElements();
      }, 5000);
    }

    // 번역 피드백 DOM 전담 감시자
    function watchTranslationFeedback() {
      const feedbackObserver = new MutationObserver(() => {
        hideFeedbackElements();
      });

      feedbackObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return feedbackObserver;
    }

    function handlePageRefresh() {
      sessionStorage.setItem("widget-needs-refresh", "true");
    }

   /* function checkAndRefreshWidget() {
      const needsRefresh = sessionStorage.getItem("widget-needs-refresh");
      if (needsRefresh === "true") {
        sessionStorage.removeItem("widget-needs-refresh");
        setTimeout(() => {
          refreshWidget();
        }, 1000);
      }
    } */

    function handleComboChange() {
      setTimeout(() => {
        updateLanguageOptions();
        hideFeedbackElements();
        setTimeout(() => {
          const el = document.getElementById("google_translate_element");
          if (el) (el as HTMLElement).style.opacity = "0";
        }, 1000);
      }, 100);
    }

    function addRefreshButton() {
      const existing = document.querySelector('button[title="Google Translate 위젯 새로고침"]');
      if (existing) return;

      const refreshButton = document.createElement("button");
      refreshButton.textContent = "🔄";
      refreshButton.title = "Google Translate 위젯 새로고침";
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

      refreshButton.addEventListener("click", () => {
        //refreshWidget();
      });

      document.body.appendChild(refreshButton);
    }

    // Google 번역 스크립트 삽입
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.id = "google-translate-script";
      document.head.appendChild(script);
    }

// 콜백 함수 설정 (layout은 조건부로만 추가)
if (typeof window.googleTranslateElementInit !== "function") {
  window.googleTranslateElementInit = () => {
    const target = document.getElementById("google_translate_element");

    if (window.__widget_initialized === true) return;
    if (!target) return;

    window.__widget_initialized = true; // 🎯 초기화 완료 플래그

    if (window.google?.translate?.TranslateElement) {
      const { countryByLang, nativeByLang, includedLanguages } = buildMaps();
    

new window.google.translate.TranslateElement(
  {
    pageLanguage: "en",
     includedLanguages,
    multilanguagePage: true,
    autoDisplay: false,
    layout: window.google.translate.TranslateElement?.InlineLayout?.HORIZONTAL || "horizontal",
  },
  "google_translate_element"
);

setTimeout(() => {
  updateLanguageOptions(); // ✅ 이걸 콤보 생성 직후 강제로 실행
}, 300);
// ✅ 초기 진입 시 라벨 매핑을 delay 후 강제 적용
setTimeout(() => {
  initializeLanguageMapping();
}, 800); // 약간의 렌더링 대기 시간

    }
  };
}

    // 옵저버 및 루프 시작
    const initObserver = new MutationObserver(() => {
      if (initializeLanguageMapping()) {
        initObserver.disconnect();
        startFeedbackLoop();
      }
    });

    let feedbackObserver: MutationObserver | null = null;

    const onLoad = () => {
      //checkAndRefreshWidget();
      initObserver.observe(document.body, { childList: true, subtree: true });
      feedbackObserver = watchTranslationFeedback();
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    window.addEventListener("beforeunload", handlePageRefresh);

    if (process.env.NODE_ENV === "development") {
      setTimeout(addRefreshButton, 2000);
    }

    // cleanup
    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) document.head.removeChild(existingScript);

      initObserver.disconnect();
      window.removeEventListener("beforeunload", handlePageRefresh);
      window.removeEventListener("load", onLoad);

      const refreshButton = document.querySelector('button[title="Google Translate 위젯 새로고침"]');
      if (refreshButton && refreshButton.parentElement) {
        refreshButton.parentElement.removeChild(refreshButton);
      }

      if (feedbackLoop) window.clearInterval(feedbackLoop);
      if (feedbackObserver) {
        feedbackObserver.disconnect();
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
