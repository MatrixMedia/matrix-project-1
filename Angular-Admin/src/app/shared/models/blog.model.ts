export interface blog {
    id?: string,
    postedBy?: string,
    thumbnailImage?: string,
    image?: string,
    pdf?: string,
    blogTitle?: string,
    blogCategory?: string,
    blogDescription?: string,
    blogStatus?: boolean,
    paymentStatus?: boolean;
    createdAt?: string
}