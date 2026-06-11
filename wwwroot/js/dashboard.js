// ============================================================
// Dashboard — Sidebar Toggle, Submenu & Active Link
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  // Matiin transisi dulu biar ga animate pas setup
  document.body.classList.add("preload");

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("sidebarToggle");

  // — Mobile: buka sidebar
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.add("open");
      overlay.classList.add("open");
    });
  }

  // — Mobile: tutup sidebar
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // ============================================================
  // Submenu Toggle
  // ============================================================

  // Toggle untuk semua level submenu (submenu & sub-submenu)
  document.querySelectorAll("[data-toggle=\"submenu\"], [data-toggle=\"sub-submenu\"]").forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var parent = this.closest(".has-submenu");
      if (!parent) return;

      // Cari target submenu container
      var isNested = this.getAttribute("data-toggle") === "sub-submenu";
      var submenuContainer = parent.querySelector(isNested ? ".sub-submenu" : ".submenu");

      // Accordion: tutup submenu se-level (siblings)
      var siblings = parent.parentElement?.children;
      if (siblings) {
        for (var i = 0; i < siblings.length; i++) {
          var sib = siblings[i];
          if (sib !== parent && sib.classList.contains("has-submenu") && sib.classList.contains("expanded")) {
            sib.classList.remove("expanded");
            if (isNested) {
              sib.querySelector(".sub-submenu")?.classList.remove("open");
            } else {
              sib.querySelector(".submenu")?.classList.remove("open");
            }
          }
        }
      }

      // Toggle current
      parent.classList.toggle("expanded");
      if (submenuContainer) {
        submenuContainer.classList.toggle("open");
      }
    });
  });

  // ============================================================
  // Active Link Detection
  // ============================================================

  var currentPath = window.location.pathname.replace(/\/$/, "").toLowerCase();

  // Helper: cocokin path
  function matchPath(linkHref) {
    var href = linkHref.replace(/\/$/, "").toLowerCase();
    return currentPath === href;
  }

  // 1. Cari submenu-link yang cocok
  var activeSubLink = null;
  document.querySelectorAll(".submenu-link").forEach(function (link) {
    if (matchPath(link.getAttribute("href"))) {
      link.classList.add("active");
      link.closest("li").classList.add("active"); // trigger .line-active
      activeSubLink = link;
    }
  });

  // 2. Kalo ada submenu-link aktif, expand semua parent (nested support)
  if (activeSubLink) {
    var el = activeSubLink;
    while (el) {
      var sub = el.closest(".submenu, .sub-submenu");
      if (!sub) break;
      sub.classList.add("open");
      var parentItem = sub.closest(".has-submenu");
      if (parentItem) {
        parentItem.classList.add("expanded");
        el = parentItem.parentElement; // lanjut ke level atas
      } else {
        break;
      }
    }
  }

  // 3. Cari sidebar-link biasa (non-submenu parent) yang cocok
  document.querySelectorAll(".sidebar-nav > ul > li:not(.has-submenu) .sidebar-link").forEach(function (link) {
    if (matchPath(link.getAttribute("href"))) {
      link.classList.add("active");
      link.closest("li").classList.add("active"); // trigger .line-active
    }
  });

  // ============================================================
  // Breadcrumb Dinamis dari Sidebar
  // ============================================================

  (function buildBreadcrumb() {
    var el = document.getElementById("breadcrumb");
    if (!el) return;

    // Helper: ambil label dari link
    function getLabel(link) {
      var span = link.querySelector("span");
      return span ? span.textContent.trim() : link.textContent.trim();
    }

    var trail = [];

    // 1. Cari submenu-link yang cocok dengan URL skrg
    document.querySelectorAll(".submenu-link").forEach(function (link) {
      if (matchPath(link.getAttribute("href"))) {
        trail.push(getLabel(link));
        // Walk up parent chain
        var cur = link.closest(".has-submenu");
        while (cur) {
          var pl = cur.querySelector(":scope > .sidebar-link");
          if (pl) trail.unshift(getLabel(pl));
          cur = cur.parentElement?.closest(".has-submenu");
        }
      }
    });

    // 2. Kalo ga ada submenu, cari sidebar-link biasa
    if (trail.length === 0) {
      document.querySelectorAll(".sidebar-link").forEach(function (link) {
        if (!link.hasAttribute("data-toggle") && matchPath(link.getAttribute("href"))) {
          trail.push(getLabel(link));
        }
      });
    }

    // 3. Fallback: page title
    if (trail.length === 0) {
      var title = document.querySelector(".dash-page-title");
      if (title) trail.push(title.textContent.trim());
    }

    // Render: item terakhir merah (breadcrumb-active), sisanya abu
    var html = "";
    for (var i = 0; i < trail.length; i++) {
      if (i > 0) html += " / ";
      if (i === trail.length - 1) {
        html += '<span class="breadcrumb-active">' + escapeHtml(trail[i]) + "</span>";
      } else {
        html += escapeHtml(trail[i]);
      }
    }
    el.innerHTML = html;
  })();

  // Helper: escape HTML biar aman
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Aktifin transisi lagi setelah semua setup selesai
  requestAnimationFrame(function () {
    document.body.classList.remove("preload");
  });
});
