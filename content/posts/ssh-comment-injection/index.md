---
title: "SSH Comment Injection in OpenWRT"
date: 2022-09-20
tags: ['security', 'ssh', 'openwrt', 'dropbear', 'openssh', 'fido', 'cryptography']
---
![WRT3200ACM router motherboard](linksys_wrt3200acm_board_top_complete.jpg "WRT3200ACM router motherboard")


OpenWRT is open source router and Wi-Fi access point software. LuCI is the web-based configuration interface for OpenWRT; one of its features is the ability to import SSH keys. Instead of OpenSSH, OpenWRT uses Dropbear, an SSH server implementation optimized for embedded systems[^1].

OpenSSH 8.2, released Feb. 14th, 2020, added support for new FIDO public key types, such as "ecdsa-sk" and "ed25519-sk"[^2]. I wanted to see if Dropbear supported these new key types. It was during this time that I discovered a persistent XSS vector in LuCI.

At the time of publication, OpenWRT LuCI failed to properly sanitize OpenSSH public key comments.
By specifying markdown in the place of an SSH key comment, you could embed scripts within LuCI,
which would be executed upon navigation to the `System -> Administration` settings page.

I emailed Jon from the OpenWRT team; they pushed a patch the next day[^3][^4].
After getting written permission from the OpenWRT (via email), I filed for a CVE.
I was assigned CVE-2022-41435[^5][^6][^7].

SSH comment injection presents a unique attack vector; it has nothing to do with the security of assymetric crypto or the SSH protocol. But it is a source of user-provided input that should be untrusted and properly sanitized.

Thanks to the OpenWRT team for the quick response time, and thanks for contributing to open source ❤️📡

References

[^1]: Dropbear (Nov 14, 2022). ["Dropbear homepage"](https://web.archive.org/web/20230530151641/https://matt.ucc.asn.au/dropbear/dropbear.html). Dropbear. [Archived]() from the original on May 30, 2023. Retrieved May 30, 2023.  
[^2]: OpenSSH (Feb 14, 2020). ["OpenSSH 8.2 release notes"](https://www.openssh.com/txt/release-8.2). OpenSSH. [Archived](https://web.archive.org/web/20230530150006/https://www.openssh.com/txt/release-8.2) from the original on May 30, 2023. Retrieved May 30, 2023.  
[^3]: OpenWRT (May 02, 2023). ["OpenWRT developer guide, security, vulnerability reporting"](https://openwrt.org/docs/guide-developer/security#vulnerability_reporting). OpenWRT. Retrieved May 30, 2023.  
[^4]: GitHub. ["OpenWRT LuCI commit: luci-mod-system: sshkeys.js: prevent XSS through pubkey comments"](https://github.com/openwrt/luci/commit/944b55738e7f9685865d5298248b7fbd7380749e).  
[^5]: MITRE (Sep 26, 2022). ["MITRE CVE-2022-41435"](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-41435). [Archived](https://web.archive.org/web/20230530152700/https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-41435) from the original on May 30, 2023. Retrieved May 30, 2023.  
[^6]: NIST (Nov 04, 2022). ["NIST CVE-2022-41435"](https://nvd.nist.gov/vuln/detail/CVE-2022-41435).  
[^7]: GitHub. ["librick gist, CVE-2022-41435"](https://gist.github.com/librick/eacf19bcfc5ca964e0882b4ef9864bf5). GitHub. [Archived](https://web.archive.org/web/20230530152019/https://gist.github.com/librick/eacf19bcfc5ca964e0882b4ef9864bf5) from the original on May 30, 2023. Retrieved May 30, 2023.
