# Naynam Kumar Sultania — Portfolio

Personal portfolio of a JEE 2027 aspirant and aspiring software engineer from Raniganj, West Bengal, India.

## Website

This repository is prepared for GitHub Pages at `https://naynamsultania.github.io/`.

- Home, About, Projects, Certificates and Contact pages
- Responsive layouts, light/dark themes and reduced-motion support
- Custom geometric N logo and matching favicon
- Downloadable one-page résumé
- Project filters and certificate-gallery support
- Contact form that prepares an email draft
- SEO metadata, structured data and sitemap

## Run locally

No build step is required. Run `python3 -m http.server 8080` from this folder and open `http://localhost:8080`.

## Edit content

- Edit the HTML pages for introduction, education and skills.
- Update `assets/content.js` to add real projects, certificates and social links.
- Use project categories `web`, `python` or `cpp`.
- Certificate entries support `title`, `issuer`, `date`, `image` and an optional `credentialURL`.
- Replace `assets/Naynam_Kumar_Sultania_Resume.pdf` to update the résumé.
- Styling is in `assets/style.css`; interactions are in `assets/main.js`.

Projects and certificates have intentionally empty collections until work is added. The contact form opens the visitor's email application; it does not send or store messages on a server. Optional Google Analytics remains disabled until a real `googleAnalyticsId` is set in `assets/content.js` and the visitor opts in.

## GitHub Pages setup

In repository **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save. Keep `.nojekyll` in the repository root.

If the hosting URL changes, run `python3 tools/set_site_url.py https://your-actual-host` to update canonical URLs and the sitemap.
