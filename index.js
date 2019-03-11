const moment = require('moment'),
    getDrive = require('./getDrive'),
    driveService = require('./driveService');

const main = async () => {
    const foreachFile = async (manipulateFile, files) => {
        let average = 0;
        let total = 0;

        for (let i = 0; i < files.length; i++) {
            const startTime = moment();
            const file = files[i];

            try {
                await manipulateFile(file, i);
            } catch (ex) {
                console.error(`| === Error ${ex}`);
            }

            const finishTime = moment();

            // Get the difference from both dates
            const difference = finishTime.diff(startTime);

            total += difference;

            // Avg = total / amount
            average = total / (i + 1);

            // ETA = remaining length * average
            const filesLeft = (files.length - (i + 1));
            const eta = moment.duration(filesLeft * average);
            console.log(`|`);
            console.log(`| === Processed ${moment.duration(difference).humanize(true)} - ${filesLeft} files left - ETA: ${eta.humanize(true)}`);
            console.log(`|`);
        }
    }

    const manipulateFile = async (file, i) => {
        console.log(`| === Manipulating file ${i+1}: ${file.name}(${file.id}).`);

        // Save original name
        // Copy files getting the copy reference
        console.log(`| Copying`);
        let copy = await driveService.copyFile(driveDestination, file.id);
        console.log(`| Copied to ${copy.name}(${copy.id})`);

        // Delete original
        if (copy) {
            console.log(`| Deleting ${file.name}(${file.id})`);

            let deletion = await driveService.deleteFile(driveOrigin, file.id);
            if (deletion) {
                console.log(`| Deleted`);
            }
        }
    }

    let driveOrigin = await getDrive('ACCOUNT_ORIGIN');
    let driveDestination = await getDrive('ACCOUNT_DESTINATION');

    console.log(`| ------------------------------------------------------------`);
    console.log(`| ========  Querying files`);
    console.log(`|`);
    const queryStartDate = moment();
    // Find files
    let files = await driveService.getFilesFromQuery(driveDestination, "not 'ACCOUNT_DESTINATION@gmail.com' in owners");
    console.log(`|`);
    console.log(`| ======== Finished querying - Found ${files.length} files ${moment.duration(moment().diff(queryStartDate)).humanize(true)}`);
    console.log(`------------------------------------------------------------`);

    const filesStartDate = moment();
    console.log(`| ========  Manipulating files`);
    console.log(`|`);
    // This function encapsulates the ETA calculation
    await foreachFile(manipulateFile, files);
    console.log(`|`);
    console.log(`| ======== Finished manipulation ${filesStartDate.toNow()}`);
    console.log(`| ------------------------------------------------------------`);
}

main()
    .then(console.log)
    .catch(console.error);