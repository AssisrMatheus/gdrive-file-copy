const driveService = {
    getFilesFromQuery: async (drive, query, paginate = true, pageToken = null, pageSize = 100, pageNumber = 1) => {
        return new Promise((resolve, reject) => {
            console.log(`| Querying files for page ${pageNumber}`);

            drive.files.list({
                q: query,
                spaces: 'drive',
                pageToken,
                pageSize
            }, async (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                if (res.data.files.length) {
                    let files = new Array();
                    files = files.concat(res.data.files);

                    if (paginate && res.data.nextPageToken !== undefined) {
                        pageToken = res.data.nextPageToken;
                        const otherFiles = await driveService.getFilesFromQuery(drive, query, paginate, pageToken, pageSize, pageNumber + 1);
                        files = files.concat(otherFiles);
                    }

                    resolve(files);
                }
            });
        });
    },
    copyFile: async (drive, fileId) => {
        return new Promise((resolve, reject) => {
            drive.files.copy({
                fileId,
            }, (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res.statusText);
                }
            });
        });
    },
    deleteFile: async (drive, fileId) => {
        return new Promise((resolve, reject) => {
            drive.files.delete({
                fileId,
            }, (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                if (res.status === 204) {
                    resolve(true);
                } else if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res.statusText);
                }
            });
        });
    },
    transferOwnership: async (drive, fileId, emailAddress, role, type) => {
        return new Promise((resolve, reject) => {
            drive.permissions.create({
                fileId,
                transferOwnership: role === "owner" ? true : false,
                resource: {
                    emailAddress,
                    role,
                    type
                }
            }, (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res.statusText);
                }
            });
        });
    },
}

module.exports = driveService;