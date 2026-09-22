/* Dastchin Supabase public client. Safe to ship: publishable key + RLS. */
window.DASTCHIN_SUPABASE_URL="https://ydfjpwofursqdxtjnvdw.supabase.co";
window.DASTCHIN_SUPABASE_KEY="sb_publishable_hkQHmGJCe3Mm96JvIn6QEg_N5dqCMhV";
window.dastchinSupabase=null;
(function(){
  function init(){
    if(!window.supabase){console.error("Supabase SDK failed to load");return;}
    window.dastchinSupabase=window.supabase.createClient(
      window.DASTCHIN_SUPABASE_URL,
      window.DASTCHIN_SUPABASE_KEY,
      {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
    );
    window.dispatchEvent(new CustomEvent("dastchin:supabase-ready"));
  }
  if(window.supabase)init();else window.addEventListener("load",init,{once:true});
})();