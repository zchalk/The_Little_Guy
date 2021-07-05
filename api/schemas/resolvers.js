const { AuthenticationError } = require('apollo-server-express');
const { ApolloError } = require('apollo-server-errors');

const { User, Property } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { args }) => {

            return await User.findOne({ args });
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
        allProperties: async (parent, args) => {
            try {
                const allProperties = Property.find().populate('User').limit(20);
                return allProperties;
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
            const { username, email } = input;

            // make sure username and email are unique 

            //const checkUser = await User.findOne({ username });
            //if(checkUser) {
            //    throw new ApolloError('Username already exists!');
            //}

            const checkEmail = await User.findOne({ email });
            if(checkEmail) {
                throw new ApolloError('Email already exists!');
            }

            // they are unique, so create the user
            const user = await User.create(input);
            const token = signToken(user);

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