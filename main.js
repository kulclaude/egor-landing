// =========================================================
// ЕГОР · CLAUDE CODE С НУЛЯ — shared behaviour
// mobile nav, scroll reveals, terminal typing, faq accordion
// =========================================================
(function(){
  "use strict";

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-ready');
  if(reduced){ document.documentElement.classList.add('reduced-motion'); }

  document.addEventListener('DOMContentLoaded', function(){

    /* ---- mobile menu ---- */
    var burger = document.querySelector('.nav-burger');
    var menu = document.querySelector('.mobile-menu');
    if(burger && menu){
      burger.addEventListener('click', function(){
        var open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        document.body.classList.toggle('no-scroll', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          menu.classList.remove('open');
          burger.classList.remove('open');
          document.body.classList.remove('no-scroll');
        });
      });
    }

    /* ---- terminal typing effect ---- */
    document.querySelectorAll('[data-terminal]').forEach(function(term){
      var lines = term.querySelectorAll('.terminal-line');
      if(reduced){
        lines.forEach(function(l){ l.style.opacity = '1'; });
        return;
      }
      var delay = 250;
      lines.forEach(function(line, i){
        setTimeout(function(){
          line.style.transition = 'opacity 0.3s ease';
          line.style.opacity = '1';
          if(i === lines.length - 1){
            var cursor = document.createElement('span');
            cursor.className = 'cursor';
            line.appendChild(document.createTextNode(' '));
            line.appendChild(cursor);
          }
        }, delay);
        delay += 340;
      });
    });

    /* ---- staggered scroll reveal ---- */
    var revealEls = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      var groups = {};
      revealEls.forEach(function(el){
        var group = el.getAttribute('data-stagger-group') || '_default';
        groups[group] = groups[group] || 0;
      });
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var el = entry.target;
            var group = el.getAttribute('data-stagger-group');
            if(group){
              var n = groups[group]++;
              el.style.setProperty('--d', (n * 90) + 'ms');
            }
            el.classList.add('visible');
            io.unobserve(el);
          }
        });
      }, {threshold:0.12});
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('visible'); });
    }

    /* ---- faq accordion ---- */
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if(!q || !a) return;
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(other){
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });

    /* ---- active nav link by pathname ---- */
    var here = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('[data-nav-link]').forEach(function(a){
      var target = a.getAttribute('data-nav-link');
      if(target === here){ a.classList.add('active'); }
    });

    /* ---- page fade-in on load ---- */
    document.body.style.opacity = '0';
    requestAnimationFrame(function(){
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '1';
    });

  });
})();
