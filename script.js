(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 滚动进度条 & 导航状态 & 返回顶部 ---------- */
  var progress = document.getElementById("progress");
  var nav = document.getElementById("nav");
  var toTop = document.getElementById("toTop");

  function onScroll(){
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    nav.classList.toggle("scrolled", st > 10);
    toTop.classList.toggle("show", st > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function(){
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById("burger");
  var mMenu = document.getElementById("mMenu");
  burger.addEventListener("click", function(){
    var open = mMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mMenu.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      mMenu.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 滚动侦测（Scrollspy） ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var spySections = ["overview","space","scenarios","outcomes"].map(function(id){
    return document.getElementById(id);
  });
  var spyObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        spyLinks.forEach(function(a){
          a.classList.toggle("active", a.getAttribute("data-spy") === entry.target.id);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  spySections.forEach(function(s){ if(s) spyObserver.observe(s); });

  /* ---------- 滚动浮现（带同组错峰延迟） ---------- */
  var rvEls = Array.prototype.slice.call(document.querySelectorAll(".rv"));
  rvEls.forEach(function(el){
    var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children).filter(function(c){
      return c.classList && c.classList.contains("rv");
    }) : [];
    var idx = siblings.indexOf(el);
    if(idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 90 + "ms";
  });
  var rvObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        rvObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  rvEls.forEach(function(el){ rvObserver.observe(el); });

  /* ---------- 数字滚动 ---------- */
  function countUp(el){
    var target = parseInt(el.getAttribute("data-count"), 10);
    if(reduceMotion){ el.textContent = target; return; }
    var start = null, dur = 1200;
    function tick(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  var cObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        countUp(entry.target);
        cObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function(c){ cObserver.observe(c); });

  /* ---------- 六大核心功能：桌面 Tab / 手机纵向卡片流 ---------- */
  var ftabs = document.querySelectorAll(".ftab");
  var fpanels = document.querySelectorAll(".feat-panel");
  var mobileView = window.matchMedia("(max-width: 767px)");

  /* 手机端六张卡全部展开，在卡内补上序号与标题，滚动时也能知道当前功能 */
  fpanels.forEach(function(panel, i){
    if(panel.querySelector(".feat-mobile-title")) return;
    var tab = document.querySelector('.ftab[data-fp="' + panel.getAttribute("data-fp") + '"]');
    if(!tab) return;
    var heading = document.createElement("div");
    heading.className = "feat-mobile-title";
    var title = document.createElement("b");
    title.textContent = tab.textContent.replace(/^\d+/, "");
    var no = document.createElement("span");
    no.textContent = "0" + (i + 1) + " / 06";
    heading.appendChild(title);
    heading.appendChild(no);
    panel.insertBefore(heading, panel.firstChild);
  });

  function setFeatureTab(key){
    ftabs.forEach(function(t){ t.classList.toggle("on", t.getAttribute("data-fp") === key); });
  }

  ftabs.forEach(function(tab){
    tab.addEventListener("click", function(){
      var key = tab.getAttribute("data-fp");
      setFeatureTab(key);
      if(mobileView.matches){
        var target = document.querySelector('.feat-panel[data-fp="' + key + '"]');
        if(target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
      fpanels.forEach(function(p){
        var on = p.getAttribute("data-fp") === key;
        p.classList.toggle("on", on);
        if(on){ /* 重播入场动画 */
          p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
        }
      });
      if(!reduceMotion) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    });
  });

  /* 手机自然下滑时，顶部功能按钮跟随当前卡片更新 */
  var fpObserver = new IntersectionObserver(function(entries){
    if(!mobileView.matches) return;
    entries.forEach(function(entry){
      if(entry.isIntersecting) setFeatureTab(entry.target.getAttribute("data-fp"));
    });
  }, { rootMargin: "-18% 0px -62% 0px", threshold: 0 });
  fpanels.forEach(function(panel){ fpObserver.observe(panel); });

  /* ---------- 教学场景筛选 ---------- */
  var fbtns = document.querySelectorAll(".fbtn");
  var scens = Array.prototype.slice.call(document.querySelectorAll(".scen"));
  fbtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      var f = btn.getAttribute("data-filter");
      fbtns.forEach(function(b){ b.classList.toggle("on", b === btn); });
      var visible = [];
      scens.forEach(function(card){
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hide", !show);
        if(show){ visible.push(card); card.style.animation = "none"; void card.offsetWidth; card.style.animation = "fadeUp .45s ease both"; }
      });
      /* 筛选后只剩一张卡时占满整行，避免半行孤卡 */
      visible.forEach(function(c){ c.classList.remove("wide"); });
      if(visible.length === 1) visible[0].classList.add("wide");
      if(mobileView.matches && visible[0]){
        visible[0].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* ---------- 体验式学习循环：自动轮转 + 点击跳转 ---------- */
  var cycle = document.getElementById("cycle");
  if(cycle){
    var nodes = cycle.querySelectorAll(".cycle-node");
    var cur = 0, timer = null, hovered = false;
    function setActive(i){
      cur = i;
      nodes.forEach(function(n, k){ n.classList.toggle("on", k === i); });
    }
    nodes.forEach(function(n, i){
      n.addEventListener("click", function(){ setActive(i); restart(); });
      n.addEventListener("mouseenter", function(){ hovered = true; });
      n.addEventListener("mouseleave", function(){ hovered = false; });
    });
    function restart(){
      if(timer) clearInterval(timer);
      if(!reduceMotion){
        timer = setInterval(function(){
          if(!hovered) setActive((cur + 1) % nodes.length);
        }, 2600);
      }
    }
    restart();
  }
})();
