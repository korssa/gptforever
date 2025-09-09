"use client";

import { useEffect } from "react";

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

export function GoogleTranslate() {
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
          pageLanguage: "ko",
          layout: window.google.translate.TranslateElement?.InlineLayout?.HORIZONTAL || 'horizontal',
          multilanguagePage: true,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

         // 언어 매핑 + 피드백 제거
     function startLanguageMapping() {

                           function updateLanguageOptions() {
          try {
            const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
            if (combo && combo.options) {
              Array.from(combo.options).forEach((option) => {
                                 const value = option.value.trim().split("|")[0].toLowerCase(); // 핵심: 파이프 제거 후 소문자로 정규화
                const langLabelMap: { [key: string]: string } = {
                  af: "South Africa - Afrikaans",
                  sq: "Albania - Shqip",
                  am: "Ethiopia - አማርኛ",
                  ar: "Saudi Arabia - العربية",
                  hy: "Armenia - Հայերեն",
                  az: "Azerbaijan - Azərbaycan dili",
                  eu: "Basque Country - Euskara",
                  be: "Belarus - Беларуская",
                  bn: "Bangladesh - বাংলা",
                  bs: "Bosnia - Bosanski",
                  bg: "Bulgaria - Български",
                  ca: "Catalonia - Català",
                  ceb: "Philippines - Cebuano",
                  zh: "China - 中文(简体)",
                  "zh-cn": "China - 中文(简体)",
                  "zh-tw": "Taiwan - 中文(繁體)",
                  hr: "Croatia - Hrvatski",
                  cs: "Czech Republic - Čeština",
                  da: "Denmark - Dansk",
                  nl: "Netherlands - Nederlands",
                  en: "USA - English",
                  eo: "Esperanto - Esperanto",
                  et: "Estonia - Eesti",
                  fi: "Finland - Suomi",
                  fr: "France - Français",
                  fy: "Netherlands - Frysk",
                  gl: "Spain - Galego",
                  ka: "Georgia - ქართული",
                  de: "Germany - Deutsch",
                  el: "Greece - Ελληνικά",
                  gu: "India - ગુજરાતી",
                  ht: "Haiti - Kreyòl ayisyen",
                  ha: "Nigeria - Hausa",
                  haw: "Hawaii - ʻŌlelo Hawaiʻi",
                  he: "Israel - עברית",
                  hi: "India - हिन्दी",
                  hmn: "Hmong - Hmoob",
                  hu: "Hungary - Magyar",
                  is: "Iceland - Íslenska",
                  ig: "Nigeria - Igbo",
                  id: "Indonesia - Bahasa Indonesia",
                  ga: "Ireland - Gaeilge",
                  it: "Italy - Italiano",
                  ja: "Japan - 日本語",
                  jv: "Indonesia - Jawa",
                  kn: "India - ಕನ್ನಡ",
                  kk: "Kazakhstan - Қазақ тілі",
                  km: "Cambodia - ភាសាខ្មែរ",
                  rw: "Rwanda - Kinyarwanda",
                  ko: "Korea - 한국어",
                  ku: "Kurdistan - Kurdî",
                  ky: "Kyrgyzstan - Кыргызча",
                  lo: "Laos - ລາວ",
                  la: "Ancient Rome - Latina",
                  lv: "Latvia - Latviešu",
                  lt: "Lithuania - Lietuvių",
                  lb: "Luxembourg - Lëtzebuergesch",
                  mk: "North Macedonia - Македонски",
                  mg: "Madagascar - Malagasy",
                  ms: "Malaysia - Bahasa Melayu",
                  ml: "India - മലയാളം",
                  mt: "Malta - Malti",
                  mi: "New Zealand - Māori",
                  mr: "India - मराठी",
                  mn: "Mongolia - Монгол",
                  my: "Myanmar - မြန်မာစာ",
                  ne: "Nepal - नेपाली",
                  no: "Norway - Norsk",
                  ny: "Malawi - Nyanja",
                  or: "India - ଓଡ଼ିଆ",
                  ps: "Afghanistan - پښتو",
                  fa: "Iran - فارسی",
                  pl: "Poland - Polski",
                  pt: "Portugal - Português",
                  "pt-br": "Brazil - Português (BR)",
                  pa: "India - ਪੰਜਾਬੀ",
                  ro: "Romania - Română",
                  ru: "Russia - Русский",
                  sm: "Samoa - Gagana Samoa",
                  gd: "Scotland - Gàidhlig",
                  sr: "Serbia - Српски",
                  st: "Lesotho - Sesotho",
                  sn: "Zimbabwe - Shona",
                  sd: "Pakistan - سنڌي",
                  si: "Sri Lanka - සිංහල",
                  sk: "Slovakia - Slovenčina",
                  sl: "Slovenia - Slovenščina",
                  so: "Somalia - Soomaali",
                  es: "Spain - Español",
                  su: "Indonesia - Basa Sunda",
                  sw: "East Africa - Kiswahili",
                  sv: "Sweden - Svenska",
                  tl: "Philippines - Tagalog",
                  tg: "Tajikistan - Тоҷикӣ",
                  ta: "India - தமிழ்",
                  tt: "Tatarstan - Татар",
                  te: "India - తెలుగు",
                  th: "Thailand - ไทย",
                  tr: "Turkey - Türkçe",
                  tk: "Turkmenistan - Türkmençe",
                  uk: "Ukraine - Українська",
                  ur: "Pakistan - اردو",
                  ug: "Xinjiang - ئۇيغۇرچە",
                  uz: "Uzbekistan - Oʻzbekcha",
                  vi: "Vietnam - Tiếng Việt",
                  cy: "Wales - Cymraeg",
                  xh: "South Africa - isiXhosa",
                  yi: "Ashkenazi - ייִדיש",
                  yo: "Nigeria - Yorùbá",
                  zu: "South Africa - isiZulu",
                };

                if (langLabelMap[value] && !option.dataset.updated) {
                  option.text = langLabelMap[value];
                  option.dataset.updated = "true";
                }
              });
            }
              } catch (e) {
      // Language mapping failed
    }
        }

    // 피드백 요소 숨김 함수 (전역 스코프로 이동)
    function hideFeedbackElements() {
      const feedbackSelectors = [
        ".goog-te-balloon-frame",
        ".goog-te-ftab",
        ".goog-te-ftab-float",
        ".goog-tooltip",
        ".goog-tooltip-popup",
        ".goog-te-banner-frame",
        ".goog-te-spinner-pos",
        ".goog-te-menu-frame",
        ".goog-te-menu2",
        ".goog-te-gadget-simple",
        ".goog-te-gadget",
        ".goog-te-combo",
        ".skiptranslate",
        "iframe[src*='translate']",
        ".goog-te-banner-frame-sip",
        ".goog-te-balloon-frame-sip",
        ".goog-te-ftab-sip",
        ".goog-te-ftab-float-sip"
      ];
      feedbackSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          const element = el as HTMLElement;
          element.style.display = "none !important";
          element.style.visibility = "hidden !important";
          element.style.opacity = "0 !important";
          element.style.pointerEvents = "none !important";
          element.style.position = "absolute !important";
          element.style.left = "-9999px !important";
          element.style.top = "-9999px !important";
          element.style.zIndex = "-9999 !important";
        });
      });
    }

    // ✅ 강력한 번역 피드백 차단 함수
    function blockAllTranslationFeedback() {
      // 모든 번역 피드백 요소 강제 숨김
      const allFeedbackElements = document.querySelectorAll([
        ".goog-te-balloon-frame",
        ".goog-te-ftab",
        ".goog-te-ftab-float", 
        ".goog-tooltip",
        ".goog-tooltip-popup",
        ".goog-te-banner-frame",
        ".goog-te-spinner-pos",
        ".goog-te-menu-frame",
        ".goog-te-menu2",
        ".goog-te-gadget-simple",
        ".goog-te-gadget",
        ".goog-te-combo",
        ".skiptranslate",
        "iframe[src*='translate']",
        ".goog-te-banner-frame-sip",
        ".goog-te-balloon-frame-sip",
        ".goog-te-ftab-sip",
        ".goog-te-ftab-float-sip",
        "[class*='goog-te-balloon']",
        "[class*='goog-te-ftab']",
        "[class*='goog-te-tooltip']",
        "[id*='goog-te-balloon']",
        "[id*='goog-te-ftab']",
        "[id*='goog-te-tooltip']"
      ].join(','));

      allFeedbackElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.display = "none !important";
        el.style.visibility = "hidden !important";
        el.style.opacity = "0 !important";
        el.style.pointerEvents = "none !important";
        el.style.position = "absolute !important";
        el.style.left = "-9999px !important";
        el.style.top = "-9999px !important";
        el.style.zIndex = "-9999 !important";
        el.style.width = "0 !important";
        el.style.height = "0 !important";
        el.style.overflow = "hidden !important";
        el.style.clip = "rect(0, 0, 0, 0) !important";
        el.style.margin = "0 !important";
        el.style.padding = "0 !important";
        el.style.border = "none !important";
        el.style.background = "transparent !important";
      });

      // 번역 위젯 자체는 보호 (헤더에 있는 것만)
      const headerWidget = document.querySelector('.translate-widget-horizontal .goog-te-gadget');
      if (headerWidget) {
        const el = headerWidget as HTMLElement;
        el.style.display = "flex !important";
        el.style.visibility = "visible !important";
        el.style.opacity = "1 !important";
        el.style.pointerEvents = "auto !important";
        el.style.position = "static !important";
        el.style.left = "auto !important";
        el.style.top = "auto !important";
        el.style.zIndex = "auto !important";
        el.style.width = "auto !important";
        el.style.height = "auto !important";
        el.style.overflow = "visible !important";
        el.style.clip = "auto !important";
      }
    }

             // 언어 선택 시에만 실행
       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
       if (combo) {
         // 초기 1회 즉시 적용
         updateLanguageOptions();
         hideFeedbackElements();
         blockAllTranslationFeedback();

         // 이후 사용자가 바꿀 때마다 적용
         combo.addEventListener("change", () => {
           const selectedLang = combo.value;
           
           // 선택한 언어를 sessionStorage에 저장
           if (selectedLang) {
             sessionStorage.setItem("gptx:selectedLang", selectedLang);
             sessionStorage.setItem("gptx:translate:muted", "true");
           }
           
           updateLanguageOptions();
           hideFeedbackElements();
           blockAllTranslationFeedback();
           
           // 번역 완료 후 위젯 즉시 숨김
           setTimeout(() => {
             hideTranslateWidget();
           }, 800);
         });
       }

    }

    // 위젯 즉시 숨김 함수 (전역 스코프로 이동)
    function hideTranslateWidget() {
      const el = document.getElementById("google_translate_element");
      if (el) {
        el.style.display = "none";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.visibility = "hidden";
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "-9999px";
        el.style.zIndex = "-9999";
      }
      
      // 추가로 모든 Google Translate 관련 요소들 숨김
      const googleElements = document.querySelectorAll([
        ".goog-te-gadget",
        ".goog-te-gadget-simple", 
        ".goog-te-combo",
        ".goog-te-menu-frame",
        ".goog-te-menu2"
      ].join(','));
      
      googleElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      });
      
      // 위젯 숨김 후 환생 버튼 표시
      showReviveButton();
    }

    // 환생 버튼 표시 함수 (헤더 내부에 표시)
    function showReviveButton() {
      const container = document.getElementById("translate-revive-button-container");
      if (container) {
        container.classList.remove("hidden");
      }
    }

    function handleAdminModeChange(enabled: boolean) {
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

    // 위젯 로드 후 언어 매핑 설정 (더 확실하게)
    function initializeLanguageMapping() {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo && combo.options.length > 1) {
        startLanguageMapping();
        return true;
      }
      return false;
    }

    // 위젯 로드 감지 및 언어 매핑 초기화
    const checkAndInitialize = () => {
      if (initializeLanguageMapping()) {
        return; // 성공하면 종료
      }
      
      // 실패하면 다시 시도
      setTimeout(checkAndInitialize, 1000);
    };

    // 저장된 언어 자동 재적용 함수
    function autoReapplyTranslation() {
      const savedLang = sessionStorage.getItem("gptx:selectedLang");
      const isMuted = sessionStorage.getItem("gptx:translate:muted");
      
      if (savedLang && isMuted === "true") {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        
        if (combo && combo.options.length > 1) {
          setTimeout(() => {
            combo.value = savedLang;
            combo.dispatchEvent(new Event("change"));
            
            // 재적용 후 다시 위젯 숨김
            setTimeout(() => {
              hideTranslateWidget();
              // 피드백 요소 숨김
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
            }, 1500);
          }, 1200);
        }
      }
    }

    // 페이지 로드 후 시작
    window.addEventListener("load", () => {
      setTimeout(checkAndInitialize, 1000);
      
      // 저장된 언어 자동 재적용
      setTimeout(() => {
        autoReapplyTranslation();
      }, 2000);
    });

    // DOM 변경 감지 (MutationObserver 사용)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector && element.querySelector('.goog-te-combo')) {
                setTimeout(initializeLanguageMapping, 100);
              }
            }
          });
        }
      });
      
      // 지속적으로 위젯 숨김 감시
      const isMuted = sessionStorage.getItem("gptx:translate:muted");
      if (isMuted === "true") {
        const translateElement = document.getElementById("google_translate_element");
        if (translateElement && translateElement.style.display !== "none") {
          hideTranslateWidget();
        }
      }
    });

    // DOM 변경 감지 시작
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) document.head.removeChild(existingScript);
      
      // observer 정리
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ position: "fixed", top: 0, right: 0, zIndex: 9999, opacity: 0, pointerEvents: "none" }}
    />
  );
}
