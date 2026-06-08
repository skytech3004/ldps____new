import AdminBrandManager from "@/components/AdminBrandManager";

export default function AdminBrandPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-[#112759]/70 p-6 md:p-8">
        <p className="text-xs tracking-[0.4em] text-white/70 font-black uppercase">Identity Management</p>
        <h1 className="text-4xl font-black mt-2">Brand Assets</h1>
        <p className="text-white/70 mt-2">Update your school logo and brand-related assets.</p>
      </div>

      <AdminBrandManager />
    </div>
  );
}
