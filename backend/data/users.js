import bcrypt from 'bcryptjs';


const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Riad',
        email: 'riad@example.com',
        password: bcrypt.hashSync('123456', 10)

    },
    {
        name: 'Prince',
        email: 'prince@example.com',
        password: bcrypt.hashSync('123456', 10)
        
    }
]

export default users