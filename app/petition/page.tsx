"use client";

import { useLanguage } from "@/hooks/use-language";

export default function PetitionPage() {
  const { t } = useLanguage();
  
  return (
    <main className="w-full min-h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-6" translate="yes" onMouseEnter={() => {
        // 번역 피드백 차단
        if (typeof window !== 'undefined') {
          const elements = document.querySelectorAll('[data-google-translate]');
          elements.forEach(el => el.removeAttribute('data-google-translate'));
        }
      }}>
        ✍️ {t("petitionTitle")}
      </h1>
      <p className="text-gray-600 mb-6" translate="yes" onMouseEnter={() => {
        // 번역 피드백 차단
        if (typeof window !== 'undefined') {
          const elements = document.querySelectorAll('[data-google-translate]');
          elements.forEach(el => el.removeAttribute('data-google-translate'));
        }
      }}>
        {t("petitionDescription")}
      </p>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSfmFPpGWs2bS4BS8zDWQdLFH-SfopbeUVC1MLuP-uMZgRjvUw/viewform?embedded=true" 
        width="100%" 
        height="2200" 
        title="Online Petition Form"
        style={{ border: "none" }}
      >
        Loading…
      </iframe>
    </main>
  )
}
