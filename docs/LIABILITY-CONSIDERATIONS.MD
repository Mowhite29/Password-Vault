# Liability Considerations

Though the utmost care has been taken throughout development of this project, with the nature of the application there is ultimately a lot of risk in hosting a demo version. If there were to be a data leak, or a case of data loss then I could be held liable for any resulting damages.

For an application designed to store users private information including their name, email address and credentials to services, it should not be released for use without a risk assessment and more importantly penetration testing to ensure the safety of data at rest, in transit and in use. As this project is meant purely as a portfolio piece/skills demonstration, there is no budget to fund such testing and so the application must minimize the amount of sensitive information it contains.

This section will cover the methods taken to minimize risk of liability.

## Database Wipes

Every 3 hours starting at 00:00 UTC, all users and their data is deleted from the backend. This gives those viewing the site for the intended purpose plenty of time to test all features while significantly limiting the amount of data a determined/illiterate user would be able to store.

## Landing page

Upon first accessing the site, every user is presented with a banner describing the applications purpose, along with warnings about the intended use.

## Header Banner

The site contains a permanent banner at the top of the screen stating **DEMO PROJECT ONLY - DO NOT USE WITH REAL DATA. THIS APPLICATION IS A PORTFOLIO PROJECT TO DEMONSTRATE SKILLS - SEE ABOUT PAGE**
