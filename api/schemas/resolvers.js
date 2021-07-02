const { AuthenticationError } = require('apollo-server-express');
const { User, Property } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (id) => {
            return await User.findOne({ _id: id });
        },
        property: async (parent, { address }) => {
            const params = {};
            if (address) {
                params.address = address;
            }
            return await Property.find(params);
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id }).populate('Property').populate({
                    path: 'Property.Images',
                    populate: 'Images'
                })
                return user;
            }
            throw new AuthenticationError('Not Logged In');
        },
        myProperties: async (parent, args, context) => {
            if (context.user) {
                const userProperties = await Property.find({ owner: context.user._id }).populate('Images')
                return userProperties
            }
            throw new AuthenticationError('Not logged In!');
        },
        myTenants: async (parent, args, context) => {
            if (context.user) {
                const userTenants = Property.find({ owner: context.user._id }).populate({
                    path: 'Property.tenant',
                    populate: 'User'
                });
                return userTenats;
            }
            throw new AuthenticationError('Not Logged In!');
        },
        allProperties: async (parent,) => {
            try {
                const allProperties = Property.find().populate('User');
                return allProperties
            } catch (error) {
                throw new AuthenticationError('No Properties found');
            }
        }

    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('user not found');
            };

            const passCheck = await user.isCorrectPassword(password);

            if (!passCheck) {
                throw new AuthenticationError('password wrong');
            }

            const token = signToken(user);
            return { token, user };
        },
        signUp: async (parent, { input }) => {
            const newUser = await User.create(input);
            const token = await signToken(user);

            return { token, user };
        },
        updateMyProperties: async (parent, args, context) => {
            const property = await Property.updateOne({ owner: context.user._id },
                {}
            )

        }
    }
};

module.exports = resolvers;