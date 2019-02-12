# D-Zoned

Create D-Zone's with relative ease

[![Version](https://img.shields.io/github/release/axelgreavette/D-Zoned.svg?style=flat-square)](https://img.shields.io/github/release/axelgreavette/D-Zoned.svg?style=flat-square) [![Size](https://img.shields.io/github/languages/code-size/axelgreavette/D-Zoned.svg?style=flat-square)](https://img.shields.io/github/languages/code-size/axelgreavette/D-Zoned.svg?style=flat-square) [![Latest commit](https://img.shields.io/github/last-commit/axelgreavette/D-Zoned.svg?style=flat-square)](https://img.shields.io/github/last-commit/axelgreavette/D-Zoned.svg?style=flat-square) [![Commits since](https://img.shields.io/github/commits-since/axelgreavette/D-Zoned/1.0.1.svg?style=flat-square)](https://img.shields.io/github/commits-since/axelgreavette/D-Zoned/1.0.1.svg?style=flat-square)

## Getting Started

For a no-hassle way to set up simply go to [releases](https://github.com/axelgreavette/D-Zoned/releases) and download the latest one. From there the UI should do it's job.



### Prerequisites for installation

- Electron
- Everything else in the package.json
```
npm i
```

### Installing

For those who want to build from the source first run the following to clone the repo:
```
git clone https://github.com/axelgreavette/D-Zoned
cd D-Zoned
```
Then to install the dependancies:
```
npm i
```
Then you can run 
```
electron .
```
to start the application

## Deployment

In order to package the app run the following command:
```
npm run package
```
Now to build for Windows run the following commands to build for the two archs:
```
npm run build-x64
npm run build-ia32
```
## Built With

* [Electron](https://electronjs.org) - The framework that makes this possible
* [D-Zone](https://github.com/vegeta897/d-zone) - The  Discord server sim that it's based off of

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/axelgreavette/D-Zoned/tags). 

## Authors

* **Axel Greavette** - *Initial work* - [axelgreavette](https://github.com/axelgreavette)

See also the list of [contributors](https://github.com/axelgreavette/D-Zoned/contributors) who participated in this project.

## License

This project is licensed under the RECEX SHARED SOURCE License - see the [LICENSE.md](LICENSE.md) file for more details

## Acknowledgments

* Hat tip to Vegeta897 for his amazing D-Zone creation
