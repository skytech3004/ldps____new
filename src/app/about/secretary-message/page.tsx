"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageDeskLayout from "@/components/about/MessageDeskLayout";
import { aboutPageDefaults } from "@/data/aboutPages";

export default function SecretaryMessagePage() {
  const defaults = aboutPageDefaults["secretary-message"];
  const [pageData, setPageData] = useState(defaults);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch("/api/admin/about-pages?slug=secretary-message", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPageData({
            slug: "secretary-message",
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
        console.error("Failed to load secretary message page:", error);
      }
    }

    fetchPage();
  }, []);

  return (
    <>
      <Navbar />
      <MessageDeskLayout
        breadcrumbLabel="Secretary's Message"
        pageTitle={pageData.pageTitle}
        subtitle={pageData.pageSubtitle}
        portraitImage={pageData.portraitImage}
        personName={pageData.personName}
        personDesignation={pageData.personDesignation}
        content={pageData.content}
        backHref="/about/management"
        backLabel="Back to Management Committee"
      />
      <Footer />
    </>
  );
}
