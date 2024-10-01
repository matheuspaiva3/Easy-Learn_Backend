export type JwtPayload = {
    id: number;
};

export type uploadTypes = {
    image: Express.Multer.File[];
    pdf: Express.Multer.File[];
    video: Express.Multer.File[];
};

export type userId = {
    id: number;
};
