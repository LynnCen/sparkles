enum EventTypes {
    BucketChanged = "Bucket_Change", // bucket invalid need changed
    BasicBucketChanged = "Basic_Bucket_Change", // basic bucket invalid need changed
    PullDone = "Pull_Down", // single pull message done called
    UnreadCountUpdate = "Unread_Count_Update",

    LoginSuccess = "Login_Success",

    TmmInit = "Tmm_Init_Start", // Im configs init
}

export default EventTypes;
