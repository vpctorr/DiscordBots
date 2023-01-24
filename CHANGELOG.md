# Changelog

## [1.7.1](https://github.com/vpctorr/DiscordBots/compare/discordbots-v1.7.0...discordbots-v1.7.1) (2023-01-24)


### 👷 Runtime

* add postversion standalone script ([18fd8c2](https://github.com/vpctorr/DiscordBots/commit/18fd8c2d801e54d9d8abcae586495ad2c1da2c06))
* auto versioning ([0d0408e](https://github.com/vpctorr/DiscordBots/commit/0d0408e4baeeda498557ed9bd18786695bf1d3d0))
* convert to npm workspaces ([2dfcac7](https://github.com/vpctorr/DiscordBots/commit/2dfcac7ebd50ce50727fea3df11977b89ae8a6ef))
* finish migrating to npm workspaces ([40f0d14](https://github.com/vpctorr/DiscordBots/commit/40f0d14a8b2c1c74c2ab2541616491c937b18416))
* remove postversion (will use github action) ([bedaa16](https://github.com/vpctorr/DiscordBots/commit/bedaa16ca158f9be273b3e59e24e7445cd196650))
* updated json modules implementation ([fd70b05](https://github.com/vpctorr/DiscordBots/commit/fd70b05d8e5ab7be1e5aec222214b5d86056ea71))


### 📚 Documentation

* fix readme env var name ([eddbacb](https://github.com/vpctorr/DiscordBots/commit/eddbacb93cc4af0da1ee899af8921118c0e6648e))
* **makepdf:** readme reflect new bot id ([d6d339c](https://github.com/vpctorr/DiscordBots/commit/d6d339c0fd70ef17bde7ec2f9033de584501077f))
* updated links & added debug info ([a8673f0](https://github.com/vpctorr/DiscordBots/commit/a8673f02ad0b4ea3123a74a3b05f0e2b84dc4c43))


### ✨ Features

* convert VoiceNotify to discord.js v13 ([#49](https://github.com/vpctorr/DiscordBots/issues/49)) ([f5a9501](https://github.com/vpctorr/DiscordBots/commit/f5a95011a64b84bc5fea6465b242f3da45970c2a))
* debug command ([4affe34](https://github.com/vpctorr/DiscordBots/commit/4affe34ef4fef8b29f354925ced3e1f8057f55f9))
* implemented top.gg http api ([40bbf2c](https://github.com/vpctorr/DiscordBots/commit/40bbf2ce3a99fc5df97e964cf89def4d41738bcf))
* **vn:** clear timeout with debug command ([85bf11c](https://github.com/vpctorr/DiscordBots/commit/85bf11c91f57c9a1224392dfa01bb78d6b3adbdd))
* **voicenotify:** cached settings ([#23](https://github.com/vpctorr/DiscordBots/issues/23)) with settings manager ([a6d98eb](https://github.com/vpctorr/DiscordBots/commit/a6d98ebbb2c9170ff3f6be5d6bd1d4fc92d45d52))
* **voicenotify:** improved antispam timing ([436f0d0](https://github.com/vpctorr/DiscordBots/commit/436f0d03127d3fff286c5fd1838ea9bc7b666dd3))


### 🧹 Refactor

* move bots logic to src ([f9e1620](https://github.com/vpctorr/DiscordBots/commit/f9e1620ccf2a45383cda88010307e37889ee812d))
* switch to esm, updated dependencies ([2dd94a3](https://github.com/vpctorr/DiscordBots/commit/2dd94a35b6922ae88aacbe15f72c2abd078082f6))


### 📦 Chores

* **dev:** release discordbots 1.6.0 ([03c74e2](https://github.com/vpctorr/DiscordBots/commit/03c74e27c3cf07a9cd669c33478b18325ac174b1))
* fix eslint ([cdf0200](https://github.com/vpctorr/DiscordBots/commit/cdf0200264d05428051e1673a40e06fcb410ed5c))
* release dev ([90f64ed](https://github.com/vpctorr/DiscordBots/commit/90f64ed9585eafcb1a4e60bc9dabcc577bcd1839))
* update dependencies ([cc07378](https://github.com/vpctorr/DiscordBots/commit/cc07378303480b4808e58f0bb8da3d63f1c16ff4))
* update dependencies ([b01d669](https://github.com/vpctorr/DiscordBots/commit/b01d6695971908a5c7f2042877d3f1d0cf744152))
* updated dependencies ([fecf6fe](https://github.com/vpctorr/DiscordBots/commit/fecf6fedc92f5cbad7aaa306585266c60b0f3e7e))


### 🔨 Improvements

* add a try/catch block around stats for safety ([3be4fc4](https://github.com/vpctorr/DiscordBots/commit/3be4fc473ecede8c77be0b0e099f4d5ae8ba88a5))
* better error handling ([f9b8379](https://github.com/vpctorr/DiscordBots/commit/f9b8379c5bff5c937a9975ae9bad25a71f783db1))
* log discord api error messages, and ignore permission issues ([69e6aaa](https://github.com/vpctorr/DiscordBots/commit/69e6aaafc788baf6b2cdf118f0a9dafe16a7021b))
* **makepdf:** debug command triggered without mention ([8273b6a](https://github.com/vpctorr/DiscordBots/commit/8273b6a1a055e290c21546d9005e52319a89374b))
* **mk:** soffice convert use path env var ([#20](https://github.com/vpctorr/DiscordBots/issues/20)) ([2ba7f80](https://github.com/vpctorr/DiscordBots/commit/2ba7f8026f641ab3abb9cf97650379586f7ebd6c))
* **mk:** use unicode emojis ([da08ee8](https://github.com/vpctorr/DiscordBots/commit/da08ee841872dcabc5e16581dd7d653578bf9370))
* pm2 experimental-json-modules arg ([42b604d](https://github.com/vpctorr/DiscordBots/commit/42b604d05ea40838630fedef6fa51d97a633ed19))
* show environment info in debug ([d56be2f](https://github.com/vpctorr/DiscordBots/commit/d56be2fa98a49f170d547efa3e323e87bf96d92e))
* tracked error code 50001 for permissions ([b15c584](https://github.com/vpctorr/DiscordBots/commit/b15c584ed95a67e28fa4a346b64fe138bd4be3b1))
* use heroku slug as version for staging deploy ([3356b76](https://github.com/vpctorr/DiscordBots/commit/3356b762d1fdd21ffc9897fd61d48168527a39e6))
* **vn:** fixed crashes & bot not working ([3b7ea56](https://github.com/vpctorr/DiscordBots/commit/3b7ea562742135801338371a341a9623a41406dc))
* **vn:** use unicode emoji for microphone ([#36](https://github.com/vpctorr/DiscordBots/issues/36)) ([d1d9d82](https://github.com/vpctorr/DiscordBots/commit/d1d9d821dcc1251b294fd47b4aa74272d2b2f4f8))
* **voicenotify:** better channel checking ([4388060](https://github.com/vpctorr/DiscordBots/commit/43880601981c4e3e5b03c243f0089201500a29e1))
* **voicenotify:** better id check in voicechannel ([969430c](https://github.com/vpctorr/DiscordBots/commit/969430cf9d9a4eb896b154b5bdde134d7f7d6116))
* **voicenotify:** check if guild exisys before querying channel ([99b3219](https://github.com/vpctorr/DiscordBots/commit/99b3219c326a979634f01f4f2a019a6d4d38e13e))
* **voicenotify:** inverted voice channel condition ([b830ee9](https://github.com/vpctorr/DiscordBots/commit/b830ee9fd8b98248706d208fdb2565913356cbc1))
* **voicenotify:** lastThreshold would use broadcastTimes ([5a95f9a](https://github.com/vpctorr/DiscordBots/commit/5a95f9a5af4aa710e31d48a360f098145a8d6a1f))
* **voicenotify:** voice.channel.id =&gt; voice.channelID ([aba3e13](https://github.com/vpctorr/DiscordBots/commit/aba3e130598ffd043435fbde1b0e40f89034bc5a))


### 🚚 Integration

* differentiate package changelogs ([5d4834e](https://github.com/vpctorr/DiscordBots/commit/5d4834e6b84628c48c2188db0e2de7ba9765e4c0))
* new versioning tool ([23eb7c0](https://github.com/vpctorr/DiscordBots/commit/23eb7c02d2ea33c319029ba72d2b5a4a89f55c66))
* update create-release.yml ([bdc1919](https://github.com/vpctorr/DiscordBots/commit/bdc19196399d6a5a6bbb7589e5b9f3167a281577))

## [1.7.0](https://github.com/vpctorr/DiscordBots/compare/discordbots-v1.6.0...discordbots-v1.7.0) (2022-05-23)


### 🚚 Integration

* differentiate package changelogs ([c033457](https://github.com/vpctorr/DiscordBots/commit/c033457664ea530c0ddbfc63ba6a5169800892b8))


### 📚 Documentation

* updated links & added debug info ([29b832f](https://github.com/vpctorr/DiscordBots/commit/29b832fae6d7fd8ecffe1ef950fbfc5926518ae0))


### ✨ Features

* convert VoiceNotify to discord.js v13 ([#49](https://github.com/vpctorr/DiscordBots/issues/49)) ([c4b5ee3](https://github.com/vpctorr/DiscordBots/commit/c4b5ee336de40a4b4d4fb600216c3d2fdb835d18))


### 🧹 Refactor

* move bots logic to src ([c46290f](https://github.com/vpctorr/DiscordBots/commit/c46290f691d668ae30f23b2332db0a83accd5edb))

## [1.6.0](https://github.com/vpctorr/DiscordBots/compare/discordbots-v1.5.2...discordbots-v1.6.0) (2022-02-20)


### 📚 Documentation

* fix readme env var name ([eddbacb](https://github.com/vpctorr/DiscordBots/commit/eddbacb93cc4af0da1ee899af8921118c0e6648e))


### 📦 Chores

* update dependencies ([b01d669](https://github.com/vpctorr/DiscordBots/commit/b01d6695971908a5c7f2042877d3f1d0cf744152))
* updated dependencies ([fecf6fe](https://github.com/vpctorr/DiscordBots/commit/fecf6fedc92f5cbad7aaa306585266c60b0f3e7e))


### 👷 Runtime

* add postversion standalone script ([18fd8c2](https://github.com/vpctorr/DiscordBots/commit/18fd8c2d801e54d9d8abcae586495ad2c1da2c06))
* convert to npm workspaces ([2dfcac7](https://github.com/vpctorr/DiscordBots/commit/2dfcac7ebd50ce50727fea3df11977b89ae8a6ef))
* finish migrating to npm workspaces ([40f0d14](https://github.com/vpctorr/DiscordBots/commit/40f0d14a8b2c1c74c2ab2541616491c937b18416))
* remove postversion (will use github action) ([bedaa16](https://github.com/vpctorr/DiscordBots/commit/bedaa16ca158f9be273b3e59e24e7445cd196650))
* updated json modules implementation ([fd70b05](https://github.com/vpctorr/DiscordBots/commit/fd70b05d8e5ab7be1e5aec222214b5d86056ea71))


### ✨ Features

* **vn:** clear timeout with debug command ([85bf11c](https://github.com/vpctorr/DiscordBots/commit/85bf11c91f57c9a1224392dfa01bb78d6b3adbdd))


### 🔨 Improvements

* **mk:** soffice convert use path env var ([#20](https://github.com/vpctorr/DiscordBots/issues/20)) ([2ba7f80](https://github.com/vpctorr/DiscordBots/commit/2ba7f8026f641ab3abb9cf97650379586f7ebd6c))
* **mk:** use unicode emojis ([da08ee8](https://github.com/vpctorr/DiscordBots/commit/da08ee841872dcabc5e16581dd7d653578bf9370))
* use heroku slug as version for staging deploy ([3356b76](https://github.com/vpctorr/DiscordBots/commit/3356b762d1fdd21ffc9897fd61d48168527a39e6))
* **vn:** use unicode emoji for microphone ([#36](https://github.com/vpctorr/DiscordBots/issues/36)) ([d1d9d82](https://github.com/vpctorr/DiscordBots/commit/d1d9d821dcc1251b294fd47b4aa74272d2b2f4f8))


### 🚚 Integration

* new versioning tool ([23eb7c0](https://github.com/vpctorr/DiscordBots/commit/23eb7c02d2ea33c319029ba72d2b5a4a89f55c66))
