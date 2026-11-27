// Supabase URL and public publishable key. Never put a service role key here.
const publicBlogConfig = {
  url: "https://vcpktnjgvmhxucwwhame.supabase.co",
  publishableKey: "sb_publishable_vnsbPF0_89qxzonNL6b-Rw_017qHgDq"
};
if (typeof module !== 'undefined') module.exports = publicBlogConfig;
else window.SUPABASE_CONFIG = publicBlogConfig;
