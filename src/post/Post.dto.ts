import { IsNotEmpty, MaxLength, Min, MinLength, IsOptional } from "class-validator";

interface PostInterface {
    title: string,
    describe: string,
    image: any
}

export class PostDTO implements PostInterface {
    @IsNotEmpty({ message: "Title cannot be empty" })
    @MinLength(5, { message: "Title is too short" })
    @MaxLength(100, { message: "Title is too long" })
    readonly title: string;

    @IsNotEmpty({ message: "Description is required"})
    @MinLength(2)
    @MaxLength(500, { message: "Description is too long. Your're not Shakespeare!"})
    readonly describe: string;

    @IsOptional()
    readonly image: any;

    constructor(data?: PostInterface) {
        if (data) {
            this.title = data.title;
            this.describe = data.describe;
            this.image = data.image;
        }
    }
}