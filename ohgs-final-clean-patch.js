(function(){
  var lastY = Math.max(window.scrollY||0, document.documentElement.scrollTop||0, document.body.scrollTop||0);
  var mode = lastY > 4 ? "compact" : "expanded";
  var notifyEndpoint = "/api/notify";

  function yNow(){
    var d=document.documentElement,b=document.body,s=document.scrollingElement;
    return Math.max(window.scrollY||0,window.pageYOffset||0,d.scrollTop||0,b.scrollTop||0,s?s.scrollTop||0:0);
  }
  function setHeaderMode(nextMode){
    mode = nextMode || mode;
    var compact = mode === "compact";
    document.body.classList.toggle("ohgs-header-compact", compact);
    document.body.classList.toggle("ohgs-header-expanded", !compact);
  }
  function updateHeader(){
    var y = yNow();
    if(y <= 3) setHeaderMode("expanded");
    else if(y > lastY + 2) setHeaderMode("compact");
    else if(y < lastY - 2) setHeaderMode("expanded");
    lastY = y;
  }
  function fixThemeButton(){
    document.querySelectorAll(".theme-toggle").forEach(function(btn){
      if(btn.dataset.ohgsThemeReady) return;
      btn.dataset.ohgsThemeReady = "1";
      btn.textContent = "";
      btn.setAttribute("aria-label","Toggle dark and light mode");
      btn.setAttribute("title","Dark / Light mode");
      btn.addEventListener("click",function(e){
        e.preventDefault();
        document.body.classList.toggle("light");
        document.documentElement.classList.toggle("light");
        try{localStorage.setItem("ohgsTheme",document.body.classList.contains("light")?"light":"dark");}catch(_){}
      });
    });
  }
  function showToast(text){
    var el=document.querySelector(".ohgs-notify-toast");
    if(!el){el=document.createElement("div");el.className="ohgs-notify-toast";document.body.appendChild(el);}
    el.textContent=text;el.classList.add("show");clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove("show");},3000);
  }
  function notify(payload,silent){
    payload=payload||{};payload.page=location.href;payload.userAgent=navigator.userAgent;payload.time=new Date().toISOString();
    return fetch(notifyEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
      .then(function(r){if(!r.ok)throw new Error("Notification not configured");return r.json();})
      .then(function(){if(!silent)showToast("Notification sent to owner.");})
      .catch(function(err){console.warn("OHGS notification:",err.message);if(!silent)showToast("Action opened. Email works after Vercel SMTP setup.");});
  }
  function bindNotifications(){
    if(!sessionStorage.getItem("ohgsVisitNotified")){sessionStorage.setItem("ohgsVisitNotified","1");notify({eventType:"Website Visit",action:"Visitor opened website"},true);}
    document.querySelectorAll("a[href*='wa.me'],a[href*='whatsapp']").forEach(function(a){
      if(a.dataset.ohgsNotifyBound)return;a.dataset.ohgsNotifyBound="1";
      a.addEventListener("click",function(){notify({eventType:"WhatsApp / Order Click",action:a.textContent.trim()||"WhatsApp clicked",product:a.dataset.product||document.title},true);});
    });
    document.querySelectorAll("a[href^='tel:']").forEach(function(a){
      if(a.dataset.ohgsNotifyBound)return;a.dataset.ohgsNotifyBound="1";
      a.addEventListener("click",function(){notify({eventType:"Phone Call Click",action:"Visitor clicked call button",phone:a.getAttribute("href").replace("tel:","")},true);});
    });
    document.querySelectorAll("form").forEach(function(form){
      if(form.dataset.ohgsNotifyBound)return;form.dataset.ohgsNotifyBound="1";
      form.addEventListener("submit",function(e){
        e.preventDefault();
        var obj={};Array.prototype.slice.call(form.elements||[]).forEach(function(el){if(el.name)obj[el.name]=el.value||"";});
        notify({eventType:"Website Form / Order Inquiry",action:"Visitor submitted form",name:obj.name||obj.fullname||"",phone:obj.phone||obj.mobile||"",email:obj.email||"",product:obj.product||obj.subject||document.title,message:obj.message||obj.notes||JSON.stringify(obj)}).then(function(){form.reset();});
      });
    });
  }
  function init(){setHeaderMode(mode);updateHeader();fixThemeButton();bindNotifications();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
  ["scroll","wheel","touchmove","pointermove","resize","orientationchange","load","pageshow"].forEach(function(ev){window.addEventListener(ev,updateHeader,{passive:true});});
})();
