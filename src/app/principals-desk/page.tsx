"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageDeskLayout from "@/components/about/MessageDeskLayout";
import { aboutPageDefaults } from "@/data/aboutPages";

export default function PrincipalsDeskPage() {
  const defaults = aboutPageDefaults["principals-message"];
  const [pageData, setPageData] = useState(defaults);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch("/api/admin/about-pages?slug=principals-message", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPageData({
            slug: "principals-message",
            pageTitle: data.pageTitle || defaults.pageTitle,
            pageSubtitle: data.pageSubtitle || defaults.pageSubtitle,
            bannerImage: data.bannerImage || defaults.bannerImage,
            portraitImage: data.portraitImage || defaults.portraitImage,
            personName: data.personName || defaults.personName,
            personDesignation: data.personDesignation || defaults.personDesignation,
            content: data.content || defaults.content,
            inspirationContent: data.inspirationContent || defaults.inspirationContent,
            members: Array.isArray(data.members) ? data.members : defaults.members,
          });
        }
      } catch (error) {
        console.error("Failed to load principal's message page:", error);
      }
    }

    fetchPage();
  }, []);

  return (
    <>
      <Navbar />
      <MessageDeskLayout
        breadcrumbLabel="Principal's Desk"
        pageTitle={pageData.pageTitle}
        subtitle={pageData.pageSubtitle}
        portraitImage={pageData.portraitImage}
        personName={pageData.personName}
        personDesignation={pageData.personDesignation}
        content={pageData.content}
        backHref="/about-lps"
        backLabel="Back to About LPS"
      />
      <Footer />
    </>
  );
}
