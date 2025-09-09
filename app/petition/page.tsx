"use client";

import { useEffect } from "react";

export default function PetitionPage() {
  useEffect(() => {
    // Google Translate 위젯 로드
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ko,ja,zh-CN,zh-TW,es,fr,de,it,pt,ru,ar,hi,th,vi',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    `;
    document.head.appendChild(script);

    // Google Translate API 로드
    const translateScript = document.createElement('script');
    translateScript.type = 'text/javascript';
    translateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(translateScript);

    return () => {
      // 클린업
      document.head.removeChild(script);
      document.head.removeChild(translateScript);
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-white p-4">
      {/* Google Translate 위젯 */}
      <div className="mb-4 flex justify-center">
        <div id="google_translate_element"></div>
      </div>
      
      <h1 className="text-xl font-bold mb-6" translate="yes">✍️ Online Petition to Support Continued Use of chatGPT 4o (Legacy)</h1>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSfmFPpGWs2bS4BS8zDWQdLFH-SfopbeUVC1MLuP-uMZgRjvUw/viewform?embedded=true" 
        width="100%" 
        height="2200" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0} 
        style={{ border: "none" }}
      >
        Loading…
      </iframe>
    </main>
  )
}