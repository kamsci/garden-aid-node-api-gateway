// Purpose: To get all users from the database
export const getUsers = async (User) => {
    console.log("Getting users");
    return User.find()
    .then(users => {
        return createResponse(200, { data: users });
    })
    .catch(error => {
        console.log("Received user search error: ", error);
        return createResponse(500, { error: error?.message || 'Received find user error' });
    });
};


function createResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    }
}