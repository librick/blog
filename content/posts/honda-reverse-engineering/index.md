---
title: Honda Civic Reverse Engineering
date: "2023-05-31T00:00:00.000Z"
description: "Reverse engineering a 2021 Honda Civic and thoughts on the state of automotive security."
tags: ['security', 'cryptography', 'android', 'honda', 'reverseengineering']
---

# Introduction
Last week, I published a GitHub repo containing reverse engineering information for the
head unit of my car, a 2021 Honda Civic: https://github.com/librick/ic1101/.

I decided to attempt to reverse engineer the head unit for several reasons.
I wanted to audit the security of my car, I wanted to gain insights into the state of software development and security in the automotive
industry, I wanted to extend the functionality of my head unit, and I wanted to play around.

This article isn't comprehensive and is barely cohesive; in attempting to discuss technical topics alongside socioeconomic and legal topics,
I've probably fallen short on all counts. I hope it promotes discussion.

## Android Tablets, Rooting, and Ecosystems
The head unit of my car is basically a glorified Android tablet.
I used a paid service called [Honda Hack](https://www.autohack.org/) to root my head unit for $25.
Apparently, you pay to access a web server which most likely serves a webkit exploit.
I assume this is then chained with other Android exploits to achieve root. More on this later.

I decided to publish my reverse engineering research for several additional reasons.
I want to contribute to an open source ecosystem around Honda vehicles. I want open source, free-to-use tools and exploits/payloads to root Honda head units (similar to the open source ecosystems surrounding video game consoles), so that people like me in the future don't have to pay someone to get full access to their own hardware.

I want newer versions of Android to be ported to the head unit (the head unit runs a version of Android from 2012). I want security updates; my car is my daily driver, I want its software to be secure, stable, and reliable.

I want to create an ecosystem in which people collaborate and release new applications for the head unit, or enable users to install different operating systems entirely. I think that cars are underappreciated in their potential to act as ruggedized, generic compute nodes. My car is always close by, why not integrate it more into my digital ecosystem? I also just want to gain a deeper understanding of embedded Linux, Android, and automotive software engineering because I find it interesting.

To that end, the source of truth for this project is GitHub repo: https://github.com/librick/ic1101/.
This post will probably contain excerpts and repeated info from that repo. Consider this article as an introduction and pointer to the repo.

## Limited Documentation and Public Safety
Honda is shipping new cars (as of 2021) with software from 2012.
The 2021 Honda Civic is based on an NVIDIA Tegra 3 SoC, which has little to no publicly-available documentation. In particular, there is very little information on NVIDIA kernel modules and ioctl calls, and no publicly-available documentation on native C libraries and binaries included in the head unit.

Honda Motor Co., Ltd. is putting cars on the road that are black boxes. This is the status quo in the automotive industry. While there are standards for some interfaces such as ODB-II, CAN, and well-documented technical requirements for specific areas of government regulation (e.g., emissions tests), my research shows that cars are still largely closed source ecosystems.

If I can't read the source code of my car, I don't trust it. More importantly, if other people (including security researchers and engineers) can't read the source code of my car, I don't trust it. I risk a speeding ticket if I go even a few miles over the posted limit on a public freeway. Yet companies including Honda are allowed to put cars on the road with outdated software, minimal security guarantees, and evidently insufficient oversight. My 2021 Honda Civic weighs over a metric ton. It can travel up to 126mph. And I'm supposed to take Honda at their word when they say that their software is secure, respects my privacy, and ensures my safety.

## Radios, Modems, and Stagefright
It could be argued that, because the head unit doesn't have a cellular data connection, it's secure. This is a false assumption.
Cellular data is only one interface out of many others. The head unit supports Bluetooth, Wi-Fi, CAN, XM radio, and HD radio. Each of these are complex protocols involving lots of code and large attack surfaces.

Last year, some Mazda cars were accidentally bricked by a radio station broadcast omitting file extensions: https://arstechnica.com/cars/2022/02/radio-station-snafu-in-seattle-bricks-some-mazda-infotainment-systems/. That was an accident, not the work of a malicious actor. It demonstrates that cars are increasingly complex, and increasingly vulnerable to exploits.

Consider Stagefright bugs. As I understand it, although it was published in 2015, [it affected several earlier Android versions, including 4.2.2](https://en.wikipedia.org/wiki/Stagefright_(bug)). As far as I know, my car's head unit has never been patched against Stagefright bugs. All it takes is a bug in one library (such as for HD radio image processing) and a widely-published exploit for something like this to be a big problem. I'm pretty sure the head unit is vulnerable to Stagefright exploits c. 2014, a host of webkit exploits, and a plethora of the several other Linux/Android exploits that surfaced between the launch of Android Jellybean 4.2.2 and when I bought my car. The same exploits that allow me to root the head unit are likely available to bad actors.

## Security Issues are Public Safety Issues
Consider recent news involving teenagers breaking into Kia cars. Teenagers break into random stranger's Kias and go on joyrides. Then local news channels and police sensationalize Kia car break-ins or vilify bored teenagers. It seems like very few people actually demand recalls by Kia. A car that can be unlocked in the span of a TikTok video is a dangerous car; it's a public safety issue.

Honda Civic are shipping with a host of known Linux and Android vulnerabilities.
From what I can tell, the head unit does not have direct access to the engine control unit (ECU) or other safety-critical functions.
But an attacker with access to a car's speakers and central display could still probably cause mayhem to unsuspecting drivers.
Imagine having to drive a friend to the hospital, but your navigation stops working because a bad actor hijacks your head unit.

## Competition and Regulation
I can't just buy a more privacy-respecting car or a car with better software. Car manufacturers compete on user-facing technology in cars, but car companies also represent massive economies of scale. They require complex supply chains, massive investment, and multinational government support. The free market alone won't bring me a car that respects my digital freedoms. We need open source hardware, open source software, and incentives for automotive companies to build better, safer, more transparent vehicles.

## Project Goals and Thoughts for the Future
To that end, there are few areas where I want to see public collaboration, contributions, and pull requests. Feel free to start a fork:
- **Boot and recovery images from different Honda Civic models and trims**
    - Having access to these would make it easier to develop public-interest exploits, upgrade Android, and boot different Android ROMs or operating systems
- **Open source versions of native/compiled binaries and libraries**
    - These would provide documentation to other developers and lower the barrier to entry for writing Honda-specific code
    - This would make it easier for third-parties to design replacement parts such as backup cameras, making replacement parts cheaper
    - This would make upgrading/flashing newer versions of Android easier, as proprietary binaries are used in the head unit update process
- **Open source exploit chains to root head units**
    - This would allow anyone to root their head unit for free
    - By being open source, these exploit chains/rooting tools would safer and more widely audited than paid third-party rooting services
    - This would also encourage research into specific existing head unit vulnerabilities, creating opportunities to patch them
- **Open-access documentation of CAN IDs and packet formats**
    - Honda vehicles have two CAN networks, F-CAN and B-CAN. They implement some standard CAN messages but otherwise gatekeep proprietary CAN message formats
    - Having publicly-available docs on known CAN messages would make comprehensive diagnostic tools cheaper for third-party mechanics
    - Having cheaper diagnostic tools would make repairs cheaper for consumers
    - Having open-access diagnostics would empower consumers to make educated decisions when taking their vehicles in for repair
- **Support for vehicles beyond the Honda Civic**
    - I started with the Honda Civic because I have it on hand, but the same or similar software is used for several Honda lines
    - There's no reason this project can't encompass cars beyond the Honda Civic
