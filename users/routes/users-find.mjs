// Support for finding a user by email
export const findUser = async (User, email) => {
    console.log("Getting user with email: ", User,  email);
    if (email) {
        return User.find({ email: email })
        .then(users => {
            if (users.length === 0) {
                return createResponse(404, { error: 'User not found' });
            } else if (users.length > 1) {
                return createResponse(500, { error: 'Multiple users found' });
            }
            return createResponse(200, { data: users[0] });
        })
        .catch(error => {
            console.log("Received user search error: ", error);
            return createResponse(500, { error: error?.message || 'Received find user error' });
        });
    } else {
        return createResponse(400, { error: 'Missing email query parameter' });
    }
};


function createResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    }
}