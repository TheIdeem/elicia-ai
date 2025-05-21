"use client";
import { useState } from "react";
import Image from "next/image";

const tabs = [
  {
    id: "Connect",
    label: "Connect",
    icon: "/icons/connect.svg",
    iconClass: "[&_path]:stroke-w1",
    content: {
      text: "The path to engineering excellence starts with access to the right information. Quickly connect your entire ecosystem to make it easy to identify owners, understand state, drive action, and measure outcomes.",
      mediaType: "video",
      mediaSrc: "https://a-us.storyblok.com/f/1021527/x/0416d4616d/connectnopadding.mp4",
    },
  },
  {
    id: "Assess",
    label: "Assess",
    icon: "/icons/assess.svg",
    iconClass: "[&_path]:stroke-p1",
  content: {
      text: "Assess your engineering maturity and standards compliance instantly across all teams and services.",
      mediaType: "image",
      mediaSrc: "/images/assess-tab.svg",
    },
  },
  {
    id: "Act",
    label: "Act",
    icon: "/icons/act.svg",
    iconClass: "[&_path]:stroke-p1",
    content: {
      text: "Act on insights with automated workflows for onboarding, migrations, and incident response.",
      mediaType: "image",
      mediaSrc: "/images/act-tab.svg",
    },
  },
  {
    id: "Build",
    label: "Build",
    icon: "/icons/act.svg",
    iconClass: "[&_path]:stroke-p1",
    content: {
      text: "Build paved paths and templates to accelerate delivery and enforce best practices.",
      mediaType: "image",
      mediaSrc: "/images/act-tab.svg",
    },
  },
  {
    id: "Measure",
    label: "Measure",
    icon: "/icons/assess.svg",
    iconClass: "[&_path]:stroke-p1",
    content: {
      text: "Measure outcomes and continuously improve with actionable metrics and feedback.",
      mediaType: "image",
      mediaSrc: "/images/assess-tab.svg",
    },
  },
];

const ConnectIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3442_20758)">
      <path d="M4.96289 10C6.06746 10 6.96289 9.10457 6.96289 8C6.96289 6.89543 6.06746 6 4.96289 6C3.85832 6 2.96289 6.89543 2.96289 8C2.96289 9.10457 3.85832 10 4.96289 10Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9629 14.5C13.0675 14.5 13.9629 13.6046 13.9629 12.5C13.9629 11.3954 13.0675 10.5 11.9629 10.5C10.8583 10.5 9.96289 11.3954 9.96289 12.5C9.96289 13.6046 10.8583 14.5 11.9629 14.5Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9629 5.5C13.0675 5.5 13.9629 4.60457 13.9629 3.5C13.9629 2.39543 13.0675 1.5 11.9629 1.5C10.8583 1.5 9.96289 2.39543 9.96289 3.5C9.96289 4.60457 10.8583 5.5 11.9629 5.5Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2827 4.58105L6.64648 6.91855" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.64648 9.08105L10.2827 11.4186" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3442_20758">
        <rect width="16" height="16" fill="white" transform="translate(0.962891)" />
      </clipPath>
    </defs>
  </svg>
);
const AssessIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3442_20776)">
      <path d="M8.59191 11.8182L12.0119 13.9213C12.1006 13.9752 12.2034 14.0015 12.3071 13.997C12.4108 13.9925 12.5108 13.9574 12.5946 13.8961C12.6783 13.8347 12.742 13.7499 12.7776 13.6524C12.8131 13.5549 12.819 13.449 12.7944 13.3482L11.8644 9.42379L14.9082 6.79879C14.9858 6.73064 15.0417 6.64127 15.0691 6.54169C15.0965 6.44211 15.0941 6.33669 15.0623 6.23845C15.0304 6.14021 14.9705 6.05344 14.8899 5.98885C14.8093 5.92427 14.7116 5.8847 14.6088 5.87504L10.6144 5.55004L9.07566 1.82504C9.03643 1.72893 8.96947 1.6467 8.88331 1.58881C8.79715 1.53092 8.69571 1.5 8.59191 1.5C8.48811 1.5 8.38666 1.53092 8.3005 1.58881C8.21435 1.6467 8.14738 1.72893 8.10816 1.82504L6.56941 5.55004L2.57503 5.87504C2.47151 5.88413 2.37296 5.92352 2.2917 5.98829C2.21044 6.05307 2.15006 6.14035 2.11812 6.23924C2.08618 6.33813 2.08409 6.44424 2.11211 6.54431C2.14013 6.64439 2.19701 6.73398 2.27566 6.80191L5.31941 9.42691L4.38941 13.3482C4.36482 13.449 4.37068 13.5549 4.40625 13.6524C4.44182 13.7499 4.50551 13.8347 4.58925 13.8961C4.673 13.9574 4.77305 13.9925 4.87675 13.997C4.98046 14.0015 5.08317 13.9752 5.17191 13.9213L8.59191 11.8182Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3442_20776">
        <rect width="16" height="16" fill="white" transform="translate(0.592529)" />
      </clipPath>
    </defs>
  </svg>
);
const ActIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3442_20767)">
      <path d="M8.77759 2V3.5" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.77759 12.5V14" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.77759 7V9" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.2776 3.5H5.27759C5.00145 3.5 4.77759 3.72386 4.77759 4V6.5C4.77759 6.77614 5.00145 7 5.27759 7H12.2776C12.5537 7 12.7776 6.77614 12.7776 6.5V4C12.7776 3.72386 12.5537 3.5 12.2776 3.5Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7776 9H3.77759C3.50145 9 3.27759 9.22386 3.27759 9.5V12C3.27759 12.2761 3.50145 12.5 3.77759 12.5H13.7776C14.0537 12.5 14.2776 12.2761 14.2776 12V9.5C14.2776 9.22386 14.0537 9 13.7776 9Z" stroke={active ? "#ECEAF4" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3442_20767">
        <rect width="16" height="16" fill="white" transform="translate(0.777588)" />
      </clipPath>
    </defs>
  </svg>
);
const BuildIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3442_20781)">
      <path d="M6.40723 7H10.4072" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.40723 9H10.4072" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.40228 13.1945C6.66261 13.9239 8.14521 14.1701 9.57365 13.8871C11.0021 13.6042 12.2789 12.8114 13.166 11.6566C14.053 10.5017 14.4899 9.06374 14.395 7.61063C14.3002 6.15753 13.6801 4.78852 12.6504 3.75883C11.6207 2.72915 10.2517 2.10907 8.7986 2.01422C7.3455 1.91936 5.90749 2.3562 4.75269 3.24328C3.59788 4.13037 2.80509 5.40715 2.52213 6.83559C2.23917 8.26403 2.48535 9.74662 3.21478 11.007L2.43291 13.3413C2.40353 13.4294 2.39926 13.524 2.42059 13.6144C2.44192 13.7047 2.48801 13.7874 2.55367 13.8531C2.61934 13.9187 2.702 13.9648 2.79238 13.9861C2.88277 14.0075 2.97731 14.0032 3.06541 13.9738L5.40228 13.1945Z" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3442_20781">
        <rect width="16" height="16" fill="white" transform="translate(0.407227)" />
      </clipPath>
    </defs>
  </svg>
);
const MeasureIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3442_20788)">
      <path d="M6.97217 7.25L8.97217 9.25" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4759 6.24609L11.9722 8.74984" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.72225 4.00009L3.58287 3.11071C4.09361 2.5999 4.69996 2.1947 5.3673 1.91825C6.03465 1.6418 6.74991 1.49951 7.47225 1.49951C8.19459 1.49951 8.90985 1.6418 9.5772 1.91825C10.2445 2.1947 10.8509 2.5999 11.3616 3.11071L15.576 7.35384C15.6697 7.4476 15.7223 7.57472 15.7223 7.70727C15.7223 7.83983 15.6697 7.96695 15.576 8.06071L13.7847 9.85384C13.691 9.94753 13.5639 10.0002 13.4313 10.0002C13.2988 10.0002 13.1716 9.94753 13.0779 9.85384L10.7222 7.50009L4.3685 13.8538C4.27474 13.9475 4.14761 14.0002 4.01506 14.0002C3.88251 14.0002 3.75538 13.9475 3.66162 13.8538L2.3685 12.5626C2.2748 12.4688 2.22217 12.3417 2.22217 12.2091C2.22217 12.0766 2.2748 11.9495 2.3685 11.8557L8.72225 5.50009L5.2085 1.98634" stroke={active ? "#653EE8" : "#653EE8"} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3442_20788">
        <rect width="16" height="16" fill="white" transform="translate(0.222168)" />
      </clipPath>
    </defs>
  </svg>
);

export default function HowItWorksTabs() {
  const [active, setActive] = useState("Connect");
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <section className="container-light opacity-100 py-24">
      <div dir="ltr" data-orientation="horizontal" className="!container-fluid flex items-center flex-col">
        <div className="flex flex-col gap-10 md:gap-12 text-center text-balance justify-center items-center w-full">
          <h2 className="large-title mb-2">How it works</h2>
          {/* Pills tablist with gradients */}
          <div className="relative w-full max-w-full">
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-w1 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-w1 to-transparent z-10 pointer-events-none" />
        <div className="overflow-x-auto w-full no-scrollbar relative">
              <div role="tablist" aria-orientation="horizontal" className="relative inline-block px-4 md:px-0" tabIndex={0} data-orientation="horizontal" style={{ outline: "none" }}>
                <div className="flex flex-row gap-4 w-fit rounded-full bg-p1/10 border-[1px] border-p1/20 p-1 relative">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                      aria-selected={active === tab.id}
                      aria-controls={`tab-content-${tab.id}`}
                      data-state={active === tab.id ? "active" : "inactive"}
                  id={`${tab.id}-tab`}
                      className={`flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-full transition-colors relative z-10 ${active === tab.id ? "bg-p1/90 text-w1" : "bg-transparent text-p1"}`}
                      tabIndex={active === tab.id ? 0 : -1}
                      data-orientation="horizontal"
                      onClick={() => setActive(tab.id)}
                    >
                      {tab.id === "Connect" && <ConnectIcon active={active === tab.id} />}
                      {tab.id === "Assess" && <AssessIcon active={active === tab.id} />}
                      {tab.id === "Act" && <ActIcon active={active === tab.id} />}
                      {tab.id === "Build" && <BuildIcon active={active === tab.id} />}
                      {tab.id === "Measure" && <MeasureIcon active={active === tab.id} />}
                      <span className={`transition-colors ${active === tab.id ? "text-w1" : "text-p1"}`}>{tab.label}</span>
                </button>
              ))}
                  {/* Animated pill indicator (optional, for active tab) */}
                  <div className="absolute top-1 left-1 bg-p1 rounded-full transition-all duration-300 ease-in-out" style={{ height: 'calc(100% - 8px)', left: `calc(5px + ${tabs.findIndex(t => t.id === active) * 122}px)`, width: '118px', zIndex: 1, opacity: 0 }} />
            </div>
          </div>
        </div>
      </div>
          {/* Tab content */}
          <div className="flex flex-col gap-0 items-center relative w-full">
        {tabs.map((tab) => (
          <div
            key={tab.id}
                data-state={active === tab.id ? "active" : "inactive"}
                data-orientation="horizontal"
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
                id={`tab-content-${tab.id}`}
            tabIndex={0}
                className={`data-[state=active]:flex flex-col gap-8 items-center data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=inactive]:animate-out relative md:mx-0 section-x ${active === tab.id ? "flex" : "hidden"}`}
                style={{ animationDuration: "0s" }}
              >
                <p className="body text-w4 !text-balance">{tab.content.text}</p>
                <div className="w-full border-bg1/20 border p-2 relative max-h-[584px] xl:min-h-[584px] grid content-center bg-white rounded-xl">
                  {/* White corners */}
              <div className="size-0.5 absolute z-10 bg-bg1 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
                  <div className="size-0.5 absolute z-10 bg-bg1 top-0 left-1/2 -translate-x-1/2 -translate-y-px"></div>
                  <div className="size-0.5 absolute z-10 bg-bg1 bottom-0 left-1/2 -translate-x-1/2 translate-y-px"></div>
                  <div className="size-0.5 absolute z-10 bg-bg1 left-0 top-1/2 -translate-y-1/2 -translate-x-px"></div>
                  <div className="size-0.5 absolute z-10 bg-bg1 right-0 top-1/2 -translate-y-1/2 translate-x-px"></div>
                  {/* Media */}
                  {tab.content.mediaType === "video" ? (
                    <video
                      src={tab.content.mediaSrc}
                      className="w-auto m-auto rounded-lg"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
              <Image
                      src={tab.content.mediaSrc}
                      alt="How it works illustration"
                width={1200}
                height={800}
                      className="w-full h-auto object-contain rounded-lg"
              />
                  )}
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>
    </section>
  );
} 