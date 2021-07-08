const { AuthenticationError } = require('apollo-server-express');
const { ApolloError } = require('apollo-server-errors');

const { User, Property } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { args }) => {

            return await User.findOne({ args });
        },
        property: async (parent, { input }) => {
            const property = await Property.findOne(
                {
                    addressStreet: input.addressStreet,
                    addressCity: input.addressCity,
                    addressState: input.addressState,
                    addressZip: input.addressZip,
                   }
            ).populate('User');
            if(!property) throw new AuthenticationError('No property found')
            return property
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id })
                return user;
            }
            throw new AuthenticationError('Not Logged In');
        },
        myProperties: async (parent, args, context) => {
            if (context.user) {
                const userProperties = await Property.find({ owner: "60dd1d3d495bb208abc6ed0b"}).populate('Images')
                return userProperties
            }
            throw new AuthenticationError('Not logged In!');
        },
        myTenants: async (parent, args, context) => {
            if (context.user) {
                const userTenants = await Property.find({ owner: context.user._id}).populate({
                    path: 'tenant',
                    populate: 'User'
                });
                let tenants = [];
                userTenants.forEach((property) => tenants.push(property.tenant) )
                return tenants;
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
        },
        getRating: async (parent, { id }) => {
            try {
                const userRating = await User.aggregate([{ $match: { _id: id } },
                {
                    $group: {
                        _id: id,
                        rating: { $avg: 'rating' }
                    }
                }]);
                console.log(userRating)
                return userRating
            } catch (error) {
                console.log(error)
                throw new AuthenticationError('There are no rating yet!')
            }
        },
        findLandlord: async (parent, { input }) => {
            try {
                const property = await Property.findOne(
                    {
                     addressStreet: input.addressStreet,
                     addressCity: input.addressCity,
                     addressState: input.addressState,
                     addressZip: input.addressZip,
                    }).populate({
                    path: 'owner',
                    populate: 'User'
                });
                const {owner} = property;
                return owner
            } catch (error) {
                throw new AuthenticationError('No property found')
            }
        },

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
            if (checkEmail) {
                throw new ApolloError('Email already exists!');
            }

            // they are unique, so create the user
            const user = await User.create(input);
            const token = signToken(user);

            return { token, user };
        },
        updateMyProperties: async (parent, args, context) => {
            if(context.user) {
            const property = await Property.updateOne({ owner: context.user._id })
            }
            throw new AuthenticationError('Not Logged In');
        },
        updateMySavedProperties: async (parent, context) => {

        },
        addUserImage: async (parent, {image}, context) => {
            if(context.user) {
                const user = await User.updateOne({_id: context.user._id}, {image: image})
                return {user};
            } throw new AuthenticationError('Not Logged In');
        },
        addPropertyImages: async (parent, {_id, image}, context) => {
            if (context.user) {
            const property = await Property.updateOne({_id: _id}, {$push: {images: image}})
            return property;
            } throw new AuthenticationError('Not Logged In');
        },
        deleteProperty: async (parent, {_id}, context) => {
            try {
                if(context.user){
                const user = await User.findOneDelete({owned_properties: context.user._id});
                const property = await Property.deleteOne({_id:_id});

                return property;
                } 
                throw new AuthenticationError('Not Logged In')
            } catch (error) {
                throw new AuthenticationError('No property was found');
            }
        },
        deleteUser: async (parent, context) => {
            try {
                if(context.user) {
                const  user = await User.findByIdAndDelete(context.user._id);
                const token = ''
                return { token, user}
                } 
                throw new AuthenticationError('Not Logged In')
            } catch (error) {
                throw new AuthenticationError(error);
            }
        }

    }
};

module.exports = resolvers;