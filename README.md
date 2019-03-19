# Silky

This project provides a simple interactive web interface to Netflow data managed within a Silk repository.  Currently, no authentication is provided, but this will be added soon.

## Prerequisites

  * The most current version of Node that you can install
  * A matching version of NPM
  * A user account on the repository that has both the ability to query the repository and has been assigned the right to bind to ports < 1025.  Alternatively, you could execute `node` as root.

## Experimenting

To get started, clone this repository into a convenient location on your repository.  Once this is done and you have met the prerequisites above, execute the following commands:

```
cd Silky
npm install --save
npm install -g @angular/cli
ng build --prod
export SILKY_PORT=80
node service.js
```

You are now ready to connect using a web browser of your choice to port 80 on the repository.  The default username and password for Silky is:

> User: admin
> Password: Password1

The password file is a simply text file of the format:

```
username:password:
```

This file must be located in the same directory as the `service.js` file for proper operation.  Obviously, the passwords are not hashed or otherwise protected.

## Disclaimer

We make no representations that this is a "Secure" web application.  The security provided is primarily in the form of preventing access to unauthorized persons via the logon page.  There is *absolutely no input filtering of any kind* on the parameters that are passed back to your repository.  This parameters are handed as strings to a shell.  Obviously, this is very, very bad!  With this in mind, think carefully before you grant someone the ability to access your repository in this way. :)

## Future

The next version of Silky will:

* Operate over TLS
* Provide an FFT analysis of periodic traffic flows in an attempt to identify beaconing activities

![Silky Screenshot](./screenshot.png "Silky Example")

## Copyright 2017-2019, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation and clear attribution and credit for portions copied or otherwise utilized.

