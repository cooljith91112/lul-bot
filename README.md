<h1 align="center">LULBOT</h1>
<p align="center">
  <img src="assets/logo.png" alt="lul-bot-logo" width="120px" height="120px"/>
  <br>
  <i>A Discord bot written for your server</i>
  <br>
</p>
<hr>

## Documentation
- ```main.js``` is the entry file
- ```commands.config.json``` is the main config file which holds the ```command``` & ```command``` file path.
- ```src/commands``` folder contains all the commands that is configured in ```commands.config.json```. A mandatory method ```execute``` should be implemented, that will be the default execution method while triggerring a command

### Prerequisites
- Install Node.js 12.x or higher
- Install ```nodemon``` (this is for development only)

### Setup
Before running this project you must create a ```.env``` file which should contains the following keys (This can be changed in the source code)
<br>
```
LUL_BOT_TKN=Your_Discord_Bot_token
TENOR_TOKEN=Tenor_token // this used for generating gifs
AIRTABLE_KEY=Airtable_key // this is currently used to store data for my CoD mobile loadouts
```

### Credits
[CodeLyon][codelyon] - For discord.js getting started videos

### Support Me
Support ♥ me via [Ko-Fi][ko-fi]

[ko-fi]: https://ko-fi.com/indrajith
[codelyon]: https://www.youtube.com/c/CodeLyon/
