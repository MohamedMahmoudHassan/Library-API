{
    user_id: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    cart: [
        {
            type: String
        }
    ],
    bor_list: [
        {
            type: String
        }
    ],
    soft_list: [
        {
            type: String
        }
    ]
}
