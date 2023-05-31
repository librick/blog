---
title: Bi-Directional Authentication with TOTP
date: "2023-01-21T00:00:00.000Z"
description: "Authentication is a two-way street."
tags: ['mfa', 'security', 'totp', 'cryptography']
---

![Mengenlehreuhr](berlin-clock.jpg "Mengenlehreuhr, Berlin")
Image sourced from [Wikimedia](https://commons.wikimedia.org/wiki/File:Berlin_-_Mengenlehreuhr_am_Europa-Center.jpg),
attributed according to the Creative Commons Attribution 2.0 Generic license.

## Motivation
Time-Based One Time Password (TOTP) authentication is extremely beneficial.
It lets you quickly add two&#8209;factor authentication (2FA) to online accounts according
to a simple and open standard. Simply scan a QR code into a TOTP app like [Aegis](https://github.com/beemdevelopment/Aegis).
As long as you have access to your phone, you can then use the TOTP app to generate 2FA codes whenever need be.
No risk of [simswapping](https://en.wikipedia.org/wiki/SIM_swap_scam), no need for SMS reception or a phone number, and no need for proprietary 2FA apps.

**But TOTP as it's currently widely implemented has a shortcoming; it doesn't prevent phishing attacks.**
Click a link in an email that redirects to a phishing website; the phishing website mimics one of your favorite websites.
You think it's the legitimate website, so you enter your username, password, and TOTP code.
The attacker behind the phishing website now has everything they need to sign in to the legitimate website on your behalf without your consent.
Even though you have TOTP&#8209;based 2FA enabled, you can still be phished.

## The Problem  
The problem in the above scenario is that authentication is only actually being done one way.
Existing TOTP implementations allow users to authenticate to websites (think "I'm the website google.com, is this person really John Smith?").
Existing TOTP implementations *don't* authenticate websites to users (think "I'm John Smith, is this website really google.com?").

## Bi-Directional Alternative
Imagine the scenario where, in addition to asking you for your TOTP code (let's call this `z`), a website also provided you with its own TOTP code (let's call this `z'`).
Within your authenticator app, you'd select the desired website from a list of stored websites.
But rather than being shown a TOTP code right away (`z`), you'd be prompted for the TOTP code provided from the website (`z'`).

If the website is a phishing website, they can't produce valid TOTP codes `z` or `z'`.
Your authenticator app would check that the TOTP code provided by the website (`z'`) is valid.
The legitimate website would check that the TOTP code provided by your authenticator app (`z`) is valid.

If the code `z'` is NOT valid, the authenticator app knows something is wrong, and would show a large error message indicating that you may be interacting with a phishing website.
At this point, you could change your password on the legitimate site and report the phishing attempt.

If the code `z'` is valid, the authenticator app would provide you with the usual TOTP code `z` and you would sign in as usual.
If the code `z'` is NOT valid, the authenticator app would never provide you with the TOTP code required by the legitimate website.

## Bi-Directional Authentication in the RFC
I mused over this for long enough that I exhausted the TOTP and HOTP Wikipedia articles and went on to read the RFCs.
There are (at least) two main standards related to TOTP.
[RFC 4226](https://datatracker.ietf.org/doc/html/rfc4226) defines a more generic HMAC&#8209;Based OTP algorithm (HOTP).
[RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) defines the TOTP algorithm based on the HOTP algorithm.
On page 14 of [RFC 4226](https://datatracker.ietf.org/doc/html/rfc4226), I found this gem:

>Interestingly enough, the HOTP client could also be used to  
>authenticate the validation server, claiming that it is a genuine  
>entity knowing the shared secret.
>
>Since the HOTP client and the server are synchronized and share the  
> same secret (or a method to recompute it), a simple 3-pass protocol  
> could be put in place:  
> 1- The end user enter the TokenID and a first OTP value OTP1;  
> 2- The server checks OTP1 and if correct, sends back OTP2;  
> 3- The end user checks OTP2 using his HOTP device and if correct,  
>    uses the web site.

In other words, the writers of the HOTP RFC considered this as a possibility but nothing (as far as I know) ever came of it.

## Implementation Ideas
I've come up with two back-of-the-envelope implementation ideas that seem like they'd work given minimal extension of the existing RFCs.

### The Straightforward Way - Generate Two Keys
The most straightforward way (in my opinion) to implement bi&#8209;directional TOTP would be to generate two shared keys on a website for each new 2FA enrollment.
Call these keys $$k, k'$$
- `k` would be used for (the usual) user&#8209;to&#8209;website authentication
- `k'` would be used for (the new) website&#8209;to&#8209;user authentication

One drawback to this approach is that it includes the network transmission of `k'` during enrollment.
Further, this requires storing `k'` for every 2FA enrollment, increasing storage costs.

### The Simple(?) Way - Key Derivation
Rather than generate a new key `k'` just for website-to-client authentication, it could be derived from `K`.
For example, implementations could use a [key derivation function](https://en.wikipedia.org/wiki/Key_derivation_function)
such as Argon2 or PBKDF2, taking as inputs `K` and some salt which is fixed for the protocol.

The biggest advantages to this approach is that it negates the need for network transmission of `k'` upon enrollment.
It also allows for finer-grained time/value tradeoffs to be made regarding when `k'` is derived and stored.
The drawback is added complexity and an increased implementation attack surface.

## Conclusion
Bi&#8209;directional authentication is only mentioned in the HOTP RFC, not the TOTP RFC.
Neither RFC 4226 nor 6238 include the word "phishing" and they were published in 2005 and 2011, respectively.
I would argue that, given that phishing attacks are still prevalent in 2023, we should revisit bi&#8209;directional authentication in TOTP.
I'd love to see a pull request to support this in one of the major open source TOTP implementations.

## Appendix: Accessibility
TOTP limits accessibility by using short timeouts (30 seconds by default).
Adding a second code implies a twofold increase in the amount of time required by a user to authenticate to a service.
Further, TOTP codes aren't intuitive to a non-technical audience. In my opinion, this is evidenced by a lack of wider adoption. Adding a second code to the mix only increases the potential for confusion.

I understand the absence of a widely-implemented bi-directional TOTP standard in light of these constraints.


## Appendix: Phishing vs TOTP Timeouts
Technically, because TOTP codes expire (by default) in 30 seconds,
any phishing attack would have to prompt the user for their TOTP code, receive the response, and have it accepted by the legitimate website
on behalf of the attacker within 30 seconds.

In practice, I don't see this as a limiting factor in most phishing attacks.
Also, specific TOTP code expiration times are an implementation detail;
I don't think they should be relied upon to prevent phishing attacks.
