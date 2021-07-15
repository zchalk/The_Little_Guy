import { gql } from '@apollo/client';

/** LOGIN */
export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        firstName
        lastName
        username
        is_landlord
        image
        current_property {
            owner {
                firstName
                lastName
                username
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
  }
`;

/** USER MUTATIONS */

export const SIGN_UP = gql`
 mutation(
   $firstName: String!,
   $lastName: String!,
   $email: String!,
   $password: String!,
   $username: String!,
   $is_landlord: Boolean
   ){
    signUp(input: {
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password,
      username: $username,
      is_landlord: $is_landlord
    }) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER_IMAGE = gql`
mutation( $cloudinaryId: String) {
  addUserImage(cloudinaryId: $cloudinaryId)
}`;

export const ADD_PROPERTY_IMAGE = gql`
mutation($_id: ID!, $cloudinaryId: String) {
  addPropertyImage(_id: $_id, cloudinaryId: $cloudinaryId)
}`;

export const UPLOAD_IMAGE = gql`
  mutation($image:String!){
    uploadImage(image: $image)
  }`;

/** 

export const UPDATE_USER = gql`

`;

export const DELETE_USER = gql`

`;
**/

/** PROPERTY MUTATIONS **/

export const ADD_PROPERTY = gql`
mutation(
    $addressStreet: String,
    $addressCity: String,
    $addressState: String,
    $addressZip: String,
    $price: Int,
    $description: String,
) {
  addProperty(input: {
    addressStreet: $addressStreet,
    addressCity: $addressCity,
    addressState: $addressState,
    addressZip: $addressZip,
    price: $price,
    description: $description
  }) {
    _id
  }
}
`;

/** 
export const UPDATE_PROPERTY = gql`

`;

export const DELETE_PROPERTY = gql`

`;
*/