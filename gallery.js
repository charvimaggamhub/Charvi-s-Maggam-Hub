async function loadGallery(){

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at",{ascending:false});

  const gallery = document.getElementById("gallery");

  gallery.innerHTML = "";

  data.forEach(img => {

    gallery.innerHTML += `
      <img src="${img.image_url}">
    `;

  });

}

loadGallery();