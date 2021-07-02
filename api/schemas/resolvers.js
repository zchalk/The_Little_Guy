const { AuthenticationError } = require('apollo-server-express');
const { ApolloError } = require('apollo-server-errors');

const { User, Property } = require('../models');
const { signToken } = require('../utils/auth');

/**
 * TODO: 
 * 1. Properties resolver to pull 15 properties 
 * 2. Update user resolver
 * 3. Update property resolver
 * 4. Add property
 * 5. Remove property
 */

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
        tenants: async (parent, args, context) => {
            if (context.user) {
                const userTenants = Property.find({ owner: context.user._id }).populate({
                    path: 'Property.tenant',
                    populate: 'User'
                });
                return userTenats;
            }
            throw new AuthenticationError('Not Logged In!');
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
        }
    }
};

module.exports = resolvers;