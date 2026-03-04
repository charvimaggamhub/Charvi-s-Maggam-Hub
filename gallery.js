const SUPABASE_URL = "https://syciwtjfsvgggljorxbm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Y2l3dGpmc3ZnZ2dsam9yeGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDA3NzQsImV4cCI6MjA4ODE3Njc3NH0.QMx67QYQ-PDh3ZciJnu0PTCkUMhBMV2q57AGF5t2E3Q";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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