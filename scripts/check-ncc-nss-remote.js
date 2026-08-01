async function main() {
  try {
    const res = await fetch('https://www.vidyawadi.org/api/gallery');
    const gallery = await res.json();
    const galleryArr = Array.isArray(gallery) ? gallery : (gallery.data || []);
    const nccNssAlbum = galleryArr.find(item => String(item.albumTitle).toLowerCase().includes('ncc'));
    console.log("Remote NCC & NSS Album:", JSON.stringify(nccNssAlbum, null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();
