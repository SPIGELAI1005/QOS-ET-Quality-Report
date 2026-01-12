"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, BarChart3, Sparkles, Shield } from "lucide-react";
import { RoleAccessDialog } from "@/components/auth/role-access-dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useTheme } from "next-themes";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showButton, setShowButton] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccessClick = () => {
    const video = videoRef.current;
    if (!video) return;

    setShowButton(false);
    setIsPlaying(true);

    // Play the video
    video.play();

    // When video ends, show last frame and then open role selection popup
    video.onended = () => {
      // Seek to last frame
      video.currentTime = video.duration - 0.1;
      video.pause();
      setIsPlaying(false);

      // Let the last frame "settle" visually, then show the popup
      setTimeout(() => setIsRoleDialogOpen(true), 300);
    };
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
      {/* Dark overlay for better text readability - only in dark mode */}
      {isDarkMode && <div className="fixed inset-0 bg-black/40 z-[1] pointer-events-none" />}

      {/* Animated Background Lines */}
      <div className="animated-lines-bg z-[2]" />
      
      {/* Glass overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/60 via-background/40 to-primary/10 backdrop-blur-[1px] z-[3] pointer-events-none" />

      {/* Full Screen Video - in front of background layers */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain z-[4]"
        preload="auto"
        style={{ 
          display: 'block',
          width: '50%'
        }}
        onError={(e) => {
          console.error('Video failed to load:', e);
        }}
        onLoadedMetadata={(e) => {
          const video = e.target as HTMLVideoElement;
          // Freeze on first frame
          video.currentTime = 0;
          video.pause();
        }}
      >
        <source src="/Media/QOS Logo Intro.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
      {/* Main Title - Top of page */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center space-y-2 animate-fade-in z-20 w-full max-w-5xl px-4">
        <h1 className={`text-xl md:text-2xl font-bold mx-auto leading-tight tracking-tight ${
          isDarkMode 
            ? "text-[#00FF00] drop-shadow-[0_2px_8px_rgba(0,255,0,0.3)]" 
            : "text-[#00AA00] drop-shadow-[0_2px_8px_rgba(0,170,0,0.2)]"
        }`}>
          {t.home.title}
          <span className={`block mt-1 bg-clip-text text-transparent ${
            isDarkMode
              ? "bg-gradient-to-r from-[#00FF00] via-[#00FF88] to-[#00FF00]"
              : "bg-gradient-to-r from-[#00AA00] via-[#00CC66] to-[#00AA00]"
          }`}>
            {t.home.subtitle}
          </span>
        </h1>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="w-full max-w-[1600px] flex items-center justify-center relative mx-auto">
          
          {/* Left Side Boxes - positioned 10% more towards center, may overlap with video */}
          <div className="absolute left-[35%] flex flex-col gap-6 -translate-x-full pr-10 w-full max-w-[400px]">
            <div className={`group relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 w-full overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-card/35 via-card/25 to-card/35 border-2 border-[#00FF00]/40 hover:border-[#00FF00]/60 hover:shadow-[0_10px_40px_0_rgba(0,255,0,0.25)]"
                : "bg-gradient-to-br from-card/90 via-card/80 to-card/90 border-2 border-[#00AA00]/60 hover:border-[#00AA00]/80 hover:shadow-[0_10px_40px_0_rgba(0,170,0,0.15)] shadow-lg"
            }`}>
              {/* Glass shine effect - diagonal green highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform ease-in-out ${
                  isDarkMode ? "via-[#00FF00]/30" : "via-[#00AA00]/20"
                }`} style={{ width: '200%', height: '200%', transitionDuration: '1333ms' }}></div>
              </div>
              <div className={`p-4 rounded-full backdrop-blur-md border-2 group-hover:scale-105 transition-all duration-300 relative z-10 ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#00FF00]/25 via-[#00FF00]/15 to-[#00FF00]/25 border-[#00FF00]/40 group-hover:border-[#00FF00]/60"
                  : "bg-gradient-to-br from-[#00AA00]/30 via-[#00AA00]/20 to-[#00AA00]/30 border-[#00AA00]/60 group-hover:border-[#00AA00]/80"
              }`}>
                <TrendingUp className={`h-9 w-9 group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? "text-[#00FF00]" : "text-[#00AA00]"
                }`} />
              </div>
              <h3 className={`text-2xl font-bold group-hover:transition-colors duration-300 leading-tight relative z-10 whitespace-pre-line ${
                isDarkMode
                  ? "text-[#00FF00] group-hover:text-[#00FF88]"
                  : "text-[#00AA00] group-hover:text-[#00CC66]"
              }`}>
                {t.home.realTimePpmTracking}
              </h3>
              <p className={`text-[0.95rem] leading-relaxed px-3 relative z-10 ${
                isDarkMode
                  ? "text-[#00FF00]/85"
                  : "text-[#00AA00]/90"
              }`}>
                {t.home.realTimePpmDescription}
              </p>
            </div>

            <div className={`group relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 w-full overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-card/35 via-card/25 to-card/35 border-2 border-[#00FF00]/40 hover:border-[#00FF00]/60 hover:shadow-[0_10px_40px_0_rgba(0,255,0,0.25)]"
                : "bg-gradient-to-br from-card/90 via-card/80 to-card/90 border-2 border-[#00AA00]/60 hover:border-[#00AA00]/80 hover:shadow-[0_10px_40px_0_rgba(0,170,0,0.15)] shadow-lg"
            }`}>
              {/* Glass shine effect - diagonal green highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform ease-in-out ${
                  isDarkMode ? "via-[#00FF00]/30" : "via-[#00AA00]/20"
                }`} style={{ width: '200%', height: '200%', transitionDuration: '1333ms' }}></div>
              </div>
              <div className={`p-4 rounded-full backdrop-blur-md border-2 group-hover:scale-105 transition-all duration-300 relative z-10 ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#00FF00]/25 via-[#00FF00]/15 to-[#00FF00]/25 border-[#00FF00]/40 group-hover:border-[#00FF00]/60"
                  : "bg-gradient-to-br from-[#00AA00]/30 via-[#00AA00]/20 to-[#00AA00]/30 border-[#00AA00]/60 group-hover:border-[#00AA00]/80"
              }`}>
                <Target className={`h-9 w-9 group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? "text-[#00FF00]" : "text-[#00AA00]"
                }`} />
              </div>
              <h3 className={`text-2xl font-bold group-hover:transition-colors duration-300 leading-tight relative z-10 whitespace-pre-line ${
                isDarkMode
                  ? "text-[#00FF00] group-hover:text-[#00FF88]"
                  : "text-[#00AA00] group-hover:text-[#00CC66]"
              }`}>
                {t.home.comprehensiveAnalysis}
              </h3>
              <p className={`text-[0.95rem] leading-relaxed px-3 relative z-10 ${
                isDarkMode
                  ? "text-[#00FF00]/85"
                  : "text-[#00AA00]/90"
              }`}>
                {t.home.comprehensiveAnalysisDescription}
              </p>
            </div>
          </div>

          {/* Center - Video is in background, centered at 50% width */}
          {/* The video is already positioned at left-1/2 -translate-x-1/2 with 50% width, so it's centered */}

          {/* Right Side Boxes - positioned 10% more towards center, may overlap with video */}
          <div className="absolute right-[35%] flex flex-col gap-6 translate-x-full pl-10 w-full max-w-[400px]">
            <div className={`group relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 w-full overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-card/35 via-card/25 to-card/35 border-2 border-[#00FF00]/40 hover:border-[#00FF00]/60 hover:shadow-[0_10px_40px_0_rgba(0,255,0,0.25)]"
                : "bg-gradient-to-br from-card/90 via-card/80 to-card/90 border-2 border-[#00AA00]/60 hover:border-[#00AA00]/80 hover:shadow-[0_10px_40px_0_rgba(0,170,0,0.15)] shadow-lg"
            }`}>
              {/* Glass shine effect - diagonal green highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform ease-in-out ${
                  isDarkMode ? "via-[#00FF00]/30" : "via-[#00AA00]/20"
                }`} style={{ width: '200%', height: '200%', transitionDuration: '1333ms' }}></div>
              </div>
              <div className={`p-4 rounded-full backdrop-blur-md border-2 group-hover:scale-105 transition-all duration-300 relative z-10 ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#00FF00]/25 via-[#00FF00]/15 to-[#00FF00]/25 border-[#00FF00]/40 group-hover:border-[#00FF00]/60"
                  : "bg-gradient-to-br from-[#00AA00]/30 via-[#00AA00]/20 to-[#00AA00]/30 border-[#00AA00]/60 group-hover:border-[#00AA00]/80"
              }`}>
                <Sparkles className={`h-9 w-9 group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? "text-[#00FF00]" : "text-[#00AA00]"
                }`} />
              </div>
              <h3 className={`text-2xl font-bold group-hover:transition-colors duration-300 leading-tight relative z-10 whitespace-pre-line ${
                isDarkMode
                  ? "text-[#00FF00] group-hover:text-[#00FF88]"
                  : "text-[#00AA00] group-hover:text-[#00CC66]"
              }`}>
                {t.home.aiPoweredInsights}
              </h3>
              <p className={`text-[0.95rem] leading-relaxed px-3 relative z-10 ${
                isDarkMode
                  ? "text-[#00FF00]/85"
                  : "text-[#00AA00]/90"
              }`}>
                {t.home.aiPoweredInsightsDescription}
              </p>
            </div>

            <div className={`group relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 w-full overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-card/35 via-card/25 to-card/35 border-2 border-[#00FF00]/40 hover:border-[#00FF00]/60 hover:shadow-[0_10px_40px_0_rgba(0,255,0,0.25)]"
                : "bg-gradient-to-br from-card/90 via-card/80 to-card/90 border-2 border-[#00AA00]/60 hover:border-[#00AA00]/80 hover:shadow-[0_10px_40px_0_rgba(0,170,0,0.15)] shadow-lg"
            }`}>
              {/* Glass shine effect - diagonal green highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform ease-in-out ${
                  isDarkMode ? "via-[#00FF00]/30" : "via-[#00AA00]/20"
                }`} style={{ width: '200%', height: '200%', transitionDuration: '1333ms' }}></div>
              </div>
              <div className={`p-4 rounded-full backdrop-blur-md border-2 group-hover:scale-105 transition-all duration-300 relative z-10 ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#00FF00]/25 via-[#00FF00]/15 to-[#00FF00]/25 border-[#00FF00]/40 group-hover:border-[#00FF00]/60"
                  : "bg-gradient-to-br from-[#00AA00]/30 via-[#00AA00]/20 to-[#00AA00]/30 border-[#00AA00]/60 group-hover:border-[#00AA00]/80"
              }`}>
                <Shield className={`h-9 w-9 group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? "text-[#00FF00]" : "text-[#00AA00]"
                }`} />
              </div>
              <h3 className={`text-2xl font-bold group-hover:transition-colors duration-300 leading-tight relative z-10 whitespace-pre-line ${
                isDarkMode
                  ? "text-[#00FF00] group-hover:text-[#00FF88]"
                  : "text-[#00AA00] group-hover:text-[#00CC66]"
              }`}>
                {t.home.qualityAssurance}
              </h3>
              <p className={`text-[0.95rem] leading-relaxed px-3 relative z-10 ${
                isDarkMode
                  ? "text-[#00FF00]/85"
                  : "text-[#00AA00]/90"
              }`}>
                {t.home.qualityAssuranceDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button - Bottom of page */}
        {showButton && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={handleAccessClick}
              className={`group relative px-10 py-4 rounded-xl font-semibold text-base backdrop-blur-xl 
                       border-2 transition-all duration-300 ease-out
                       flex items-center gap-2
                       before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 ${
                         isDarkMode
                           ? "text-[#00FF00] bg-gradient-to-br from-white/25 via-white/20 to-white/15 border-[#00FF00]/60 shadow-[0_4px_20px_0_rgba(0,255,0,0.3)] hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20 hover:border-[#00FF00]/80 hover:shadow-[0_6px_30px_0_rgba(0,255,0,0.4)] before:from-[#00FF00]/20"
                           : "text-[#00AA00] bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-[#00AA00]/70 shadow-[0_4px_20px_0_rgba(0,170,0,0.2)] hover:bg-gradient-to-br hover:from-white hover:via-white/95 hover:to-white hover:border-[#00AA00]/90 hover:shadow-[0_6px_30px_0_rgba(0,170,0,0.3)] before:from-[#00AA00]/15"
                       }`}
            >
              <span className="relative z-10 tracking-wide font-medium">{t.home.generateReport}</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`border-t-2 backdrop-blur-xl py-3 px-6 mt-auto z-10 ${
        isDarkMode
          ? "border-[#00FF00]/40 bg-gradient-to-br from-background/90 via-background/70 to-background/90"
          : "border-[#00AA00]/50 bg-gradient-to-br from-background/95 via-background/90 to-background/95"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className={`text-xs font-semibold tracking-wide ${
            isDarkMode ? "text-[#00FF00]/95" : "text-[#00AA00]"
          }`}>
            {t.home.footerCopyright}
          </p>
          <div className="flex items-center space-x-2.5">
            <BarChart3 className={`h-4 w-4 animate-pulse ${
              isDarkMode ? "text-[#00FF00]" : "text-[#00AA00]"
            }`} />
            <span className={`text-xs font-semibold tracking-wide ${
              isDarkMode ? "text-[#00FF00]/95" : "text-[#00AA00]"
            }`}>
              {t.home.qualityManagementSystem}
            </span>
          </div>
        </div>
      </footer>
      </div>

      {/* Role login popup after intro video */}
      <RoleAccessDialog
        open={isRoleDialogOpen}
        title={t.home.login}
        description={t.home.loginDescription}
        forceChoice
        onAuthenticated={() => {
          setIsRoleDialogOpen(false);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
