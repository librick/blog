---
title: "SSH Fingerprints, Identicons, and AI Face Generation"
date: 2023-09-23
tags: ['identicon', 'ssh', 'ai', 'dall-e', 'fingerprint']
---

While playing around with SSH and Git, I reflected on how SSH's key fingerprints are essentially an early form of identicon:
```
The key fingerprint is:
SHA256:xtaA8biLm/Jktn9A/j2sty686uosrRtz0GQIFw6nP2s root@bionic
The key's randomart image is:
+---[RSA 4096]----+
|o +.  .          |
| B .   =         |
|. o o o o        |
| . +  .o o       |
|  + .o. S .      |
|   + .o+         |
|  E.* .+ o       |
| .oO.+  = =      |
|  oBO++oo*oo     |
+----[SHA256]-----+
```

This made me want to write a blog post about how, now that we have GPU-accelerated terminal emulators[^1]
and a wide variety of identicon libraries[^2], it would be cool to modularize the SSH key fingerprint generation algorithm.
Imagine defining an executable inside your `.ssh/config` file in addition to an existing `VisualHostKey=yes` option that,
when invoked, would take a public key on stdin and produce an image file on stdout to be displayed directly in your terminal
emulator.

I'm not the first person to consider modern SSH fingerprint algorithms. Cipriani[^3] has a thorough article on the subject that
references the original implementation and paper[^4]. Cipriani provides their own implementation using Unicode characters and
colors, but ultimately concludes with a noteworthy point:
>I think the problem of memory persists.
>We’re good at remembering regular pictures, but do abstract pictures count as regular?

This reminded me of something I've thought of before but haven't put into words until now.
We have the ability to generate fake pictures of people[^5][^6], and humans are decent at remembering faces.
At least, from anecdotal evidence, I think I'm more likely to remember a face than an abstract pattern.
You've probably seen Wavatars before[^7], even if you didn't know the name for them at the time.
I assume that Wavatars were and are widely used because they are memorable (and because of an innate human desire to create
things after our likeness). It seems logical that, if we want to make sure SSH keys come from a certain human,
making the key fingerprints themselves look like humans would be useful.

**Imagine an identicon algorithm that generated realistic human faces.
If you saw that identicon on a regular basis, and it suddenly changed, would you notice?**
Is the probability of you noticing greater than if you were to use an existing abstract/geometic identicon algorithm instead?

For lack of effort, I'll refer to these as "AI face identicons".

The main outstanding issues are:
- Developing a face-generation algorithm that is widely-deployable hardware-constrained devices
- Developing a face-generation algorithm that is deterministic and seedable
- Storage/caching of public key fingerprint image data

I leave the rest as an exercise to the reader 😉

References

[^1]: Kitty GPU-based Terminal Emulator (Sep 23, 2023). ["Kitty"](https://sw.kovidgoyal.net/kitty/).
[^2]: drhus/awesome-identicons (Sep 23, 2023) ["awesome-identicons"](https://github.com/drhus/awesome-identicons).
[^3]: SSH Key Fingerprints, Identicons, and ASCII Art (Sep 26, 2017). ["Tyler Cipriani"](https://ikiwiki.tylercipriani.com/blog/2017/09/26/ssh-key-fingerprints-identicons-and-ascii-art/).
[^4]: Hash Visualization: a New Technique to improve Real-World Security ["Hash Visualization: a New Technique to improve Real-World Security"](http://www.netsec.ethz.ch/publications/papers/validation.pdf).
[^5]: This Person Does Not Exist (Sep 23, 2023). ["This Person Does Not Exist"](https://thispersondoesnotexist.com/).
[^6]: Face Generation and Editing with StyleGAN: A Survey. ["Face Generation and Editing with StyleGAN"](https://arxiv.org/pdf/2212.09102.pdf).
[^7]: Wordpress Plugin: Wavatars (Dec 17, 2007). ["Shamus Young"](https://www.shamusyoung.com/twentysidedtale/?p=1462).


