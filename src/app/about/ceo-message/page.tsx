"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageDeskLayout from "@/components/about/MessageDeskLayout";
import { aboutPageDefaults } from "@/data/aboutPages";

export default function CeoMessagePage() {
  const defaults = aboutPageDefaults["ceo-message"];
  const [pageData, setPageData] = useState(defaults);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch("/api/admin/about-pages?slug=ceo-message", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPageData({
            slug: "ceo-message",
            pageTitle: data.pageTitle || defaults.pageTitle,
            bannerImage: data.bannerImage || defaults.bannerImage,
            portraitImage: data.portraitImage || defaults.portraitImage,
            personName: data.personName || defaults.personName,
            personDesignation: data.personDesignation || defaults.personDesignation,
            content: data.content || defaults.content,
            members: Array.isArray(data.members) ? data.members : defaults.members,
          });
        }
      } catch (error) {
        console.error("Failed to load CEO message page:", error);
      }
    }

    fetchPage();
  }, []);

  return (
    <>
      <Navbar />
      <MessageDeskLayout
        breadcrumbLabel="CEO's Message"
        pageTitle={pageData.pageTitle}
        subtitle="A message from the Chief Executive Officer of Vidyawadi."
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
