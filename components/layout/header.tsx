"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Grid, List } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { FilterType } from "@/types";
import { useAdmin } from "@/hooks/use-admin";
import { GoogleTranslateWidget } from "@/components/google-translate-widget";
import { blockTranslationFeedback, createAdminButtonHandler } from "@/lib/translation-utils";

interface HeaderProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ 
  viewMode, 
  onViewModeChange, 
  searchQuery, 
  onSearchChange 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAdmin();



  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur" style={{ backgroundColor: '#5F98F5' }}>
      <div className="container mx-auto flex h-16 items-center justify-center space-x-4">
        {/* 로고 */}
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-white text-sm font-medium tracking-wide">
            SINCE 2025
          </span>
        </div>

        {/* 뷰 모드 토글 */}
        <div className="flex items-center space-x-1 border border-white/30 rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-white text-blue-600" : "text-white hover:bg-white/20"}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-white text-blue-600" : "text-white hover:bg-white/20"}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* 구글 번역 위젯 */}
        <GoogleTranslateWidget />

        {/* 환생 버튼 (번역 위젯 숨김 후 표시) */}
        <div id="translate-revive-button-container" className="hidden">
          <Button
            id="translate-revive-button"
            variant="outline"
            size="sm"
            className="h-8 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={() => {
              // 캐시 지우기
              sessionStorage.removeItem("gptx:selectedLang");
              sessionStorage.removeItem("gptx:translate:muted");
              
              // 로컬 스토리지도 지우기 (번역 관련)
              localStorage.removeItem("googtrans");
              localStorage.removeItem("googtrans_/");
              
              // 쿠키도 지우기 (번역 관련)
              document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "googtrans_/=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              
              // 페이지 리프레시로 완전 초기화
              window.location.reload();
            }}
          >
            🌐 다시 번역하기
          </Button>
        </div>

        {/* 검색바 */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/70" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("search")}
              className="pl-8 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>
        </div>
        
        {/* 관리자 모드 표시 */}
        {isAuthenticated && (
          <div className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-md">
            👨‍💻 Admin Mode
          </div>
        )}



        {/* 모바일 메뉴 */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:bg-white/20"
          onClick={createAdminButtonHandler(() => setIsMenuOpen(!isMenuOpen))}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>


    </header>
  );
}
