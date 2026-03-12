async function loadGallery(){

  const { data, error } = await db
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error("Gallery Load Error:", error);
    return;
  }

  const gallery = document.getElementById("galleryContainer");

  if(!gallery){
    console.error("galleryContainer not found");
    return;
  }

  gallery.innerHTML = "";

  data.forEach(img => {

    const image = document.createElement("img");
    image.src = img.image_url;
    image.className = "gallery-img";

    gallery.appendChild(image);

  });

}

loadGallery();