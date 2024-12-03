import dynamic from "next/dynamic";

const CeramicsLayout = dynamic(() => import("@/app/_layouts/CeramcisLayout"), {
  ssr: false,
});

export default function RLayout({ children }: { children: React.ReactNode }) {
  return <CeramicsLayout>{children}</CeramicsLayout>;
}
