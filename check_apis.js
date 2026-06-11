// Script to find API endpoints from page
(function() {
  var results = {};
  
  // Check __NUXT__ state
  var el = document.getElementById("__NUXT_DATA_STATE__") || document.getElementById("__NUXT_STATE__");
  if (el) results.nuxtState = el.textContent.substring(0, 500);
  
  // Find all API-like URLs in the page
  var html = document.querySelector("html").innerHTML;
  var apiUrls = html.match(/https?:\/\/[^\/]+\/api\/[^\s\"'<>]+/g) || [];
  var apiPaths = html.match(/["'`]\/(api|graphql|v1|v2|rest)\/[^\s\"'`]+["'`]/g) || [];
  results.apiUrls = apiUrls.slice(0, 20);
  results.apiPaths = apiPaths.slice(0, 20);
  
  // Check fetch/XHR interceptors
  var origFetch = window.fetch;
  if (origFetch) results.hasFetch = true;
  
  return JSON.stringify(results);
})()
