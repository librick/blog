---
title: "Goodbye Gatsby, Hello Hugo"
description: "Migrating the blog from Gatsby to Hugo"
date: 2023-05-30
tags: ['blog', 'cicd', 'nodejs', 'hugo', 'gatsby']
---
![Hugo](hugo-logo-wide.svg "Switching to Hugo from Gatsby")
# I Switched to Hugo
This blog used to use Gatsby. Now it uses Hugo.

## What I like about Hugo
### Themes
Hugo has an open ecosystem of really well-written and maintained themes.
At the time of writing, I'm using [paper](https://github.com/nanxiaobei/hugo-paper).
I also like the model of overriding theme files by creating files in the `static` and `assets` directories.
For the most part, I find this model of extensibility is intuitive. The paper theme also uses Tailwind CSS, and I like that I can use Tailwind classes out-of-the-box.

I also like that theme source code is easily accessible. Because themes are installed to the `themes` directory within the project's root directory, I can view theme source code easily and extend it quickly.

### Tags
I like that the paper theme has support for tags out-of-the-box. I've been using tags with Obsidian, my current preferred note-taking app.

It could be argued that tags are limited in their use as generic search optimization; that tags represent a form of manual search engine "hinting" which is unncessary in light of better (i.e., automatic) statistical analysis. If ChatGPT can summarize an article, why use tags?
I think tags serve a useful purpose by grouping content. I like that Hugo makes it easy to use tags.

### Go and Go Modules
Because Hugo is written in Go, I can leverage the Go ecosystem. I like working with Go modules far more than working with NPM packages.
I think Go module versioning is much more intuitive, and I appreciate how Go couples module versioning with git repos. I anticipate that this will make updating a Hugo-based blog easier than updating a Gatsby-based blog.

### Speed
Hugo is fast. I like that I can make a change or change my `hugo.toml` config file and see local changes almost instantaneously.
Speed is a big benefit when it comes to hosting.

## What I liked about Gatsby

### Gatsby Plugins
Gatsby's plugin ecosystem is fairly robust. I enjoyed being able to quickly add plugins for reading time estimation, RSS support, and static image optimization, among others. For the most part, Gatsby plugins were plug-and-play, or required only minor configuration.

### Gatsby Builds and Hosting
Gatsby's hosting for my site was free. My blog expenses consisted of my time and DNS leases.
I didn't use any analytics, dedicated content management system (CMS), or comment system (such as Disqus).
I can't complain about the free hosting model for individual use.

Gatsby's CI/CD pipeline was, for the most part, easy to set up and use.
While I eventually encountered timeout errors (apparently due to timeouts while processing images),
I liked that I could simply commit to main and see updates online in minutes.

## What I didn't like about Gatsby
### Node.js and Updates
Most of the issues I had with Gatsby were issues with NPM packages and Node.js.
Updating was a pain. I was never sure whether to update Node.js/npm versions, Gatbsy versions, or Gatsby plugin versions.

Ideally I would have run `npm update` or `yarn update` and everything would sort itself out, but I increasingly encountered package conflicts. At times I resorted to rebuilding the site and copy-pasting existing articles over when a new major version of Gatsby was released.   

### Broken Gatsby Builds and Auto-Deployment
Gatsby's auto-deployment through GitHub worked well… until it didn't. I used Gatsby for several months without issue. But then I ran into issues with builds timing out on Gatsby's web interface, apparently due to image processing taking a long time (I had enabled some plugins for static image optimization).

While the occasionally failing build was annoying, the biggest issue was that, because the CI/CD pipeline was largely managed by Gatsby internally, I had limited visibility when things went wrong. Upgrading my Gatsby hosting plan to a paid option with more resources (i.e., less-strict resource hardware limits) may have solved some of these intermittent build issues, but I didn't want to be locked into Gatsby's paid hosting model.

### Free-Hosting with a Paid CMS
I also considered migrating my Markdown and image files to a dedicated CMS. I though that if I had a CMS that was responsible for image hosting, the Gatby build process would be faster and less error-prone. As with upgrading Gatsby to a paid option, however, I decided to avoid this route to avoid vendor lock-in and keep expenses down.

## Opportunity Cost
The opportunity cost of learning Hugo probably outweighed the hosting costs of a paid tier of Gatsby and a dedicated CMS combined for some large number of months. I like playing with Hugo.

To Gatsby and Hugo's credit, this transition has been fast; I was able to port most of this blog over to Hugo within a day. But if a business client had a perfectly-working Gatsby blog, I don't think I would recommend they switch to Hugo, ignoring any extenuating circumstances. If it ain't broke, don't fix it.

## Conclusion
If you're looking for a developer-friendly blog framework, I recommend Hugo over Gatsby. But they're both excellent tools and get the job done.
