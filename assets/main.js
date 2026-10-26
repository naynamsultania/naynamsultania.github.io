'use strict';
(() => {
  const config = window.PORTFOLIO || { projects: [], certificates: [] };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const safeURL = (value) => {
    if (!value) return '';
    try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const link = (label, url) => {
    const a = el('a', label + ' ↗', 'text-link');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
  };
  let toastTimer;
  const toast = (message) => {
    const node = $('.toast'); node.textContent = message; node.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('visible'), 3200);
  };
  $$('[data-year]').forEach(n => n.textContent = new Date().getFullYear());

  const themeButton = $('.theme-toggle');
  const updateThemeLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    $('meta[name="theme-color"]').content = dark ? '#101620' : '#f8f9fc';
  };
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; storage.set('nks-theme', next); updateThemeLabel();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!storage.get('nks-theme')) { document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'; updateThemeLabel(); }
  });
  const menuButton = $('.menu-toggle'), nav = $('#main-nav');
  const closeMenu = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open menu'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  window.matchMedia('(min-width: 1041px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    $$('.reveal').forEach(node => observer.observe(node));
  }

  const projectGrid = $('#project-grid');
  if (projectGrid) {
    const projects = Array.isArray(config.projects) ? config.projects : [];
    const render = (category) => {
      const list = projects.filter(project => category === 'all' || project.category === category);
      projectGrid.replaceChildren();
      $('#project-count').textContent = `${list.length} project${list.length === 1 ? '' : 's'}`;
      $('#project-empty').hidden = list.length > 0;
      const label = ({web:'web',python:'Python',cpp:'C++'})[category];
      $('#project-empty-title').textContent = category === 'all' ? 'Every project starts with a little curiosity.' : `${label} projects are on the horizon.`;
      $('#project-empty-copy').textContent = projects.length && !list.length ? 'No projects in this category yet. Try another filter to explore the collection.' : 'I haven’t added any projects here yet. As I build and experiment, this is where I’ll share what I make and what I learn.';
      list.forEach(project => {
        const card = el('article', undefined, 'project-card');
        card.append(el('span', ({web:'WEB DEVELOPMENT',python:'PYTHON',cpp:'C++'})[project.category] || 'PROJECT', 'eyebrow'));
        card.append(el('h2', project.title), el('p', project.description));
        const tags = el('div',undefined,'tags');
        (project.tags || []).forEach(tag => tags.append(el('span',tag))); card.append(tags);
        const links = el('div',undefined,'project-links');
        if (safeURL(project.url)) links.append(link('View project', safeURL(project.url)));
        if (safeURL(project.source)) links.append(link('Source code', safeURL(project.source)));
        if (links.children.length) card.append(links);
        projectGrid.append(card);
      });
    };
    $$('.filter').forEach(button => button.addEventListener('click', () => {
      $$('.filter').forEach(b => { b.classList.toggle('active',b === button); b.setAttribute('aria-pressed',String(b === button)); });
      render(button.dataset.filter);
    })); render('all');
  }

  const certificateGrid = $('#certificate-grid');
  if (certificateGrid) {
    const certificates = Array.isArray(config.certificates) ? config.certificates : [];
    $('#certificate-count').textContent = `${certificates.length} certificate${certificates.length === 1 ? '' : 's'}`;
    $('#certificate-empty').hidden = certificates.length > 0;
    const dialog = $('#certificate-dialog');
    $('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
    certificates.forEach(certificate => {
      const card = el('article',undefined,'certificate-card'), button = el('button'); button.type='button';
      const imageURL = safeURL(certificate.image);
      if (imageURL) { const img=el('img'); img.src=imageURL; img.alt=certificate.title; img.loading='lazy'; button.append(img); }
      button.append(el('h2',certificate.title),el('p',[certificate.issuer,certificate.date].filter(Boolean).join(' · ')),el('span','View certificate ↗','text-link'));
      button.addEventListener('click', () => {
        $('#certificate-title').textContent=certificate.title;
        $('#certificate-image').hidden=!imageURL;
        if(imageURL) { $('#certificate-image').src=imageURL; $('#certificate-image').alt=certificate.title; }
        $('#certificate-details').textContent=[certificate.issuer,certificate.date].filter(Boolean).join(' · ');
        const credentialURL=safeURL(certificate.credentialURL); $('#certificate-verify').hidden=!credentialURL;
        if(credentialURL) $('#certificate-verify').href=credentialURL;
        dialog.showModal();
      }); card.append(button); certificateGrid.append(card);
    });
  }

  const copy = async (text) => {
    if (!navigator.clipboard || !window.isSecureContext) return false;
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  };
  $('.copy-email')?.addEventListener('click', async () => {
    if (await copy(config.email)) toast('Email address copied');
    else toast('Select the email address above to copy it.');
  });
  const form=$('#contact-form');
  if(form) {
    const status=$('.form-status');
    const draft=() => {
      const fields=new FormData(form);
      const subject=String(fields.get('subject')).trim();
      const body=`Hi Naynam,\n\n${String(fields.get('message')).trim()}\n\nFrom: ${String(fields.get('name')).trim()}\nReply to: ${String(fields.get('email')).trim()}`;
      return {subject,body};
    };
    const valid=() => {
      for(const input of form.querySelectorAll('input, textarea:not([readonly])')) {
        const value=input.value.trim();
        input.setCustomValidity(!value ? 'Please fill out this field.' : input.id === 'message' && value.length < 10 ? 'Please write at least 10 characters.' : '');
      }
      return form.reportValidity();
    };
    form.addEventListener('input',event=> { if(typeof event.target.setCustomValidity==='function') event.target.setCustomValidity(''); });
    form.addEventListener('submit',event=> {
      event.preventDefault(); if(!valid()) return;
      const {subject,body}=draft();
      const url=`mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if(url.length>7000) { status.textContent='This message is long. Use “Copy message instead” and paste it into your email app.'; return; }
      window.location.href=url;
      status.textContent='Your draft is ready to open in your email app. Nothing has been sent by this website. If no app opened, copy your message below.';
    });
    $('.copy-message').addEventListener('click',async()=> {
      if(!valid()) return;
      const {subject,body}=draft(), text=`To: ${config.email}\nSubject: ${subject}\n\n${body}`;
      if(await copy(text)) { status.textContent='Message copied. Paste it into your email app when you’re ready.'; toast('Message copied'); }
      else { $('.copy-fallback').hidden=false; $('#copy-text').value=text; $('#copy-text').focus(); $('#copy-text').select(); status.textContent='Select and copy the draft below, then paste it into your email app.'; }
    });
  }

  if(safeURL(config.githubUrl)) {
    const github=link('GitHub',safeURL(config.githubUrl)); github.className='footer-email'; $('.footer-top').append(github);
  }
  // No requests are made unless a real measurement ID is configured and the visitor opts in.
  const analyticsID = /^G-[A-Z0-9]+$/.test(config.googleAnalyticsId || '') ? config.googleAnalyticsId : '';
  if(analyticsID) {
    const banner=$('.analytics-consent');
    const start=()=> {
      if(window.nksAnalyticsStarted) return;
      window.nksAnalyticsStarted=true; window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer.push(arguments);};
      window.gtag('js',new Date());
      window.gtag('config',analyticsID,{allow_google_signals:false,allow_ad_personalization_signals:false});
      const script=document.createElement('script'); script.async=true; script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsID)}`; document.head.append(script);
    };
    const consent=storage.get('nks-analytics');
    if(consent==='accepted') start(); else if(consent!=='declined') banner.hidden=false;
    $$('[data-consent]').forEach(button=>button.addEventListener('click',()=> {
      storage.set('nks-analytics',button.dataset.consent); banner.hidden=true;
      if(button.dataset.consent==='accepted') start();
      else if(window.nksAnalyticsStarted) { window['ga-disable-'+analyticsID]=true; location.reload(); }
    }));
    if($('#analytics-description')) {
      $('#analytics-description').textContent='Google Analytics is configured to measure page visits after you choose to allow it. It may use cookies and device information. Contact-form contents are never sent to analytics. You can change your choice below.';
      $('.analytics-settings').hidden=false;
      $('.analytics-settings').addEventListener('click',()=> { banner.hidden=false; banner.querySelector('button').focus(); });
    }
  }
})();
