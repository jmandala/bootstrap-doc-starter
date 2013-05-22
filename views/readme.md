<a name="preamble"></a>

# Preamble

NOTE: Documentation is powered by nodejs. Run the doc server like this:

```
node app
```

This purpose of this document is to cover all of the instructions
necessary to build and run MDX.

# Conventions

```
[CODE_ROOT] // refers to the base folder where the code is checked out.
[CONFIG_ROOT] // refers to the parent directory of where the client and developer configurations are checked out.
```

* Examples are given for the Linux platform. Please adjust as appropriate.

# Environment

## Install Java SE JDK (not the JRE).

_Currently installed version as of tested with v.1.6._

1.   Go to the following URL: http://www.oracle.com/technetwork/java/javase/downloads/index.html
2.   Follow the links for downloading the Java SE JDK, click the "I agree" boxes, download and install.
3.   Set the environment variable JAVA_HOME to the path where you installed the JDK.

```bash
$ set | grep JAVA_HOME

> JAVA_HOME=/usr/java/jdk
```

Make jdk a symlink to your most current version of jave (e.g. /usr/java/jdk1.6.0_14). This way you can install new JDKs and just change the symlink rather than updating environment variables.

### Verify Java Version

See if Java is now running and confirm the correct version

```baseh
$ $JAVA_HOME/bin/java -version
java version “1.6.0_14”*
Java SE Runtime Environment _
Java HotSpot™ Client VM (build 14.0-b16, mixed mode, sharing)
```

Install Apache Ant
---------------------

1.   Download: http://ant.apache.org/bindownload.cgi (_min version 1.8.2_)​
2.   Unzip the file and place it wherever is appropriate on your system.
3.   Set the environment variable ANT_HOME to the path where you unzipped ant:

```bash
$ set | grep ANT_HOME
ANT_HOME=/usr/local/ant
```

/usr/local/ant is a symlink to the installed apache-ant bin (e.g. /usr/local/apache-ant-1.8.2).

### Verify Ant Install & Version:

```bash
$ $ANT_HOME/bin/ant -version
Apache Ant version 1.8.2 compiled on December 20 2010
```

Install Git.
---------------

This is necessary for retrieving the source code. http://git-scm.com/download

Follow the appropriate install procedures for your platform.

Update Environment Path
--------------------------

Add $JAVA_HOME/bin and $ANT_HOME/bin to your path. For Linux do this:

```bash
$ echo "nexport PATH=$JAVA_HOME/bin:$ANT_HOME/bin:$PATHn" 
    >> ~/.bash_profile && 
    . ~/.bash_profile
```

Install MySQL
----------------

Only necessary if running database locally. Download and install Community Server Version 5.x http://dev.mysql.com/downloads/mysql/

Follow the appropriate install procedures for your platform.

Create a Keystore
--------------------

The application relies on ssl via https to transmit secure data (e.g.,
login passwords). In order for tomcat to communicate via https, you need
to have a keystore installed on the machine.

```bash
$ $JAVA_HOME/bin/keytool -genkey -alias tomcat -keyalg RSA 
-keystore /path/to/keystore
```

For more details, please see the apache tomcat ssl howto: http://tomcat.apache.org/tomcat-6.0-doc/ssl-howto.html

# Building MDX

## Get Source From Code Repository

If this is the first time you are downloading the source code, clone the
git repositories using the following commands.

```bash
$ git clone code.mandaladesigns.com:/repos/mandala/mdx_pub.git
$ mkdir mdx_config
$ cd mdx_config
$ git clone code.mandaladesigns.com:/repos/mandala/developer_mdx_config.git
$ git clone code.mandaladesigns.com:/repos/[client]/[client]_mdx_config.git
```

[client] is replaced with the client specific config name. For example, "shambhala", as in "shambhala_mdx_config.git"

When you are done, you should have a directory structure that looks something like the following:


```
mdx_config
\-- developer_mdx_config
\-- [client]_mdx_config
mdx_pub
```

_NOTE: The "stable" branch for src contains the latest stable source. The "master" branch contains the latest stable config files.

## Set Required Properties

MDX relies on three special meta properties, `mmm_projectName, mmm_machineName, mmm_instanceName`,
to determine which config files will be used when the src is built. These properties are stored in
a generated file called _ant_build.properties_ located at /src/build.

There is an ant task to change these values to match the project you wish to run.

```bash
$ cd
$ ant -f instance-definitions-build.xml set.[TAB]
```

This will not only set the appropriate meta properties in your
`ant_build.properties` files, but it will also pull the appropriate `rrr*properties` files
from `/developer_mdx_config` and `/[client]_mdx_config` into
`[CODE_ROOT]/src/build` and set them to be read-only so you don’t
attempt to edit them in the wrong place.

IMPORTANT! You can not run any of the ant tasks for the default build.xml file without first creating the
ant_build.properties file.

## Compile
To compile the code, call the compile task on the default build file:

```bash
$ ant compile
```

See the ant build file for other options.

To learn more about these files and how MDX uses them, check the  [Config User Guide](config.html). This will guide you on how to create and modify the different build files and explain how they’re used in the build process.

You can also ready the JavaDoc for `MdxProperty` /src/com/mandaladesigns/mdx/core/MdxProperties.java.

Running In Development
============================

Setup the Database
---------------------

In order to run MDX you’ll need to have access to a running instance of
the database. Backups are performed nightly and are in a format that are
human-readable and easily restorable. To run the database locally, unzip
the backup file and load it into MySQL:

```bash
 $ unzip [backup file.zip]
$ cd backup/mysql
$ mysql -u root--p < [backup file.bak]
```

Start Tomcat
---------------

Start tomcat by calling the startup script:

```bash
$ ant start.tomcat
```

Confirm that tomcat is running by viewing the log file.

```bash
$ less [CODE ROOT]/tomcat/logs/app.log
```

Confirm that there are no exceptions.

Open the site in a browser
-----------------------------

View the app in a browser by browsing to whatever value you used for
“rrr_webappServerName” and “rrr_tomcatHttpPort” in your build files.

Congratulations! You have successfully installed and run MDX!

Deploying MDX
======================

To deploy the code, you’ll need to perform the following steps:


1.  Update the release-notes.txt with a summary of the changes made,
    creating a new tag, if necessary.
2.  Confirm you’ve added a VersionEnum that matches the version in the
    release-notes.txt.
3.  Commit the code. There should be a one-line summary of the commit,
    along with a comment for every file changed. The deploy script will
    prevent you from deploying code that is not committed, even to
    stage.
4.  Merge the changes (you were working on a branch, correct?) back into
    stable.
5.  Tag the commit. You’ll want to create a tag with the same exact code
    as done in the deploy script. You’ll also want to create a separate
    tag for each deploy target. For example:

`$ git tag v3.6.4ga`
`$ git tag shambhala-tomcat1-production-v3.6.4ga`

#_ Push to code to origin:

`$ git push origin stable`

#_ Back up the database. Go to the production database server and run
the backup commands for the environments you wish to backup:

`$ sudo /backup/bin/innertraditions.pl`

#_ Back up the target files. Go to the production app server and tar
up the entire directory tree:

`$ tar -czvf archive/iti-2012.03.28.tgz innertraditions-tomcat1-production/`

#_ Set instance to appropriate server. *You should always deploy to a
staging server first.*

`$ ant -f instance-definitions-build.xml set.[client]-[machine]-[instance]`

#_ Run the ant dist task which will create a copy of the code with the
proper paths/properties.

`$ ant dist`

#_ Run the deploy script

`$ sh [CODE ROOT]/../dist/[client]-[machine]-[instance]/scripts/deploy.sh`

The deploy relies on rsync over ssh. You will need to set up
passwordless logins to each of the servers you wish to deploy to.

NB: You may wish to deploy with the `--code-only` tag, which will stop
the tomcat server, but won’t restart it. This is useful for making db
changes before the app comes up.

Disaster Recovery Checklist
==============================

Use this worksheet to record the location of the file and configuration
settings required to restore MDX in the event of a disaster.

table{border:1px solid black}.
|*.Name|*.Description|_.Location|
|MDX Source Code|Java files and properties required to run MDX|A full
copy of the git source repositories are updated daily via cron and are
stored on the production webserver at `~/backup/src`|
|Database Backups|Recent database dumps|14 days of database backups will
be stored on the production webserver at `~/backup/db`|
|Client Assets|Covers, catalogs, extra website files that are owned by
the client||

# Cron Configuration

## Inner Traditions Cron

```bash
 0 1 * * *
~/innertraditions-tomcat1-production/scripts/cron/crontab-refresh-cache.sh
0 6 * * *~/innertraditions-tomcat1-production/scripts/cron/crontab-batch.sh
25 * * * *
~/innertraditions-tomcat1-production/scripts/cron/crontab-database-cleanup.sh >/dev/null 2>&1
1 30 * * *~/innertraditions-tomcat1-production/scripts/cron/git-fetch-cron.sh

## Shambhala Cron

```bash
 # run the ingest every 30 minutes
0-59/30 * * * *
~/shambhala-tomcat1-production/scripts/cron/crontab-ingest.sh

# Import images every hour
0 * * * *~/import_images.sh > ~/import_images.log 2>&1

# refresh the cache at 5 minutes past the hour
5 * * * *~/shambhala-tomcat1-production/scripts/cron/crontab-refresh-cache.sh

1.  refresh the source repository every day
    1 35 * * *
    ~/shambhala-tomcat1-production/scripts/cron/git-fetch-cron.sh
