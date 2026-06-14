---
title: Honda Civics and the Evil Valet
date: "2026-06-13T00:00:00.000Z"
description: "Status update, three years later"
tags: ['security', 'cryptography', 'android', 'honda', 'reverseengineering']
---

Three years ago, I published my initial work to understand and reverse engineer my car, specifically the headunit of my 2021 Honda Civic.[^1]

The initial response was incredibly encouraging. I'm writing to give a project update.

## Keys to the Kingdom

The biggest progress has been made while mapping out the update process.

Honda supports updating the headunit via USB. There are a number of Honda-specific checks, but ultimately the USB drive contains a signed AOSP update file that gets staged and applied via Android recovery. The good news? They left the publicly-known AOSP test key in `res/keys`\*, and, even though they modified the `recovery` binary, the `verify_file` signature logic matches stock AOSP.

So as long as you can properly format a USB drive and sign it with the publicly-known AOSP test key, you can install whatever you want to the headunit, without conventional root access (no need for `su` with `setuid`).
This means that, as long as the headunit has power and an attacker has physical access to the front-most USB port,
they have arbitrary code execution on the headunit via the update path.

This is an evil maid attack. Since it requires physical access to the cabin of the car rather than the hotel room, I call it an evil valet attack. Imagine a journalist drives to a hotel and leaves their car with the valet. The valet, who works for a three-letter agency, installs an update via USB. When the car is returned, the journalist doesn't know the headunit has been modified. Since I want a cool vulnerability name, I'm calling this "EvilValet".

This blog article is not intended as a technical writeup. If you want the gory details, see the technical docs.[^2]

I've also published a new tool, ota-builder[^3], that allows people to easily prepare update files that will be accepted by the headunit. While in its early days, it should be trivial to now build an update file that, for example, installs an `su` binary with `setuid` set (i.e., to root the device).

\*I have strong reason to believe that all updates are signed with the publicly-known AOSP test key, but I don't have access to every possible official update file, nor access to every headunit variant and its filesystem. My headunit has the AOSP test key in `res/keys`, though I've also installed HondaHack, so it's possible that it injected the key into the keystore. However, I've also confirmed that `MRC_EU_SW_v12_4.zip`, a publicly-available EU software update file, is test key signed. This file was downloaded from a public forum[^4] and was never modified by me. So it seems highly likely that all updates are signed with the AOSP test key. Contributors are welcome to help support or refute this hypothesis.

## Building Tools

Beyond the update process, the most useful work has been on apk-rebuilder[^5]. It has one very important job: take in a Honda Civic update file from the Internet, and produce a clean tree of output files that automates everything a reverse engineer would otherwise have to do manually, including:
- Resolving resources
- Reconstructing .smali code
- Repacking APK files
- Extracting the ramdisk
- And more

This also serves an important role because we can't publish actual Honda source code. We publish a function that takes in an update file (that we don't host) and spits out Honda .smali code, image assets, etc. The resulting output follows a clear directory structure that can be referenced in documentation without actually uploading the sensitive files themselves.

## Outstanding Work - A Call for Contributors

There are a few outstanding things that would be nice to have.

### Known Versions

The update process is fragile and relies heavily on version numbers. This doesn't limit the ability to run unsigned code, because the version numbers can be "spoofed" (see the technical docs). But in order to build an update file in the first place you need to know what versions your headunit expects. Further, any changes to the headunit software that don't match my build could lead to unexpected behavior and recovery loops.

If you drive a 10th gen Honda Civic and are tech-savvy, I encourage you to contribute to the "Known Versions, Display Audio Software" section of the repo.[^6]

If you're feeling particularly brave, read through the `ota-builder` code and try and flash an update. But do so at your own risk; if your headunit differs from mine you could get stuck in a recovery loop and softbrick your device.

### Toolchain

I have an experimental/work-in-progress toolchain on my local machine. It takes candidate .c code and compiles it for ARMv7, using the same compiler version and build flags as the original vendor binaries. This proved indispensable in my work to understand the update process. It makes heavy use of Docker. The current iteration is messy and largely specific to my workflow, but I'd like to publish a clean implementation.

### Custom Themes

I explored this a bit while vibe-coding apk-renderer[^7]. Custom themes are likely difficult to ship because they live in Mitsubishi's fork of the AOSP framework,
and the headunit apps are minified to expect hardcoded resource IDs. Any attempt to ship a custom theme would likely involve surgically editing the vendor framework (and writing a tool to do so automatically).
None of this is trivial and probably isn't worth the effort, but I welcome contributors.

### Improve aidl-rebuilder

I started working on a tool to parse .smali files and generate/map out all AIDL interfaces on the headunit. This works but I haven't reviewed it fully for accuracy. This opens up the door for custom apps such as virtual speedometers. Contributors welcome.

## Thoughts on Documentation and LLMs

I've placed less emphasis on reference documentation and more on tooling. The idea is that if I can ship reliable, deterministic tools that map the headunit code to more digestible forms, then people can use LLMs to query those more digestible forms to answer whatever their specific questions are. This avoids having to maintain reference docs that can stray from the actual headunit code, because the headunit code is the source of truth.

For example, a user guide that explains how to connect to the headunit via ADB is still deemed useful. But a document explaining how some Java code works, when the Java code itself is available to an LLM, seems like a maintenance burden.

## Wrapping up and Thanks

At this point, I've done most of the investigative work I intend to do on the headunit.
This is one of those projects that I could toil endlessly on, but I'll likely transition to other projects.
That said, the repo is by no means abandoned. PRs are always welcome.

Special thanks to Tunas[^8] for the memories, and to Hackaday[^9] for covering my original work.

See everyone sometime down the road 🌱

Eric

[^1]: McDonald, E. (2023). ["Honda Reverse Engineering"](https://juniperspring.org/posts/honda-reverse-engineering/). Juniperspring. Retrieved June 13, 2026.
[^2]: McDonald, E. (n.d.). ["Display Audio Update Files"](https://github.com/librick/ic1101/blob/main/docs/updates.md). GitHub. Retrieved June 13, 2026.
[^3]: McDonald, E. (n.d.). ["ota-builder"](https://github.com/librick/ic1101/tree/main/ota-builder). GitHub. Retrieved June 13, 2026.
[^4]: felixlennart (September 22, 2022). ["Install American firmware on European head unit"](https://www.civicx.com/forum/threads/install-american-firmware-on-european-head-unit.78015/page-3). 2016+ Honda Civic Forum (CivicX.com). Retrieved June 13, 2026.
[^5]: McDonald, E. (n.d.). ["apk-rebuilder"](https://github.com/librick/ic1101/tree/main/apk-rebuilder). GitHub. Retrieved June 13, 2026.
[^6]: McDonald, E. (n.d.). ["Known Versions, Display Audio Software"](https://github.com/librick/ic1101/blob/main/docs/updates.md#known-versions-display-audio-software). GitHub. Retrieved June 13, 2026.
[^7]: McDonald, E. (n.d.). ["apk-renderer"](https://github.com/librick/ic1101/tree/main/apk-renderer). GitHub. Retrieved June 13, 2026.
[^8]: Tunas. (n.d.). ["Tunas1337"](https://github.com/Tunas1337). GitHub. Retrieved June 13, 2026.
[^9]: Posch, M. (June 27, 2023). ["Honda Headunit Reverse Engineering, And The Dismal State Of Infotainment Systems"](https://hackaday.com/2023/06/27/honda-headunit-reverse-engineering-and-the-dismal-state-of-infotainment-systems/). Hackaday. Retrieved June 13, 2026.
