export const registration = async(req , res) =>{

    const fakeUser ={
        _id: 'someRando',
        email: 'testuser@example.com',
    };

    res.status(201).json({
        user: fakeUser,
        token: 'fake-xyz-abc',
    });

};