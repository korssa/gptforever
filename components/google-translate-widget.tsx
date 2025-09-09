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

       // ✅ 위젯 생성 후 바로 언어 매핑 시도
       setTimeout(() => {
         initializeLanguageMapping();
       }, 800); // 약간의 delay로 combo 나타나기를 기다림
     };

         // 언어 매핑 함수들
     function updateLanguageOptions() {
       try {
         const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
         if (!combo || !combo.options) return;

         const options = Array.from(combo.options);

         function getFlagEmojiByLang(lang: string): string {
           const countryGuessMap: { [key: string]: string } = {
             en: "US",
             es: "ES",
             fr: "FR",
             pt: "PT",
             pt_br: "BR",
             de: "DE",
             ar: "SA",
             ja: "JP",
             ko: "KR",
             zh: "CN",
             ru: "RU",
             hi: "IN",
           };
           const cc = countryGuessMap[lang] || lang.slice(0, 2).toUpperCase();
           return cc.replace(/./g, (c) =>
             String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
           );
         }

         options.forEach((option) => {
           const langCode = option.value.trim().toLowerCase();
           if (!option.dataset.updated) {
             const flag = getFlagEmojiByLang(langCode);
             const originalText = option.text;
             option.text = `${flag} ${originalText}`;
             option.dataset.updated = "true";
           }
         });

         options.sort((a, b) => a.text.localeCompare(b.text));
         combo.innerHTML = "";
         options.forEach((opt) => combo.appendChild(opt));
       } catch (e) {
         // Language mapping failed
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
           (el as HTMLElement).style.display = "none";
           (el as HTMLElement).style.visibility = "hidden";
           (el as HTMLElement).style.opacity = "0";
         });
       });
     }

    function handleAdminModeChange(enabled: boolean) {
      try {
        // 위젯 상태 토글 전 현재 작성 중 드래프트를 안전하게 저장 (App Story/News 공통)
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

         // 위젯 리프레시 함수
     function refreshWidget() {
       try {
         // 기존 위젯 제거
         const existingElement = document.getElementById("google_translate_element");
         if (existingElement) {
           existingElement.innerHTML = '';
         }
         
         // 기존 스크립트 제거
         const existingScript = document.querySelector('script[src*="translate.google.com"]');
         if (existingScript) {
           document.head.removeChild(existingScript);
         }
         
         // 새로운 스크립트 로드
         const script = document.createElement("script");
         script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
         script.async = true;
         document.head.appendChild(script);
         
         // 위젯 재초기화
         setTimeout(() => {
           if (typeof window.googleTranslateElementInit === "function") {
             window.googleTranslateElementInit();
           }
         }, 500);
         
           } catch (e) {
      // Widget refresh failed
    }
     }

     // 🔍 2. initializeLanguageMapping + applyPersistentMapping 통합
     function initializeLanguageMapping() {
       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
       if (!combo || combo.options.length < 2) return false;

       updateLanguageOptions();
       hideFeedbackElements();

       // 이벤트 리스너 제거 후 재설정
       combo.removeEventListener("change", handleComboChange);
       combo.addEventListener("change", handleComboChange);

       return true;
     }

     // 페이지 리프레시 감지 및 위젯 재초기화
     function handlePageRefresh() {
       // 페이지가 리프레시되기 전에 상태 저장
       sessionStorage.setItem('widget-needs-refresh', 'true');
     }

     // 페이지 로드 시 위젯 리프레시 필요 여부 확인
     function checkAndRefreshWidget() {
       const needsRefresh = sessionStorage.getItem('widget-needs-refresh');
       if (needsRefresh === 'true') {
         sessionStorage.removeItem('widget-needs-refresh');
         setTimeout(() => {
           refreshWidget();
         }, 1000);
       }
     }

         // 콤보 변경 핸들러
     function handleComboChange() {
       setTimeout(() => {
         updateLanguageOptions();
         hideFeedbackElements();
         
         // 번역 완료 후 위젯 숨김 (완전 제거 대신 시각만 숨김)
         setTimeout(() => {
           const el = document.getElementById("google_translate_element");
           if (el) el.style.opacity = "0";
         }, 1000);
       }, 100);
     }

         // 🎯 3. MutationObserver 또는 check loop 중 하나만 유지 (둘 다는 과도함)
     const observer = new MutationObserver(() => {
       if (initializeLanguageMapping()) {
         // 일단 한 번 성공하면 더 이상 감시할 필요 없음
         observer.disconnect();
       }
     });

     // 페이지 리프레시 감지 이벤트 리스너
     window.addEventListener('beforeunload', handlePageRefresh);
     
     // 페이지 로드 후 시작
     window.addEventListener("load", () => {
       // 리프레시 후 위젯 재초기화 확인
       checkAndRefreshWidget();
       
       // DOM 변경 감지 시작 (위젯 로드 대기)
       observer.observe(document.body, {
         childList: true,
         subtree: true
       });
     });

     // 수동 리프레시 버튼 추가 (개발용)
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

     // 개발 모드에서만 리프레시 버튼 표시
     if (process.env.NODE_ENV === 'development') {
       setTimeout(addRefreshButton, 2000);
     }

         return () => {
       const existingScript = document.querySelector('script[src*="translate.google.com"]');
       if (existingScript) document.head.removeChild(existingScript);
       
       // observer 정리
       observer.disconnect();
       
       // 이벤트 리스너 정리
       window.removeEventListener('beforeunload', handlePageRefresh);
       
       // 리프레시 버튼 제거
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
