"use client";

import React from "react";
import Link from "next/link";
import PageLayout, { PageSectionHeader } from "@/components/ui/PageLayout";
import GrMechanismView from "@/components/GrMechanismView";

export default function GrMechanismPage() {
  return (
    <PageLayout
      groupName="More"
      pageTitle="Grievance Redressal Mechanism"
      subtitle="We provide a transparent structure to address concerns, feedback, and grievances from parents, students, and staff to maintain a healthy academic environment."
    >
      <GrMechanismView />

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20"
        >
          Back to Home
        </Link>
      </div>
    </PageLayout>
  );
}
