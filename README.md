<p align="center">
	<a href="https://gitmoji.carloscuesta.me">
		<img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
			 alt="Gitmoji">
	</a>
</p>

**gdrive-file-copy** find files on Google Drive with the given query and copies it for you. 
This application was quickstarted with [gsuitedevs/node-samples](https://github.com/gsuitedevs/node-samples/tree/master/drive/quickstart) using [the API reference](https://developers.google.com/drive/api/v3/reference) as a reference. It is not a complete project but rather a starting point for anyone willing to manipulate files on google drive with javascript/node.

I reached the max GB on my account on Drive but when I created a new account, shared the new account's folder with the previous account and then moved my stuff, it still took the same space from the original account. This happens because the owner is still the original account. To bypass this, you must copy every file on the second account and unfortunately google drive doesn't have a "copy all" button, so I made this. It searches on the second accound every file that the seccond accoun't doesn't own, copy it and then delete it using the first account.


<p align="center">
	<img src="./gif.gif">
</p>

## How to run
1. First, you have to install dependencies
    ```
    npm install
    ```

2. Then modify the ```index.js``` file on line:
    ```js
    await driveService.getFilesFromQuery(driveDestination, "not 'ACCOUNT_DESTINATION@gmail.com' in owners");
    ```

    changing ```"not 'ACCOUNT_DESTINATION@gmail.com' in owners"``` to the desired query.

```ACCOUNT_ORIGIN``` and ```ACCOUNT_DESTINATION```(not the one in the query) are just namings to be shown in the console.

3. Then run with

    ```
    npm start
    ```

4. It will ask you to log in with a link. Open it with the browser and then paste the code back on the console. It asks twice because I'm copying files from an account and deleting them from the original one. You can modify this on lines:
    ```js
    let driveOrigin = await getDrive('ACCOUNT_ORIGIN');
    let driveDestination = await getDrive('ACCOUNT_DESTINATION');
    ```