import multer from 'multer';

const storageConfig = multer.diskStorage({
    destination(req, file, callback) {
        const image = file.mimetype.split('/')[0] === 'image';
        const pdf = file.mimetype.split('/')[1] === 'pdf';
        const video = file.mimetype.split('/')[0] === 'video';

        if (image) {
            callback(null, './tmp/images');
        } else if (pdf) {
            callback(null, './public/pdfs');
        } else if (video) {
            callback(null, './public/videos');
        }
    },
    filename(req, file, callback) {
        //@ts-expect-error
        const auth = req.headers.authorization?.split(' ')[1];
        const image = file.mimetype.split('/')[0] === 'image';
        const pdf = file.mimetype.split('/')[1] === 'pdf';
        const video = file.mimetype.split('/')[0] === 'video';

        // console.log(auth);
        // console.log(image);
        // console.log(pdf);
        // console.log(video)
        // console.log(file.mimetype);

        if (image) {
            callback(null, Date.now() + '.jpg');
        } else if (pdf) {
            callback(null, Date.now() + '.pdf');
        } else if (video) {
            callback(null, Date.now() + '.mp4');
        }
    },
});

export const upload = multer({
    storage: storageConfig,
    fileFilter: (req, file, callback) => {
        const allowed: string[] = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'application/pdf',
            'video/mp4',
        ];

        req.body.price = Number(req.body.price);

        callback(null, allowed.includes(file.mimetype));
        // console.log(allowed);
    },
});
