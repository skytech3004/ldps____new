type CmsImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function CmsImage({ src, alt = "", className }: CmsImageProps) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
