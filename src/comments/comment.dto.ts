import { IsBase64, IsNotEmpty, IsOptional, IsUUID, MaxLength } from "class-validator";

interface CommentsInterface {
    content: string,
    image?: string,
    postUuid: string
}

export class CommentDTO implements CommentsInterface {
    @IsNotEmpty({ message: 'Content cannot be empty' })
    @MaxLength(500, { message: 'Content is too long' })
    readonly content: string;

    @IsOptional()
    @IsBase64()
    readonly image: string;

    @IsNotEmpty({ message: 'Post UUID cannot be empty' })
    @IsUUID()
    readonly postUuid: string;

    constructor(data?: CommentsInterface) {
        if (data) {
            this.content = data.content;
            this.image = data.image ? data.image : '';
            this.postUuid = data.postUuid;
        }
    }
}