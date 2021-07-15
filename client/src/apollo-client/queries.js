import { gql } from '@apollo/client';

/**  single property
export const QUERY_PROPERTY = gql`

`;

// multiple properties
export const QUERY_PROPERTIES = gql`

`;
*/

export const QUERY_ALL_PROPERTIES = gql`
   {
       allProperties {
            _id
           addressStreet
           addressCity
           addressState
           addressZip
           price
           description
           owner {
           		firstName
            	lastName
           }
           images
       }
   }
`;

export const QUERY_MY_PROPERTIES = gql`
{
   myProperties {
            _id
            addressStreet
            addressCity
            addressState
            addressZip
            tenant {
                firstName
                lastName
                email
            }
            price
            images
    }
}
`;

// query me
export const QUERY_ME = gql`
{
    me {
        _id
        username
        firstName
        lastName
        email
        is_landlord
        image
        current_property {
            owner {
                firstName
                lastName
            }
            addressStreet
            addressCity
            addressState
            addressZip
            price
            images
            description
        }
    }
}
`;

/** single user
export const QUERY_USER = gql`
    
`;

// multiple users
export const QUERY_USERS = gql`
    
`;
*/

/**
 * 
 * Additional models/collections:
 * 1. Documents (lease, etc)
 * 2. Pictures
 * 
 */