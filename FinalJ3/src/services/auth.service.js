const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../entities/User');
const ApiError = require('../utils/ApiError');

const userRepository = AppDataSource.getRepository(User);

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

class AuthService {
    async register(email, password, role) {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ApiError(400, 'Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword,
            role: role || 'CLIENT',
        });

        await userRepository.save(user);
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(email, password) {
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const tokens = generateTokens(user);
        return { user, ...tokens };
    }

    async refresh(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
            const user = await userRepository.findOneBy({ id: decoded.id });
            if (!user) {
                throw new ApiError(401, 'User not found');
            }
            return generateTokens(user);
        } catch (error) {
            throw new ApiError(403, 'Invalid refresh token');
        }
    }
}

module.exports = new AuthService();
